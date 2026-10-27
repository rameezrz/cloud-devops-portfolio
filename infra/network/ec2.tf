data "aws_ssm_parameter" "al2023_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

resource "aws_instance" "app_instance" {
  ami                         = data.aws_ssm_parameter.al2023_ami.value
  instance_type               = "t3.micro"
  subnet_id                   = values(aws_subnet.private)[0].id
  iam_instance_profile        = aws_iam_instance_profile.ec2.name
  vpc_security_group_ids      = [aws_security_group.app.id]
  associate_public_ip_address = false

  metadata_options {
    http_tokens = "required"
  }

  root_block_device {
    encrypted = true
  }

  user_data                   = file("${path.module}/scripts/install_docker.sh")
  user_data_replace_on_change = true

  depends_on = [aws_route.private_nat]

  lifecycle {
    ignore_changes = [ami]
  }

  tags = merge(var.tags, { Name = "${var.env}-app-ec2" })
}
