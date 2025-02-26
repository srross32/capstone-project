provider "aws" {
  region  = var.aws_region
  profile = "default" # Uses your local AWS credentials
}