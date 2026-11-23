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

echo -e "${YELLOW}=== Backing up current release ===${NC}"
BACKUP_NAME="metals-$(date -u +%Y%m%dT%H%M%SZ).tgz"
ssh "$REMOTE_USER@$REMOTE_HOST" \
  "mkdir -p /home/$REMOTE_USER/reports-backups && tar -C $REMOTE_PATH --exclude='./.backups' --exclude='./scripts/.venv' --exclude='./scripts/__pycache__' -czf /home/$REMOTE_USER/reports-backups/$BACKUP_NAME ."
echo "Release backup: /home/$REMOTE_USER/reports-backups/$BACKUP_NAME"

echo -e "${YELLOW}=== Syncing metals price scripts ===${NC}"
rsync -avz --chmod=u=rwX,go=rX \
  scripts/update-prices.js \
  scripts/backfill-daily.mjs \
  scripts/backfill-tungsten.mjs \
  scripts/backfill-lithium.mjs \
  scripts/backfill-copper.mjs \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/scripts/"
rsync -avz --chmod=u=rwX,go=rX \
  scripts/lib/ \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/scripts/lib/"

# Prepare the three changed benchmarks before publishing their new UI.
# The separate backfills preserve every other metal's collected history.
echo -e "${YELLOW}=== Backfilling copper, tungsten and lithium ===${NC}"
for METAL in copper tungsten lithium; do
  ssh "$REMOTE_USER@$REMOTE_HOST" \
    "DATA_FILE=$REMOTE_PATH/data/metals-prices.json DAILY_FILE=$REMOTE_PATH/data/metals-daily.json node $REMOTE_PATH/scripts/backfill-$METAL.mjs"
done
ssh "$REMOTE_USER@$REMOTE_HOST" \
  "METALS=copper,tungsten,lithium DATA_FILE=$REMOTE_PATH/data/metals-prices.json node $REMOTE_PATH/scripts/update-prices.js"

echo -e "${YELLOW}=== Syncing to server ===${NC}"
# Both metals files belong to the server's collectors. A local build must not
# roll either one back; preserve previous on-server release backups too.
rsync -avz --delete --chmod=u=rwX,go=rX \
  --exclude '.git' \
  --exclude '.DS_Store' \
  --exclude '.backups' \
  --exclude 'node_modules' \
  --exclude 'scripts' \
  --exclude 'research-analysis' \
  --exclude 'data/cosco-shipping-energy.json' \
  --exclude 'data/metals-daily.json' \
  --exclude 'data/metals-prices.json' \
  "$BUILD_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

echo -e "${YELLOW}=== Syncing monitoring scripts ===${NC}"
rsync -avz --chmod=u=rwX,go=rX \
  scripts/cosco_vlcc_orders.py \
  scripts/cosco_price_ratio.py \
  scripts/requirements.txt \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/scripts/"

echo -e "${YELLOW}=== Updating Python deps ===${NC}"
ssh "$REMOTE_USER@$REMOTE_HOST" \
  "cd $REMOTE_PATH/scripts && .venv/bin/pip install -q -r requirements.txt 2>&1 | tail -1"

# The MCP catalog is read at startup, so restart an already configured service
# after publishing new text exports. First installation remains explicit.
if ssh "$REMOTE_USER@$REMOTE_HOST" "test -f /etc/systemd/system/instap-reports-mcp.service"; then
  echo -e "${YELLOW}=== Updating research MCP service ===${NC}"
  rsync -avz --chmod=u=rwX,go=rX \
    mcp/server.mjs mcp/content.mjs mcp/package.json mcp/package-lock.json \
    "$REMOTE_USER@$REMOTE_HOST:/var/www/instap-reports-mcp/"
  ssh "$REMOTE_USER@$REMOTE_HOST" \
    "cd /var/www/instap-reports-mcp && npm ci --omit=dev --ignore-scripts && sudo -n systemctl restart instap-reports-mcp"
fi

echo -e "${GREEN}=== Deployment complete ===${NC}"
echo -e "Visit: https://reports.instap.net"
