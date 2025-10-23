#!/bin/bash
set -e

echo "🔨 Building backend Docker image..."
docker build -t team062-backend ./backend
