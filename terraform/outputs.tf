output "backend_server_ip" {
  value = aws_instance.backend_server.public_ip
}

output "frontend_s3_url" {
  value = "http://${aws_s3_bucket.frontend_bucket.bucket}.s3-website-${var.aws_region}.amazonaws.com"
}

output "backend_elastic_ip" {
  value = aws_eip.backend_eip.public_ip
}