# Week 03: Security Groups, IAM Role, EC2, and ALB

## Summary

I set up security groups for the ALB and app tier, an EC2 IAM role for SSM and ECR access, and an EC2 instance that requires IMDSv2. I also configured an ECR repository and an ALB that forwards traffic to the private instance. I left port 22 closed and used SSM Session Manager to connect. I tested the security group rules with real app traffic, confirmed SSM access, then destroyed all 32 resources. Alongside these tasks, I continued preparing for the AWS Solutions Architect Associate (SAA) exam.

## What I built

- **ALB security group:** Allows HTTP (port 80) from the internet. HTTPS (port 443) is behind the `enable_https` toggle, which is off until I have a certificate. The ALB can send traffic to the app tier only on the app port.
- **App security group:** Allows traffic on the app port only from the ALB security group (SG-to-SG, not a CIDR). There is no SSH rule. Outbound traffic is limited to HTTPS (port 443) for SSM and ECR.
- **IAM role and instance profile for EC2:** Includes `AmazonSSMManagedInstanceCore` and ECR read-only permissions.
- **EC2 instance:** Created a `t3.micro` instance using the Amazon Linux 2023 AMI from an SSM parameter. Installed Docker with `user_data`. IMDSv2 is required; the instance does not allow IMDSv1.
- **ECR repository:** Created the `orderly_backend` repository for the backend API, with image scanning and encryption enabled. I also added a lifecycle rule to keep the latest 30 images and avoid unnecessary storage costs. The repository uses `force_delete`, so Terraform can remove it during teardown even when it still contains images.
- **ALB (Application Load Balancer):** I created the ALB across two public subnets. Its security group allows incoming HTTP traffic from the internet. I added a listener to receive that traffic and forward it to the target group, where I registered the private EC2 instance.

  Traffic flow: `Internet → ALB listener (:80) → target group (:5000) → attached EC2 instance`
  The app security group allows traffic from the ALB on the application port.

## Key ideas in my own words

- **Why reference a security group instead of an IP?** The ALB’s IP addresses can change as it scales, so a CIDR rule would need to cover whole subnets. That could allow anything in those subnets to reach the app, not just the load balancer. Referencing the ALB security group trusts the load balancer by identity rather than location. It keeps working as ALB nodes are added or replaced, without needing rule updates.
- **Security groups are stateful.** Return traffic is allowed automatically, so I don’t need rules for ephemeral ports. Network ACLs are stateless, so they do need them.
- **Trust policy vs. permission policy.** The trust policy says *who* can assume the role (here, the EC2 service). The permission policy says *what* the role can do once it’s assumed. A role with a trust policy but no permissions is like an ID badge with no doors to open. Permissions without a trust policy can’t be used by anyone. They work together.
- **What the ALB listener, target group, health check, and attachment each do:** The listener is the ALB's entry point: it accepts HTTP on port 80 and applies a forwarding rule. The target group defines where forwarded requests go—in this case, the EC2 instance on the app port, HTTP 5000. Its health check periodically requests `/` and considers an instance healthy when it returns HTTP 200. The target group attachment registers the EC2 instance as a destination. These pieces work together; the listener receives and routes, the target group organizes destinations and health, and the attachment connects the instance to that group.
- **Why use an instance role instead of access keys on the server?** Access keys are long-lived. If they leak, someone could use them from anywhere until I notice and revoke them. An instance role gives the server short-lived credentials from AWS STS (Security Token Service). The server gets them from the Instance Metadata Service (IMDS), and AWS rotates them automatically. Nothing needs to be stored in code or on disk. IMDSv2 is required on the instance; its session-based requests help protect the metadata service from SSRF-style attacks.

## Decisions and trade-offs

- **No SSH or bastion; SSM instead.** The private instance has no public IP, and its only inbound traffic is from the ALB. For SSM to work, the instance needs to reach the SSM service endpoints through either a NAT gateway or VPC endpoints. I chose NAT because the server also needs outbound access for package installs and Docker image pulls.
- **MongoDB container instead of Atlas.** I initially planned to use MongoDB Atlas, but changed the plan to run MongoDB in a container alongside the application. This avoids requiring someone who clones the project to create and configure an Atlas account, and supports the goal of bringing up the stack with a single command. The EC2 walkthrough has the database and application containers share a Docker network. data lives on the instance and is lost on every destroy, and it has no backups or HA, so it isn’t production-grade.
- **Allow Terraform to delete a non-empty ECR repository.** I set `force_delete = true` so I can tear down the Terraform-managed stack without first deleting ECR images by hand. This is convenient for a create-and-destroy lab workflow, but repository images are deleted when the repository is destroyed.
- **HTTPS is off for now.** It requires a domain and an ACM certificate. Until then, traffic to the ALB is unencrypted, which is acceptable only for a lab with no sensitive data. It’s one toggle away.
- **SSM Parameter Store instead of an `aws_ami` filter.** AWS publishes the latest AMI IDs as public SSM parameters, so I don’t need to manage name filters or owner IDs. The trade-off is that a new AMI release can change the parameter value, and Terraform may want to replace the instance on the next plan. One way to prevent that is `lifecycle { ignore_changes = [ami] }`.

## Runbook

The detailed commands for building and pushing the backend image, connecting to EC2 through SSM, and running the MongoDB and backend containers are in the [deployment runbook](../runbook.md).

## Cost control

I applied 32 resources and destroyed all 32 at the end of the session.

## Time spent

| Task | Actual time |
|---|---:|
| 1. Security groups + IAM role | 5 h |
| 2. EC2 via SSM | 1 h 10 m |
| 3. ECR + backend on EC2 | 3 h 40 m |
| 4. ALB + target group | 1 h |
| 5. SAA prep | 1 h |
| 6. Review | 30 m |
| **Total** | **12 h 20 m** |

Next time, I’ll read in shorter loops, build as I go, and ask for help sooner.

## Verified

I tested the security group rules with real app traffic and confirmed they work. I also confirmed that I could connect to the instance through SSM.

## Not verified yet

- HTTPS and encryption in transit
- behavior with multiple targets
- what happens if the NAT’s AZ fails

## SAA prep

I worked on my SAA preparation (IAM & VPC) alongside the weekly tasks and collected practice questions and answers in `docs/saa-notes.md`.

## Challenges

- The hardest parts were understanding how the security group rules fit together and pushing the backend image to ECR, then pulling and setting it up on the EC2 instance.

- `terraform destroy` failed on the non-empty ECR repo because force_delete wasn’t in state yet.