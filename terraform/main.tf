data "aws_caller_identity" "current" {}
locals {
  account_id = data.aws_caller_identity.current.account_id
}

data "aws_ami" "ami_id" {
  owners      = ["amazon"]
  most_recent = true

  filter {
    name   = "name"
    values = ["al2023-ami-2023*-x86_64"]
  }
}

resource "aws_iam_instance_profile" "ecr_profile" {
  name = "ecr_profile"
  role = "EC2ECR"
}

resource "aws_instance" "backend_server" {
  ami           = data.aws_ami.ami_id.id
  instance_type = var.instance_type
  key_name      = "capstone" # Change to your actual key pair name
  security_groups = [aws_security_group.backend_sg.name]
  iam_instance_profile = aws_iam_instance_profile.ecr_profile.name

  tags = {
    Name = "SecureVotingApp-Backend"
  }

  user_data_base64 = base64encode("${templatefile("ec2init.sh", {
    account_id = local.account_id
  })}")

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
    http_put_response_hop_limit = 1
  }
}

resource "aws_eip" "backend_eip" {
  instance = aws_instance.backend_server.id
}

resource "aws_s3_bucket" "frontend_bucket" {
  bucket = var.voting_s3_bucket
}

resource "aws_s3_bucket_website_configuration" "frontend_bucket_website" {
  bucket = aws_s3_bucket.frontend_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_acl" "bucket-acl" {
  bucket = aws_s3_bucket.frontend_bucket.id
  acl    = "public-read"
  depends_on = [aws_s3_bucket_ownership_controls.s3_bucket_acl_ownership]
}

resource "aws_s3_bucket_ownership_controls" "s3_bucket_acl_ownership" {
  bucket = aws_s3_bucket.frontend_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
  depends_on = [aws_s3_bucket_public_access_block.public-access-block]
}

resource "aws_s3_bucket_public_access_block" "public-access-block" {
  bucket = aws_s3_bucket.frontend_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "bucket-policy" {
  bucket = aws_s3_bucket.frontend_bucket.id
  policy = data.aws_iam_policy_document.iam-policy-1.json
}
data "aws_iam_policy_document" "iam-policy-1" {
  statement {
    sid    = "AllowPublicRead"
    effect = "Allow"
resources = [
      "arn:aws:s3:::${aws_s3_bucket.frontend_bucket.id}",
      "arn:aws:s3:::${aws_s3_bucket.frontend_bucket.id}/*",
    ]
actions = ["S3:GetObject"]
principals {
      type        = "*"
      identifiers = ["*"]
    }
  }

  depends_on = [aws_s3_bucket_public_access_block.public-access-block]
}

resource "aws_db_instance" "rds" {
  allocated_storage    = 20
  engine               = "postgres"
  instance_class       = "db.t3.micro"
  username             = var.db_username
  password             = var.db_password
  skip_final_snapshot  = true
  deletion_protection  = true
  vpc_security_group_ids = [aws_security_group.backend_sg.id]
  db_name = "voting"

  tags = {
    Name = "SecureVotingApp-DB"
  }
}
