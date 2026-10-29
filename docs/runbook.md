# AWS deployment runbook

This runbook documents the Week 3 workflow for publishing the backend image to Amazon ECR, connecting to the private EC2 instance through Systems Manager Session Manager, and starting the backend and MongoDB containers.

The network, EC2 instance, security groups, IAM role, and ECR repository are provisioned with Terraform in `infra/network`. The Terraform user data installs Docker; it does not automatically pull or start the application containers.

## Prerequisites

- AWS CLI configured with credentials authorized to use the Terraform stack and ECR.
- Docker installed on the developer workstation.
- The Session Manager plugin installed to start a session with `aws ssm start-session --target <instance_id>`. See the [AWS installation documentation](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html).
- An EC2 instance ID, the ECR image tag to deploy, and the required application environment values.

## Provision the ECR repository

The ECR repository is managed by Terraform. Apply the network configuration to create it; its repository definition enables scan-on-push and encryption.

## Build and push the backend image

The helper script at `infra/network/scripts/deploy.sh` builds the backend image, tags it with the current Git commit, authenticates to ECR, and pushes it:

```bash
bash infra/network/scripts/deploy.sh
```

Alternatively, run the steps manually from the repository root.

**Step 0: Set the variables**

```bash
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"
REPO_NAME="orderly_backend"
IMAGE_TAG=$(git rev-parse --short HEAD)
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"
FULL_IMAGE_URI="${ECR_REGISTRY}/${REPO_NAME}:${IMAGE_TAG}"
```

**Step 1: Build the local Docker image**

```bash
docker build -t "${REPO_NAME}:${IMAGE_TAG}" ./app/orderly/server
```

**Step 2: Authenticate Docker with Amazon ECR**

```bash
aws ecr get-login-password --region "${REGION}" |
  docker login --username AWS --password-stdin "${ECR_REGISTRY}"
```

**Step 3: Tag and push the image**

```bash
docker tag "${REPO_NAME}:${IMAGE_TAG}" "${FULL_IMAGE_URI}"
docker push "${FULL_IMAGE_URI}"
```

Record the image tag; you will use it when pulling the image on EC2.

## Connect to EC2 through Session Manager

The instance is private and has no SSH ingress. Start a session using its instance ID:

```bash
aws ssm start-session --target <instance_id>
```

## Start MongoDB and the backend containers

Run the following commands in the EC2 Session Manager shell. Replace `<image-tag>` with the tag you pushed above. The instance role provides ECR read-only permissions.

**Step 0: Authenticate Docker on EC2 with Amazon ECR**

```bash
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"
REPO_NAME="orderly_backend"
IMAGE_TAG="<image-tag>"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"
FULL_IMAGE_URI="${ECR_REGISTRY}/${REPO_NAME}:${IMAGE_TAG}"

aws ecr get-login-password --region "${REGION}" |
  docker login --username AWS --password-stdin "${ECR_REGISTRY}"
```

**Step 1: Create a Docker network**

```bash
docker network create orderly
```

**Step 2: Run the MongoDB container**

Set `MONGO_ROOT_PASSWORD` in the shell environment before running these commands. Avoid putting real credentials directly in the command or committing them to the repository.

```bash
docker run -d \
  --name orderly-db \
  --network orderly \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD="${MONGO_ROOT_PASSWORD}" \
  -v mongo-data:/data/db \
  --restart unless-stopped \
  mongo:8.0
```

Optionally, open a MongoDB shell:

```bash
docker exec -it orderly-db mongosh \
  -u admin \
  -p "${MONGO_ROOT_PASSWORD}" \
  --authenticationDatabase admin
```

**Step 3: Run the backend container**

Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in the shell environment before running this command.

```bash
docker run -d -p 5000:5000 \
  --name orderly-backend \
  --network orderly \
  -e PORT=5000 \
  -e NODE_ENV="production" \
  -e BASE_URL="http://localhost:5000" \
  -e DATABASE_URL="mongodb://admin:${MONGO_ROOT_PASSWORD}@orderly-db:27017/appdb?authSource=admin" \
  -e CLOUDINARY_CLOUD_NAME="${CLOUDINARY_CLOUD_NAME}" \
  -e CLOUDINARY_API_KEY="${CLOUDINARY_API_KEY}" \
  -e CLOUDINARY_API_SECRET="${CLOUDINARY_API_SECRET}" \
  "${FULL_IMAGE_URI}"
```
