#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="/home/lasse/startune"
WEB_DIR="$PROJECT_ROOT/web"
DEPLOY_DIR="/var/www/startune"

echo "Building StarTune web..."
cd "$WEB_DIR"
npm run build

echo "Deploying files..."
sudo mkdir -p "$DEPLOY_DIR"
sudo rsync -a --delete "$WEB_DIR/dist/" "$DEPLOY_DIR/"

sudo chown -R root:root "$DEPLOY_DIR"
sudo find "$DEPLOY_DIR" -type d -exec chmod 755 {} \;
sudo find "$DEPLOY_DIR" -type f -exec chmod 644 {} \;

echo "Checking Nginx..."
sudo nginx -t
sudo systemctl reload nginx

echo "StarTune deployed to http://localhost:5173"
