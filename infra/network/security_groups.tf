# ---------------------------------------------------------------------------
# ALB security group: the only thing exposed to the internet
# ---------------------------------------------------------------------------

resource "aws_security_group" "alb" {
  name        = "${var.env}-alb-sg"
  description = "ALB : HTTP/HTTPS from the Internet"
  vpc_id      = aws_vpc.main.id

  tags = merge(var.tags, { Name = "${var.env}-alb-sg" })
}

resource "aws_vpc_security_group_ingress_rule" "alb_http" {
  security_group_id = aws_security_group.alb.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
  description       = "HTTP from the internet"

  tags = merge(var.tags, { Name = "${var.env}-alb-in-80" })
}

# 443 is added later (needs an ACM cert + domain). Flip enable_https when ready.
resource "aws_vpc_security_group_ingress_rule" "alb_https" {
  count = var.enable_https ? 1 : 0

  security_group_id = aws_security_group.alb.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
  description       = "HTTPS from the internet"

  tags = merge(var.tags, { Name = "${var.env}-alb-in-443" })
}

# Egress: the ALB may only talk to the app tier, on the app port.
# This also covers health checks (same port).
resource "aws_vpc_security_group_egress_rule" "alb_to_app" {
  security_group_id            = aws_security_group.alb.id
  referenced_security_group_id = aws_security_group.app.id
  ip_protocol                  = "tcp"
  from_port                    = var.app_port
  to_port                      = var.app_port
  description                  = "To app tier on the app port"

  tags = merge(var.tags, { Name = "${var.env}-alb-out-app" })
}


# ---------------------------------------------------------------------------
# App security group: reachable only from the ALB (identity, not location)
# ---------------------------------------------------------------------------
resource "aws_security_group" "app" {
  name        = "${var.env}-app-sg"
  description = "App tier: app port from ALB SG only. No SSH, use SSM."
  vpc_id      = aws_vpc.main.id

  tags = merge(var.tags, { Name = "${var.env}-app-sg" })
}

resource "aws_vpc_security_group_ingress_rule" "app_from_alb" {
  security_group_id            = aws_security_group.app.id
  referenced_security_group_id = aws_security_group.alb.id # SG-to-SG, not a CIDR
  ip_protocol                  = "tcp"
  from_port                    = var.app_port
  to_port                      = var.app_port
  description                  = "App port from the ALB security group"

  tags = merge(var.tags, { Name = "${var.env}-app-in-alb" })
}

# Terraform removes the default allow-all egress rule AWS adds on creation,
# so every outbound path must be declared explicitly.
resource "aws_vpc_security_group_egress_rule" "app_https_out" {
  security_group_id = aws_security_group.app.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
  description       = "HTTPS out for SSM agent and ECR"

  tags = merge(var.tags, { Name = "${var.env}-app-out-443" })
}

# Deliberately NO port 22 rule anywhere. Access is via SSM Session Manager.