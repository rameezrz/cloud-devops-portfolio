terraform {
  required_version = ">= 1.10"

  backend "s3" {
    bucket       = "myproj-tfstate-022160450209-us-east-1"
    key          = "network/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}