#!/usr/bin/env python3
"""
COSCO Shipping Energy - Indicator B: VLCC 10-year secondhand / newbuild price ratio

Scrapes Hellenic Shipping News weekly shipbuilding roundups (Clarksons Research
summaries) to extract "VLCC newbuilding $XXXm" and "10 year VLCC $XXm" figures,
then computes the ratio. Writes into public/data/cosco-shipping-energy.json.

Alert thresholds (per v3.1 report):
    ratio >= 0.70  -> alert (elevated enthusiasm)
    ratio >= 0.80  -> extreme (tops typically form here)

Failure handling: if primary AND fallback sources both fail to produce a valid
pair of numbers, the script logs ERROR and exits 1 WITHOUT overwriting the
existing latest snapshot - we never pollute the metric with null/stale data.

Run:
    DATA_FILE=public/data/cosco-shipping-energy.json python3 scripts/cosco_price_ratio.py
"""

from __future__ import annotations

import json
import os
import re
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

import requests
from bs4 import BeautifulSoup

DATA_FILE = Path(
    os.environ.get(
        "DATA_FILE",
        str(Path(__file__).resolve().parent.parent / "public" / "data" / "cosco-shipping-energy.json"),
    )
)

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
REQUEST_TIMEOUT = 20

PRIMARY_URL = "https://www.hellenicshippingnews.com/category/shipping-news/shipbuilding-news/"
FALLBACK_URL = (
    "https://www.hellenicshippingnews.com/weekly-shipping-market-roundup-by-intermodal-shipbrokers/"
)

NEWBUILD_PATTERN = re.compile(
    r"VLCC[^$]{0,80}?newbuilding[^$]{0,40}?\$(\d+(?:\.\d+)?)\s*m",
    re.IGNORECASE,
)
SECONDHAND_PATTERN = re.compile(
    r"(?:10|ten)[\s-]*(?:yr|year|年)[^$]{0,60}?VLCC[^$]{0,60}?\$(\d+(?:\.\d+)?)\s*m",
    re.IGNORECASE,
)
# loose fallback patterns that swap order
NEWBUILD_PATTERN_ALT = re.compile(
    r"newbuilding[^$]{0,40}?VLCC[^$]{0,40}?\$(\d+(?:\.\d+)?)\s*m",
    re.IGNORECASE,
)
SECONDHAND_PATTERN_ALT = re.compile(
    r"VLCC[^$]{0,40}?10[\s-]*(?:yr|year)[^$]{0,40}?\$(\d+(?:\.\d+)?)\s*m",
    re.IGNORECASE,
)

THRESHOLD_ALERT = 0.70
THRESHOLD_EXTREME = 0.80
HISTORY_MAX_WEEKS = 52


def log(msg: str) -> None:
    print(f"[{datetime.now(timezone.utc).isoformat()}] {msg}", flush=True)


def fetch_html(url: str) -> str | None:
    try:
        resp = requests.get(
            url,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "text/html,application/xhtml+xml",
                "Accept-Language": "en-US,en;q=0.9",
            },
            timeout=REQUEST_TIMEOUT,
        )
        if resp.status_code != 200:
            log(f"  HTTP {resp.status_code} fetching {url}")
            return None
        return resp.text
    except Exception as exc:
        log(f"  ERROR fetching {url}: {exc}")
        return None


def extract_pair(text: str) -> tuple[float, float] | None:
    nb_match = NEWBUILD_PATTERN.search(text) or NEWBUILD_PATTERN_ALT.search(text)
    sh_match = SECONDHAND_PATTERN.search(text) or SECONDHAND_PATTERN_ALT.search(text)
    if not (nb_match and sh_match):
        return None
    try:
        nb = float(nb_match.group(1))
        sh = float(sh_match.group(1))
    except ValueError:
        return None
    # sanity-check ranges ($80m–$200m newbuild, $40m–$180m secondhand)
    if not (80 <= nb <= 200 and 40 <= sh <= 200):
        return None
    return nb, sh


def scan_category_page(category_url: str) -> tuple[float, float, str] | None:
    html = fetch_html(category_url)
    if not html:
        return None
    soup = BeautifulSoup(html, "html.parser")
    article_links: list[str] = []
    for heading in soup.find_all(["h2", "h3"])[:20]:
        a = heading.find("a", href=True)
        if a and a["href"].startswith("http"):
            article_links.append(a["href"])
    log(f"  Found {len(article_links)} candidate articles")

    for link in article_links[:10]:
        article_html = fetch_html(link)
        if not article_html:
            continue
        text = BeautifulSoup(article_html, "html.parser").get_text(" ", strip=True)
        pair = extract_pair(text)
        if pair:
            nb, sh = pair
            log(f"  Match in {link}: newbuild=${nb}m, 10yr=${sh}m")
            return nb, sh, link
    return None


def scan_single_article(url: str) -> tuple[float, float, str] | None:
    html = fetch_html(url)
    if not html:
        return None
    text = BeautifulSoup(html, "html.parser").get_text(" ", strip=True)
    pair = extract_pair(text)
    if pair:
        nb, sh = pair
        log(f"  Match in fallback: newbuild=${nb}m, 10yr=${sh}m")
        return nb, sh, url
    return None


def write_json_atomic(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        mode="w",
        encoding="utf-8",
        dir=str(path.parent),
        prefix=path.name + ".",
        suffix=".tmp",
        delete=False,
    ) as tmp:
        json.dump(data, tmp, ensure_ascii=False, indent=2)
        tmp.write("\n")
        tmp_path = Path(tmp.name)
    os.replace(tmp_path, path)


def main() -> int:
    log("=" * 60)
    log("COSCO · Indicator B · VLCC 10yr/newbuild price ratio")
    log(f"DATA_FILE: {DATA_FILE}")
    log("=" * 60)

    if not DATA_FILE.exists():
        log(f"ERROR: data file not found at {DATA_FILE}")
        return 1

    with DATA_FILE.open("r", encoding="utf-8") as f:
        data = json.load(f)

    if "metrics" not in data or "vlccPriceRatio" not in data["metrics"]:
        log("ERROR: data file missing metrics.vlccPriceRatio")
        return 1

    log(f"Trying primary source: {PRIMARY_URL}")
    result = scan_category_page(PRIMARY_URL)

    if not result:
        log(f"Primary source failed, trying fallback: {FALLBACK_URL}")
        result = scan_single_article(FALLBACK_URL)

    if not result:
        log("ERROR: both primary and fallback sources produced no valid pair.")
        log("NOT overwriting existing latest snapshot. Exiting 1.")
        return 1

    nb_price, sh_price, source_url = result
    ratio = round(sh_price / nb_price, 3)
    as_of = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    metric = data["metrics"]["vlccPriceRatio"]
    metric["latest"] = {
        "value": ratio,
        "asOf": as_of,
        "newbuildUsdM": nb_price,
        "secondhand10yrUsdM": sh_price,
        "sourceUrl": source_url,
        "alert": ratio >= THRESHOLD_ALERT,
        "extreme": ratio >= THRESHOLD_EXTREME,
    }

    history = metric.get("history", [])
    history.append(
        {
            "date": as_of,
            "value": ratio,
            "newbuildUsdM": nb_price,
            "secondhand10yrUsdM": sh_price,
        }
    )
    metric["history"] = history[-HISTORY_MAX_WEEKS:]

    data["lastUpdated"] = datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")
    write_json_atomic(DATA_FILE, data)

    log("-" * 60)
    log(f"Ratio: {ratio} (nb ${nb_price}m / 10yr ${sh_price}m)")
    log(f"Alert  (>= {THRESHOLD_ALERT}): {ratio >= THRESHOLD_ALERT}")
    log(f"Extreme (>= {THRESHOLD_EXTREME}): {ratio >= THRESHOLD_EXTREME}")
    log(f"History length: {len(metric['history'])}")
    log("Done.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:
        log(f"FATAL: {exc}")
        sys.exit(1)
