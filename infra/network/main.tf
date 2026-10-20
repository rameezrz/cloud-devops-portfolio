resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(var.tags, { Name = "${var.env}-vpc" })
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags   = merge(var.tags, { Name = "${var.env}-igw" })
}

resource "aws_subnet" "public" {
  for_each                = { for idx, az in local.azs : az => local.public_subnets[idx] }
  vpc_id                  = aws_vpc.main.id
  cidr_block              = each.value
  availability_zone       = each.key
  map_public_ip_on_launch = true
  tags                    = merge(var.tags, { Name = "${var.env}-public-${each.key}" })
}

resource "aws_subnet" "private" {
  for_each          = { for idx, az in local.azs : az => local.private_subnets[idx] }
  vpc_id            = aws_vpc.main.id
  cidr_block        = each.value
  availability_zone = each.key
  tags              = merge(var.tags, { Name = "${var.env}-private-${each.key}" })
}

resource "aws_eip" "nat" {
  count  = var.enable_nat ? 1 : 0
  domain = "vpc"
  tags   = merge(var.tags, { Name = "${var.env}-nat-eip" })
}

resource "aws_nat_gateway" "nat" {
  count         = var.enable_nat ? 1 : 0
  allocation_id = aws_eip.nat[0].id
  subnet_id     = values(aws_subnet.public)[0].id
  tags          = merge(var.tags, { Name = "${var.env}-nat" })
  depends_on    = [aws_internet_gateway.igw]
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = merge(var.tags, { Name = "${var.env}-public-rt" })
}

resource "aws_route_table_association" "public_rt_assoc" {
  for_each       = aws_subnet.public
  subnet_id      = each.value.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main.id
  tags   = merge(var.tags, { Name = "${var.env}-private-rt" })
}

resource "aws_route_table_association" "private" {
  for_each       = aws_subnet.private
  subnet_id      = each.value.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route" "private_nat" {
  count                  = var.enable_nat ? 1 : 0
  route_table_id         = aws_route_table.private_rt.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat[0].id
}
