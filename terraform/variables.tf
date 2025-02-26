variable "aws_region" {
  description = "AWS region to deploy resources"
  default     = "us-east-2"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t2.micro"
}

variable "db_username" {
  description = "Database username"
  default     = "admin"
}

variable "db_password" {
  description = "Database password"
  default     = "SecurePassword123!"
  sensitive   = true
}

variable "voting_s3_bucket" {
  description = "S3 bucket for frontend hosting"
  default     = "srross32-capstone-frontend"
}
