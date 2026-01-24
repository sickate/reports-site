#!/bin/bash
set -e

# Server Setup Script
# Run this LOCALLY - it will configure the remote server via SSH

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
REMOTE_USER="root"
REMOTE_HOST="maru"
REMOTE="$REMOTE_USER@$REMOTE_HOST"
DOMAIN="reports.instap.net"
WEB_ROOT="/var/www/reports"
NGINX_CONF_NAME="$DOMAIN.conf"
SSL_EMAIL="tzhu@instap.net"

echo -e "${YELLOW}=== Setting up $DOMAIN on $REMOTE_HOST ===${NC}"
echo "Web root: $WEB_ROOT"
echo ""

# Check SSH connection
echo "Checking SSH connection..."
if ! ssh -q $REMOTE exit; then
    echo -e "${RED}Error: Cannot connect to $REMOTE${NC}"
    echo "Please ensure SSH is configured correctly for host '$REMOTE_HOST'"
    exit 1
fi
echo -e "${GREEN}SSH connection OK${NC}"
echo ""

# Step 1: Create web root directory
echo -e "${YELLOW}[1/5] Creating web root directory...${NC}"
ssh $REMOTE "mkdir -p $WEB_ROOT && chown -R root:root $WEB_ROOT"
echo -e "${GREEN}Done${NC}"

# Step 2: Upload nginx configuration
echo -e "${YELLOW}[2/5] Uploading nginx configuration...${NC}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NGINX_LOCAL="$SCRIPT_DIR/../nginx/$NGINX_CONF_NAME"

if [ ! -f "$NGINX_LOCAL" ]; then
    echo -e "${RED}Error: nginx config not found at $NGINX_LOCAL${NC}"
    exit 1
fi

rsync -avz "$NGINX_LOCAL" "$REMOTE:/etc/nginx/sites-available/"
echo -e "${GREEN}Done${NC}"

# Step 3: Enable site, test and reload nginx
echo -e "${YELLOW}[3/5] Enabling site and reloading nginx...${NC}"
ssh $REMOTE "ln -sf /etc/nginx/sites-available/$NGINX_CONF_NAME /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx"
echo -e "${GREEN}Done${NC}"

# Step 4: Request SSL certificate (certbot will modify nginx config)
echo -e "${YELLOW}[4/5] Requesting SSL certificate...${NC}"
ssh $REMOTE "if [ -d '/etc/letsencrypt/live/$DOMAIN' ]; then echo 'Certificate already exists'; else certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $SSL_EMAIL; fi"
echo -e "${GREEN}Done${NC}"

# Step 5: Verify nginx is running
echo -e "${YELLOW}[5/5] Verifying nginx status...${NC}"
ssh $REMOTE "systemctl status nginx --no-pager -l | head -5"
echo -e "${GREEN}Done${NC}"

echo ""
echo -e "${GREEN}=== Setup complete! ===${NC}"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run deploy' to deploy the website"
echo "  2. Visit https://$DOMAIN"
echo ""
echo "SSL certificate will auto-renew via certbot timer."
echo "Check timer status: ssh $REMOTE 'systemctl status certbot.timer'"
