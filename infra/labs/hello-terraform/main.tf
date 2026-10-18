terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "staging"
}

resource "aws_s3_bucket" "demo_bucket" {
  bucket = "${var.environment}-rzeee-bucket-12345"

  tags = {
    Name        = "My bucket 2.0"
    Environment = var.environment
  }
}