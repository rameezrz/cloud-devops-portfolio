output "repository_name" {
  value = aws_ecr_repository.orderly_backend.name
}

output "repository_url" {
  value = aws_ecr_repository.orderly_backend.repository_url
}

output "repository_arn" {
  value = aws_ecr_repository.orderly_backend.arn
}