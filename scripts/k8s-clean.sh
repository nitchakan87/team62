#!/bin/bash
set -e

echo "Cleaning Kubernetes resources in namespace team062..."
kubectl delete all --all -n team062
kubectl delete configmap --all -n team062 || true
kubectl delete secret --all -n team062 || true
kubectl delete pvc --all -n team062 || true
kubectl delete ingress --all -n team062 || true
echo "All resources in team062 cleaned."