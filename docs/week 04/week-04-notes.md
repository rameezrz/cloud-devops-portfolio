# Week 04: Diagram v3, Housekeeping and a Persistent ECR Stack

> Tasks 1–2 are documented below. Sections for Tasks 3–5 will be added as I finish them.

## Summary
I updated the architecture diagram (v3) and cleaned up the repo and notes so they match what I actually built. I also moved the ECR repository out of the `network` stack into its own `ecr` stack. Now I can destroy the whole network after each session and my container images stay in ECR.

## What I built
- **Diagram v3:** SSM instead of a bastion, ALB, ECR, NAT, route tables and CIDRs. It also shows the trade-off that the private subnet in AZ-b uses the single NAT in AZ-a.
- **Housekeeping:** the README roadmap now lists only what I actually did, the long commands moved to `docs/runbook.md`, and the notes are updated.
- **Persistent ECR stack (`infra/ecr`):** the repository (immutable tags, scan on push, AES-256 encryption) and its lifecycle policy (keep the last 30 images) now have their own Terraform state. `prevent_destroy` is set so a stray `terraform destroy` cannot delete the images.

## Stacks and their lifetimes

| Stack | Contains | Lifetime | Apply order |
|---|---|---|---|
| `infra/bootstrap` | S3 bucket for Terraform state | permanent | 1 |
| `infra/ecr` | ECR repository + lifecycle policy | persistent | 2 |
| `infra/network` | VPC, NAT, security groups, IAM role, EC2, ALB | ephemeral, destroyed after each session | 3 |

Teardown: destroy only `network`. Destroy order is the reverse of apply order, and `bootstrap` and `ecr` stay.

## Key ideas in my own words
- **Layers with different lifetimes.** Until now my whole AWS setup lived in one stack, created and destroyed together. In real projects, resources are split by how long they live and how costly they are. The VPC, NAT, EC2 and ALB are cheap to recreate but cost money while they run, so I destroy them after each lab. An ECR repository costs very little to keep, and recreating it means rebuilding and pushing the image every time. So it belongs in its own stack with its own state.
- **State is just Terraform's record.** `terraform state rm` removes a resource from the record without touching the real resource. `terraform import` adds an existing real resource to a record. Together they let me move a resource between stacks without recreating it.

## How I did the migration
1. Created `infra/ecr` with the same resource definitions and a new state key.
2. Ran `terraform state rm` for the repo and lifecycle policy in `network`.
3. Ran `terraform import` for both in `ecr`.
4. In `network`, replaced the resources with a `data "aws_ecr_repository"` reference, so the instance role still works.
5. Applied a small tag change in `ecr` until `terraform plan` said "No changes".
6. Destroyed `network` and checked that the images were still in ECR.

## Decisions and trade-offs
- **Keep ECR alive when everything else is destroyed.** This saves me from rebuilding, tagging and pushing the image every session. The costs are small: about $0.10 per GB-month of image storage, old images that may carry unpatched vulnerabilities (the lifecycle rule and scan on push help), a second state to manage, and an apply-order dependency between stacks.
- **`prevent_destroy` on the repo.** It protects the images, but it also means I must remove it deliberately if I ever want to delete the repository.
- **Separate from the NAT cost.** Pulling images from a private instance goes through the NAT, which charges about $0.045 per GB of data processed plus an hourly fee. That cost exists whether or not ECR is persistent. A free S3 gateway endpoint could later cut it for the image layers.

## Problems and lessons
- **I ran `state rm` before `import`.** It worked because `state rm` doesn't touch the real resource, so nothing was at risk. The safer order is import, verify with `plan`, and only then `state rm`.
- **The first plan after the import wasn't clean.** It wanted to add a `Terraform = "true"` tag. This was only tag drift between the old and new stack settings. Applying it fixed it.
- **Two untagged images** appeared in ECR next to my tagged one. They are probably BuildKit provenance manifests. My lifecycle rule counts them in the 30-image limit.

## Cost control
This week's network stack: 29 resources applied and 27 destroyed. The difference is the two ECR resources, which now live in the `ecr` stack on purpose. The ECR repo stays and costs very little.

## Time spent

| Task | Estimate | Actual |
|---|---:|---:|
| 1. Diagram v3 + repo/notes housekeeping | 1 h 30 m | 1 h |
| 2. Persistent ECR stack | 1 h 30 m | 2 h |
| **Total** | **3 h** | **3 h** |

Task 2 took longer than planned because I had to learn `state rm` and `import` as I went.

## Verified
- `terraform plan` in `ecr` shows "No changes".
- `terraform plan` in `network` reads the repo with the data source and proposes no ECR changes.
- After destroying `network`, `aws ecr describe-images` still lists my images.

## Not verified yet
- A clean checkout applied in the order bootstrap, ecr, network, from nothing.
- How the lifecycle rule behaves with untagged BuildKit manifests over many builds.
- Whether I should add an S3 gateway endpoint to cut NAT data costs.