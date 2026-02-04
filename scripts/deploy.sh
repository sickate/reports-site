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

echo -e "${GREEN}=== Deployment complete ===${NC}"
echo -e "Visit: https://reports.instap.net"
