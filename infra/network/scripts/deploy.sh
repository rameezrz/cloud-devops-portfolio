#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -euo pipefail

# ==========================================
# CONFIGURATION VARIABLE SETUP
# ==========================================
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"
REPO_NAME="orderly_backend"
IMAGE_TAG=$(git rev-parse --short HEAD)

ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"
FULL_IMAGE_URI="${ECR_REGISTRY}/${REPO_NAME}:${IMAGE_TAG}"

# ==========================================
# EXECUTION STEPS
# ==========================================
echo "🚀 Step 1: Building local Docker image..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${SCRIPT_DIR}/../../../app/orderly/server"
cd "$TARGET_DIR"
docker build --platform linux/amd64 --provenance=false -t "${REPO_NAME}:${IMAGE_TAG}" .

echo "🔑 Step 2: Authenticating local Docker client with Amazon ECR..."
aws ecr get-login-password --region "${REGION}" | docker login --username AWS --password-stdin "${ECR_REGISTRY}"

echo "🏷️ Step 3: Tagging the image for ECR..."
docker tag "${REPO_NAME}:${IMAGE_TAG}" "${FULL_IMAGE_URI}"

echo "📤 Step 4: Pushing the image to Amazon ECR..."
docker push "${FULL_IMAGE_URI}"

echo "✅ Success! Deployment pipeline complete. Image : ${FULL_IMAGE_URI}"