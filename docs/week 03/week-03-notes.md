# Week 03: Security Groups, IAM Role, EC2 and ALB

> Task 2 is documented below. Sections for Tasks 3–4 will be added as I finish them.

## Summary
I added security groups for the ALB (application load balancer) and the app tier, and an IAM role for EC2 with permissions for SSM and ECR image pulls. I intentionally left port 22 closed. I will log in to the server with SSM Session Manager instead. created an instance and logged into it via SSM.

## What I built
- **ALB security group:** allows HTTP (port 80) from the internet. HTTPS (port 443) is behind a toggle, `enable_https`, which is off until I have a certificate. The ALB can only send traffic to the app tier on the app port.
- **App security group:** allows the app port only from the ALB security group (SG-to-SG, not a CIDR). There is no SSH rule. Outbound is limited to HTTPS (port 443) for SSM and ECR.
- **IAM role and instance profile for EC2:** with `AmazonSSMManagedInstanceCore` and ECR read-only permissions.
- **EC2 Instance:** Created `t3.mirco` instance with `Amazon Linux 2023` AMI with `SSM parameter`. Installed Docker via `user_data`. Instance Metadata Serivce enabled.

## Key ideas in my own words
- **Why reference a security group instead of an IP?** The ALB’s IP addresses change as it scales, so a CIDR rule would have to cover whole subnets, which allows anything in those subnets to reach the app, not just the load balancer. Referencing the ALB security group trusts the load balancer by identity instead of location: only interfaces carrying that SG can connect, it keeps working as ALB nodes are added or replaced, and no rule maintenance is needed.
- **Security groups are stateful.** Return traffic is allowed automatically, so I don't need rules for ephemeral ports. (Network ACLs are stateless and do need them.)
- **Trust policy vs permission policy.** The trust policy says *who* may assume the role (here, the EC2 service). The permission policy says *what* the role can do once assumed. A role with a trust policy but no permissions is like an ID badge with no doors to open. Permissions without a trust policy can't be used by anyone. They work together.
- **Why an instance role instead of access keys on the server?** Access keys are long-lived. If they leak, someone can use them from anywhere until I notice and revoke them. An instance role gives the server short-lived credentials from AWS STS (Security Token Service). The server reads them from the instance metadata service (IMDS), and AWS rotates them automatically. Nothing is stored in code or on disk. I will require IMDSv2 on the instance, which protects that metadata service from SSRF-style attacks.

## Decisions and trade-offs
- **No SSH or bastion, SSM instead.** The private instance has no public IP, and its only inbound traffic is from the ALB. For SSM to work, the instance must reach the SSM service endpoints, either through a NAT gateway or through VPC endpoints. I will use the NAT, because the server also needs outbound access for package installs, Docker image pulls and MongoDB Atlas.
- **HTTPS is off for now.** It needs a domain and an ACM certificate. Until then, traffic to the ALB is unencrypted, which is acceptable only for a lab with no sensitive data. It is one toggle away.
- SSM Parameter Store instead of `aws_ami` filter engine : AWS publishes the latest AMI IDs as public SSM parameters, so I don’t need name filters or owner IDs. **Trade-off**: because it always points to the latest AMI, a new release changes ami and Terraform will want to replace the instance on the next plan. Mention `lifecycle { ignore_changes = [ami] }` as the way to stop that.

## Prerequisites for AWS SSM
**Session Manager plugin** Required to start the session via `aws ssm start-session --target <instance_id>` [Installation doc](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html)

## Cost control
Applied 25 resources and destroyed all 25 at the end of the session.

## Time spent
About 5 hours: roughly 3.5 hours reading docs and 1.5 hours building and documenting. My estimate was 1.5 hours. Next time I will read in short loops, build in between, and ask for help sooner.

## Not verified yet
The rules have not been tested with real traffic. That happens in Tasks 3 and 4. I also have not yet checked that SSM can reach the instance. That happens in Task 2.