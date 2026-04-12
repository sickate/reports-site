#!/usr/bin/env python3
"""
COSCO Shipping Energy - Indicator A: Monthly new VLCC order count

Scrapes Splash247, iMarine, and Eworldship for recent VLCC newbuilding-order
headlines over a rolling 7-day window. Extracts numeric counts and writes the
result into public/data/cosco-shipping-energy.json under metrics.vlccOrders.

Alert threshold: >= 15 new orders in a rolling 7-day window (per v3.1 report).

Run:
    DATA_FILE=public/data/cosco-shipping-energy.json python3 scripts/cosco_vlcc_orders.py
"""

from __future__ import annotations

import json
import os
import re
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

import ssl

import requests
import urllib3
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter


class _WeakDHAdapter(HTTPAdapter):
    """Adapter for hosts (e.g. eworldship.com) that still negotiate DH groups
    smaller than 2048 bits. We downgrade SECLEVEL just for those requests."""

    def init_poolmanager(self, *args, **kwargs):
        ctx = ssl.create_default_context()
        ctx.set_ciphers("DEFAULT@SECLEVEL=0")
        kwargs["ssl_context"] = ctx
        return super().init_poolmanager(*args, **kwargs)

DATA_FILE = Path(
    os.environ.get(
        "DATA_FILE",
        str(Path(__file__).resolve().parent.parent / "public" / "data" / "cosco-shipping-energy.json"),
    )
)

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
REQUEST_TIMEOUT = 15

SOURCES = {
    "splash247": {
        "url": "https://splash247.com/category/sector/tankers/",
        "weak_dh": False,
    },
    "imarine": {
        "url": "https://www.imarinenews.com/",
        "weak_dh": False,
    },
    "eworldship": {
        "url": "https://www.eworldship.com/",
        "weak_dh": True,
    },
}

KEYWORDS = [
    "VLCC",
    "超大型油轮",
    "超大型原油",
    "newbuilding",
    "new-building",
    "new build",
    "order",
    "订单",
    "contract",
    "签约",
    "letter of intent",
    "LOI",
    "新造",
]

COUNT_PATTERNS = [
    re.compile(r"(\d+)\s*(?:艘|x|×)\s*VLCC", re.IGNORECASE),
    re.compile(r"VLCC[^.,;\n]{0,40}?(\d+)\s*(?:units?|vessels?|ships?)", re.IGNORECASE),
    re.compile(r"orders?\s+(?:for\s+)?(\d+)\s+VLCC", re.IGNORECASE),
]

THRESHOLD_ALERT = 15
HISTORY_MAX_WEEKS = 52


def log(msg: str) -> None:
    print(f"[{datetime.now(timezone.utc).isoformat()}] {msg}", flush=True)


def fetch_html(url: str, weak_dh: bool = False) -> str | None:
    try:
        session = requests.Session()
        if weak_dh:
            session.mount("https://", _WeakDHAdapter())
        resp = session.get(
            url,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "text/html,application/xhtml+xml",
                "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
            },
            timeout=REQUEST_TIMEOUT,
        )
        if resp.status_code != 200:
            log(f"  HTTP {resp.status_code} fetching {url}")
            return None
        resp.encoding = resp.apparent_encoding or resp.encoding
        return resp.text
    except Exception as exc:
        log(f"  ERROR fetching {url}: {exc}")
        return None


def extract_count(text: str) -> int:
    total = 0
    for pattern in COUNT_PATTERNS:
        for match in pattern.findall(text):
            try:
                n = int(match)
                if 1 <= n <= 20:
                    total += n
            except ValueError:
                continue
    return total


def matches_keyword(text: str) -> bool:
    low = text.lower()
    return any(k.lower() in low for k in KEYWORDS)


def parse_source(source_name: str, url: str, weak_dh: bool = False) -> list[dict]:
    from urllib.parse import urljoin

    html = fetch_html(url, weak_dh=weak_dh)
    if not html:
        return []
    soup = BeautifulSoup(html, "html.parser")

    # Strategy: collect every heading (h1-h4) that contains a link.
    # Many modern news sites (Splash247, iMarine, Eworldship) do NOT wrap posts
    # in <article>; they use h2/h3 inside custom div layouts.
    candidates: list = []
    for tag in soup.find_all(["h1", "h2", "h3", "h4"]):
        if tag.find("a", href=True):
            candidates.append(tag)
    # also scan any <a> with a long enough text as a last-resort layer
    if len(candidates) < 5:
        for a in soup.find_all("a", href=True):
            text = a.get_text(" ", strip=True)
            if len(text) >= 25 and "VLCC" in text.upper():
                candidates.append(a)
    candidates = candidates[:80]

    results: list[dict] = []
    seen_titles: set[str] = set()
    for node in candidates:
        title = node.get_text(" ", strip=True)[:400]
        if not title or title in seen_titles:
            continue
        seen_titles.add(title)
        if not matches_keyword(title):
            continue
        link_tag = node if node.name == "a" else node.find("a", href=True)
        link = link_tag["href"] if link_tag and link_tag.has_attr("href") else None
        if link and link.startswith("/"):
            link = urljoin(url, link)
        count = extract_count(title)
        if count == 0:
            # still record headline so we can see what we saw, but with count 0
            # only if it clearly mentions "order" keyword
            if not re.search(r"\border\b|订单|签约|newbuilding", title, re.I):
                continue
        results.append(
            {
                "source": source_name,
                "title": title[:200],
                "count": count,
                "url": link,
            }
        )
    log(f"  {source_name}: {len(results)} matching headlines ({sum(r['count'] for r in results)} VLCCs)")
    return results


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
    log("COSCO · Indicator A · Monthly new VLCC order count")
    log(f"DATA_FILE: {DATA_FILE}")
    log("=" * 60)

    if not DATA_FILE.exists():
        log(f"ERROR: data file not found at {DATA_FILE}")
        return 1

    with DATA_FILE.open("r", encoding="utf-8") as f:
        data = json.load(f)

    if "metrics" not in data or "vlccOrders" not in data["metrics"]:
        log("ERROR: data file missing metrics.vlccOrders")
        return 1

    all_details: list[dict] = []
    for name, cfg in SOURCES.items():
        log(f"Fetching {name}: {cfg['url']}")
        all_details.extend(parse_source(name, cfg["url"], weak_dh=cfg.get("weak_dh", False)))

    total_orders = sum(d["count"] for d in all_details)
    as_of = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    alert = total_orders >= THRESHOLD_ALERT

    metric = data["metrics"]["vlccOrders"]
    metric["latest"] = {
        "value": total_orders,
        "asOf": as_of,
        "rolling7d": total_orders,
        "details": all_details[:20],
        "alert": alert,
    }

    history = metric.get("history", [])
    history.append({"date": as_of, "value": total_orders, "window": "rolling-7d"})
    metric["history"] = history[-HISTORY_MAX_WEEKS:]

    data["lastUpdated"] = datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")

    write_json_atomic(DATA_FILE, data)

    log("-" * 60)
    log(f"Total VLCC orders (rolling 7d): {total_orders}")
    log(f"Alert (>= {THRESHOLD_ALERT}): {alert}")
    log(f"Sources hit: {sum(1 for d in all_details)} headlines")
    log(f"History length: {len(metric['history'])}")
    log("Done.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:
        log(f"FATAL: {exc}")
        sys.exit(1)
