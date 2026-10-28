# Week 03: Security Groups, IAM Role, EC2, and ALB

## Summary

I set up security groups for the ALB and app tier, an EC2 IAM role for SSM and ECR access, and an EC2 instance with IMDSv2 enabled. I also configured an ECR repository and an ALB that forwards traffic to the private instance. I left port 22 closed and used SSM Session Manager to connect. I tested the security group rules with real app traffic, confirmed SSM access, then destroyed all 32 resources.

## What I built

- **ALB security group:** Allows HTTP (port 80) from the internet. HTTPS (port 443) is behind the `enable_https` toggle, which is off until I have a certificate. The ALB can send traffic to the app tier only on the app port.
- **App security group:** Allows traffic on the app port only from the ALB security group (SG-to-SG, not a CIDR). There is no SSH rule. Outbound traffic is limited to HTTPS (port 443) for SSM and ECR.
- **IAM role and instance profile for EC2:** Includes `AmazonSSMManagedInstanceCore` and ECR read-only permissions.
- **EC2 instance:** Created a `t3.micro` instance using the Amazon Linux 2023 AMI from an SSM parameter. Installed Docker with `user_data`. IMDSv2 is enabled.
- **ECR image:** Created the `orderly_backend` repository for the backend API, with image scanning and encryption enabled. I also added a lifecycle rule to keep the latest 30 images and avoid unnecessary storage costs.
- **ALB (Application Load Balancer):** I created the ALB across two public subnets. Its security group allows incoming HTTP traffic from the internet. I added a listener to receive that traffic and forward it to the target group, where I registered the private EC2 instance.

  Traffic flow: `Internet → ALB → listener → target group → EC2`  
  The app security group allows traffic from the ALB on the application port.

## Key ideas in my own words

- **Why reference a security group instead of an IP?** The ALB’s IP addresses can change as it scales, so a CIDR rule would need to cover whole subnets. That could allow anything in those subnets to reach the app, not just the load balancer. Referencing the ALB security group trusts the load balancer by identity rather than location. It keeps working as ALB nodes are added or replaced, without needing rule updates.
- **Security groups are stateful.** Return traffic is allowed automatically, so I don’t need rules for ephemeral ports. Network ACLs are stateless, so they do need them.
- **Trust policy vs. permission policy.** The trust policy says *who* can assume the role (here, the EC2 service). The permission policy says *what* the role can do once it’s assumed. A role with a trust policy but no permissions is like an ID badge with no doors to open. Permissions without a trust policy can’t be used by anyone. They work together.
- **Why use an instance role instead of access keys on the server?** Access keys are long-lived. If they leak, someone could use them from anywhere until I notice and revoke them. An instance role gives the server short-lived credentials from AWS STS (Security Token Service). The server gets them from the Instance Metadata Service (IMDS), and AWS rotates them automatically. Nothing needs to be stored in code or on disk. I plan to require IMDSv2 on the instance, which helps protect the metadata service from SSRF-style attacks.

## Decisions and trade-offs

- **No SSH or bastion; SSM instead.** The private instance has no public IP, and its only inbound traffic is from the ALB. For SSM to work, the instance needs to reach the SSM service endpoints through either a NAT gateway or VPC endpoints. I chose NAT because the server also needs outbound access for package installs, Docker image pulls, and MongoDB Atlas.
- **HTTPS is off for now.** It requires a domain and an ACM certificate. Until then, traffic to the ALB is unencrypted, which is acceptable only for a lab with no sensitive data. It’s one toggle away.
- **SSM Parameter Store instead of an `aws_ami` filter.** AWS publishes the latest AMI IDs as public SSM parameters, so I don’t need to manage name filters or owner IDs. The trade-off is that a new AMI release can change the parameter value, and Terraform may want to replace the instance on the next plan. One way to prevent that is `lifecycle { ignore_changes = [ami] }`.

## Prerequisites for AWS SSM

The Session Manager plugin is required to start a session with `aws ssm start-session --target <instance_id>`. See the [installation documentation](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html).

## Steps for Task 3: ECR image and backend on EC2

### Subtask 1: Create an ECR repository

Create the ECR repository with Terraform and enable image scanning. The Terraform code is included in the repo.

### Subtask 2: Build the backend image locally, tag it, authenticate, and push it to ECR

The script is available at `infra/network/scripts/deploy.sh`.

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
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${SCRIPT_DIR}/../../../app/orderly/server"
cd "$TARGET_DIR"
docker build -t "${REPO_NAME}:${IMAGE_TAG}" .
```

**Step 2: Authenticate Docker with Amazon ECR**

```bash
aws ecr get-login-password --region "${REGION}" |
  docker login --username AWS --password-stdin "${ECR_REGISTRY}"
```

**Step 3: Tag the image for ECR**

```bash
docker tag "${REPO_NAME}:${IMAGE_TAG}" "${FULL_IMAGE_URI}"
```

**Step 4: Push the image to ECR**

```bash
docker push "${FULL_IMAGE_URI}"
```

### Subtask 3: Pull the image and run the container on EC2

On the EC2 instance, connect through SSM and pull the image.

**Step 0: Authenticate Docker on the EC2 instance with Amazon ECR**

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

**Step 2: Run the MongoDB container on the network**

Set `MONGO_ROOT_PASSWORD` in the shell environment before running this command. Avoid putting real credentials directly in the command or in the notes.

```bash
docker run -d \
  --name orderly-db \
  --network orderly \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD="${MONGO_ROOT_PASSWORD}" \
  -v mongo-data:/data/db \
  --restart unless-stopped \
  mongo:8.0

# Optional: log in to the database
docker exec -it orderly-db mongosh \
  -u admin \
  -p "${MONGO_ROOT_PASSWORD}" \
  --authenticationDatabase admin
```

**Step 3: Run the app container**

Set the Cloudinary variables in the shell environment before running this command.

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

## Cost control

I applied 32 resources and destroyed all 32 at the end of the session.

## Time spent

About 5 hours: roughly 3.5 hours reading documentation and 1.5 hours building and writing notes. I estimated 1.5 hours. Next time, I’ll read in shorter loops, build as I go, and ask for help sooner.

## Not verified yet

I have tested the security group rules with real app traffic; and it's working. I did confirm that I could connect to the instance through SSM.

## Verified

I tested the security group rules with real app traffic and confirmed they work. I also confirmed that I could connect to the instance through SSM.