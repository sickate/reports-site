#!/bin/bash
set -e

# Configuration
REMOTE_USER="tzhu"
REMOTE_HOST="maru"
REMOTE_PATH="/var/www/reports"
BUILD_DIR="dist"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== Building project ===${NC}"
npm run build

if [ ! -f "$BUILD_DIR/data/company-financials.jsonl" ]; then
  echo "Missing $BUILD_DIR/data/company-financials.jsonl after build"
  exit 1
fi

echo -e "${YELLOW}=== Syncing to server ===${NC}"
# NOTE: data/metals-daily.json is excluded so deploys never wipe the daily price
# history the cron accumulates server-side (it is created/owned by the cron, seeded
# once via scp). The yearly metals-prices.json is intentionally NOT excluded — it
# self-heals on the next hourly update.
rsync -avz --delete --chmod=D755,F644 \
  --exclude '.git' \
  --exclude '.DS_Store' \
  --exclude 'node_modules' \
  --exclude 'scripts' \
  --exclude 'data/metals-daily.json' \
  "$BUILD_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

echo -e "${YELLOW}=== Syncing monitoring scripts ===${NC}"
rsync -avz --chmod=D755,F644 \
  scripts/cosco_vlcc_orders.py \
  scripts/cosco_price_ratio.py \
  scripts/requirements.txt \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/scripts/"

echo -e "${YELLOW}=== Syncing metals price scripts ===${NC}"
# Keep the daily-price pipeline on the server in sync (the hourly cron runs
# update-prices.js; backfill-daily.mjs is run manually to seed/enrich history).
rsync -avz --chmod=D755,F644 \
  scripts/update-prices.js \
  scripts/backfill-daily.mjs \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/scripts/"
rsync -avz --chmod=D755,F644 \
  scripts/lib/ \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/scripts/lib/"

echo -e "${YELLOW}=== Updating Python deps ===${NC}"
ssh "$REMOTE_USER@$REMOTE_HOST" \
  "cd $REMOTE_PATH/scripts && .venv/bin/pip install -q -r requirements.txt 2>&1 | tail -1"

echo -e "${GREEN}=== Deployment complete ===${NC}"
echo -e "Visit: https://reports.instap.net"
