#!/bin/bash
set -e

echo "Applying Kubernetes namespace..."
kubectl apply -f deploy/namespace.yaml

echo "Deploying frontend to namespace team062..."
kubectl apply -f deploy/frontend/ -n team062

echo "Deploying database to namespace team062..."
docker pull postgres:16
kubectl apply -f deploy/database/ -n team062

echo "Deploying backend to namespace team062..."
kubectl apply -f deploy/backend/ -n team062

