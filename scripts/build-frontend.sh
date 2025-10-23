#!/bin/bash
set -e

echo "Building frontend Docker image..."
docker build -t team062-frontend ./frontend
