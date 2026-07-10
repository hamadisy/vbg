#!/usr/bin/env bash
# Restarts the vbg backend on the VPS via pm2. Assumes the backend has
# already been deployed/built at BACKEND_DIR; this script does not pull
# code, install deps, or rebuild.
set -euo pipefail

BACKEND_DIR="/var/www/hsy-stems.com/vbg/backend"
PM2_APP_NAME="vbg-backend"

cd "$BACKEND_DIR"

if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
  pm2 restart "$PM2_APP_NAME" --update-env
else
  pm2 start dist/main.js --name "$PM2_APP_NAME"
fi

pm2 save
pm2 status "$PM2_APP_NAME"

echo "Backend (re)started successfully. To view logs, run: \npm2 logs $PM2_APP_NAME --lines 30 --nostream"
