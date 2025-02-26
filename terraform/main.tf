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
              docker run -d -p 3000:3000 voting-app
              EOF
}

resource "aws_s3_bucket" "frontend_bucket" {
  bucket = var.voting_s3_bucket
  acl    = "public-read"

  website {
    index_document = "index.html"
  }

  tags = {
    Name = "SecureVotingApp-Frontend"
  }
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
