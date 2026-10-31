# The repository is owned by infra/ecr. Here we only look it up.
data "aws_ecr_repository" "orderly_backend" {
  name = "orderly_backend"
}