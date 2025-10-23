#!/bin/bash

set -e

echo "[E2E SETUP] Preparing environment for Playwright tests..."
cd e2e
# 1. ตรวจว่า Node.js ติดตั้งแล้ว
if ! command -v node &> /dev/null; then
  echo "Node.js not found. Please install Node.js >= 18."
  exit 1
fi

# 2. ติดตั้ง dependencies
echo "Running npm install..."
npm install

# 3. ติดตั้ง Playwright และ Browser
echo "Installing Playwright browsers..."
npx playwright install

echo "E2E setup complete. You can now run: make e2e"
