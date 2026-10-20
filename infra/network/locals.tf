locals {
  azs             = slice(data.aws_availability_zones.available.names, 0, var.az_count)
  public_subnets  = [for k, az in local.azs : cidrsubnet(var.vpc_cidr, var.subnet_newbits, k + 1)]
  private_subnets = [for k, az in local.azs : cidrsubnet(var.vpc_cidr, var.subnet_newbits, k + 11)]
}