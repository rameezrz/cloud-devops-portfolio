output "vpc_id" {
  value       = aws_vpc.main.id
  description = "The ID of the created VPC"
}

output "public_subnet_ids" {
  value       = [for s in aws_subnet.public : s.id]
  description = "List of public subnet IDs"
}

output "private_subnet_ids" {
  value       = [for s in aws_subnet.private : s.id]
  description = "List of private subnet IDs"
}

output "public_subnet_map" {
  value       = { for az, subnet in aws_subnet.public : az => subnet.id }
  description = "Map of AZ to Public Subnet ID"
}

output "alb_sg_id" {
  value = aws_security_group.alb.id
}

output "app_sg_id" {
  value = aws_security_group.app.id
}

output "instance_profile_name" {
  value = aws_iam_instance_profile.ec2.name
}

output "ec2_role_arn" {
  value = aws_iam_role.ec2.arn
}

output "app_instance_id" {
  value = aws_instance.app_instance.id
}

output "backend_repository_url" {
  description = "The URL of the ECR repository for the backend application"
  value       = aws_ecr_repository.orderly_backend.repository_url
}

output "alb_dns_name" {
  value = aws_lb.app.dns_name
}

output "app_private_ip" {
  value = aws_instance.app_instance.private_ip
}