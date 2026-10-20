variable "region" {
  type    = string
  default = "us-east-1"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "az_count" {
  type    = number
  default = 2

  validation {
    condition     = var.az_count >= 1 && var.az_count <= 3
    error_message = "The az_count variable must be an integer between 1 and 3 inclusive."
  }
}

variable "enable_nat" {
  type    = bool
  default = true
}

variable "env" {
  type    = string
  default = "dev"
}


variable "tags" {
  description = "Global tags to apply to all resources"
  type        = map(string)
  default = {
    Terraform = "true"
  }
}

variable "subnet_newbits" {
  description = "Number of new bits to add to VPC CIDR to generate subnets (e.g., 8 means /24 from /16)"
  type        = number
  default     = 8
}
