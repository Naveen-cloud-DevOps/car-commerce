#!/bin/bash

set -e

echo "======================================"
echo " Car Commerce Deployment Started"
echo "======================================"

APP_DIR="/var/www/html"
DEPLOY_DIR="/tmp/car-commerce"

echo "Step 1: Installing required packages..."

if ! command -v nginx >/dev/null 2>&1; then
    sudo yum install -y nginx
fi

if ! command -v unzip >/dev/null 2>&1; then
    sudo yum install -y unzip
fi

echo "Step 2: Stopping Nginx..."

sudo systemctl stop nginx || true

echo "Step 3: Cleaning old application..."

sudo rm -rf "${APP_DIR:?}"/*

echo "Step 4: Copying application files..."

sudo cp -r "$DEPLOY_DIR"/index.html "$APP_DIR"/
sudo cp -r "$DEPLOY_DIR"/style.css "$APP_DIR"/
sudo cp -r "$DEPLOY_DIR"/app.js "$APP_DIR"/
sudo cp -r "$DEPLOY_DIR"/images "$APP_DIR"/

echo "Step 5: Setting permissions..."

sudo chown -R nginx:nginx "$APP_DIR"
sudo chmod -R 755 "$APP_DIR"

echo "Step 6: Testing Nginx..."

sudo nginx -t

echo "Step 7: Starting Nginx..."

sudo systemctl enable nginx
sudo systemctl start nginx

echo "Step 8: Checking Nginx..."

sudo systemctl status nginx --no-pager

echo "======================================"
echo " Car Commerce Deployment Successful"
echo "======================================"

echo "Application files:"
ls -la "$APP_DIR"
