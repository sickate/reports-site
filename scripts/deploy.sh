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

echo -e "${YELLOW}=== Syncing to server ===${NC}"
rsync -avz --delete --chmod=D755,F644 \
  --exclude '.git' \
  --exclude '.DS_Store' \
  --exclude 'node_modules' \
  --exclude 'scripts' \
  "$BUILD_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

echo -e "${YELLOW}=== Syncing monitoring scripts ===${NC}"
rsync -avz --chmod=D755,F644 \
  scripts/cosco_vlcc_orders.py \
  scripts/cosco_price_ratio.py \
  scripts/requirements.txt \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/scripts/"

echo -e "${YELLOW}=== Updating Python deps ===${NC}"
ssh "$REMOTE_USER@$REMOTE_HOST" \
  "cd $REMOTE_PATH/scripts && .venv/bin/pip install -q -r requirements.txt 2>&1 | tail -1"

echo -e "${GREEN}=== Deployment complete ===${NC}"
echo -e "Visit: https://reports.instap.net"
