resource "aws_instance" "backend_server" {
  ami           = "ami-0c55b159cbfafe1f0" # Amazon Linux 2 AMI
  instance_type = var.instance_type
  key_name      = "capstone" # Change to your actual key pair name
  security_groups = [aws_security_group.backend_sg.name]

  tags = {
    Name = "SecureVotingApp-Backend"
  }

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install docker -y
              systemctl start docker
              systemctl enable docker
              $(aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 061039770229.dkr.ecr.us-east2.amazonaws.com)
              docker pull 061039770229.dkr.ecr.us-east-2.amazonaws.com/secure-voting-backend:latest
              docker run -d -p 3000:3000 061039770229.dkr.ecr.us-east-2.amazonaws.com/secure-voting-backend:latest
              EOF

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
    http_put_response_hop_limit = 1
  }
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

  tags = {
    Name = "SecureVotingApp-DB"
  }
}
