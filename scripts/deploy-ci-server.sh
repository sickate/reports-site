#!/bin/bash
set -euo pipefail

readonly ci_dir=/var/lib/instap-reports-ci
readonly site_dir=/var/www/reports
readonly installed_script=/usr/local/libexec/instap-reports-ci

sync_site() {
  if [[ ! -s "$ci_dir/incoming/index.html" ||
        ! -s "$ci_dir/incoming/data/company-financials.jsonl" ||
        ! -s "$ci_dir/incoming/report-text/index.json" ]]; then
    echo "The staged reports build is incomplete." >&2
    return 1
  fi

  # Keep executable scripts, deployment backups and live cron data outside CI.
  /usr/bin/rsync -rt --delay-updates --delete-delay --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r \
    --exclude='/scripts/' \
    --exclude='/.backups/' \
    --exclude='/.art-of-light-before.html' \
    --exclude='/data/metals-daily.json' \
    --exclude='/data/metals-prices.json' \
    --exclude='/data/cosco-shipping-energy.json' \
    "$@" "$ci_dir/incoming/" "$site_dir/"
}

case "${1:-}" in
  ssh)
    case "${SSH_ORIGINAL_COMMAND:-}" in
      'rsync --server '*)
        exec 9< "$ci_dir/transfer.lock"
        /usr/bin/flock -x 9
        exec /usr/bin/rrsync -wo -munge "$ci_dir/incoming"
        ;;
      'publish')
        exec /usr/bin/sudo -n -u tzhu "$installed_script" publish
        ;;
      *)
        echo "This SSH key can only stage and publish the reports site." >&2
        exit 1
        ;;
    esac
    ;;
  preview|publish)
    exec 9< "$ci_dir/transfer.lock"
    /usr/bin/flock -x 9
    if [[ "$1" == preview ]]; then
      sync_site --dry-run --itemize-changes --out-format='%i %n%L'
    else
      sync_site
      # Reload the existing catalog only when the MCP service is running.
      if /usr/bin/systemctl is-active --quiet instap-reports-mcp; then
        /usr/bin/sudo -n /usr/bin/systemctl restart instap-reports-mcp
      fi
    fi
    ;;
  *)
    echo "Usage: $0 {ssh|preview|publish}" >&2
    exit 2
    ;;
esac
