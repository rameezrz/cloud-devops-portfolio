# Week 02: Terraform, Remote State and a VPC

## Summary
This week I learned the Terraform workflow and used it to build the network from my architecture diagram. I stored the state remotely in S3, built a VPC with two public and two private subnets, found and fixed one bug, and destroyed everything afterwards to avoid cost.

## What I built
- **Hello Terraform lab:** one S3 bucket with a random name suffix, default tags and an output. I ran `plan`, `apply` and `destroy`.
- **Remote state:** a separate bootstrap project that creates the state bucket (versioning on, encryption on, public access blocked, `prevent_destroy` set). The network project uses it as its S3 backend with native locking (`use_lockfile = true`).
- **VPC:** `10.0.0.0/16`, two public and two private subnets across two availability zones, an internet gateway, public and private route tables, and an optional NAT gateway.

## Key ideas in my own words
- **Provider:** the plugin that lets Terraform talk to AWS.
- **Resource:** one thing Terraform manages, like `aws_vpc.main`.
- **Variable:** an input that changes behaviour without editing the code. Example: `enable_nat`.
- **Output:** a value Terraform prints after apply, like the VPC ID and subnet IDs.
- **State:** Terraform's record of what it created. It maps my code to real AWS resources, so Terraform knows what to change or delete. It can contain sensitive values, so it must be protected.
- **Remote state and locking:** state lives in S3 instead of on my laptop. Locking stops two runs from changing it at the same time.

## A bug I found and fixed
After the first apply, the VPC resource map showed my private route table had **no subnet associations**. The private subnets were silently using the VPC's main route table, so the NAT gateway was never used.

- **Cause:** I created the private route table but forgot the `aws_route_table_association` resources for the private subnets.
- **Fix:** added the associations, re-ran `plan` (two additions), applied, and checked the resource map again.
- **Lesson:** a successful apply does not mean the design is right. Check the result in the console.

## Decisions and trade-offs
- **NAT is optional and off by default.** A NAT gateway costs roughly $32 a month, so I turn it on only for testing and destroy it the same day.
- **One NAT, in one AZ.** This saves money but is a single point of failure. A production setup would use one NAT per AZ.
- **State bucket uses SSE-S3 encryption.** A customer-managed KMS key adds a monthly cost that is not needed here.
- **The state bucket name includes my AWS account ID** for uniqueness. Account IDs are not secrets, but I know it is visible in this public repo.

## Cost control
Everything was destroyed after testing: 15 resources, including the NAT gateway and its Elastic IP. I check Cost Explorer the next day.

## Not verified yet
I confirmed the routing in the console, but I have not yet sent real traffic through the NAT from an instance. I will do that when I add EC2 in Week 3.

## Bootstrap commands
Adjust the path to where the bootstrap folder lives in the repo.

```bash
cd infra/bootstrap
terraform init
terraform apply
```

If the local bootstrap state is lost, re-run `init`, then `terraform import` each resource and confirm `terraform plan` shows no changes.

## Next
Security groups, an EC2 instance and an ALB, then deploying my MERN app onto this network.