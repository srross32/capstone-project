#!/bin/bash
dnf install -y docker aws-cli
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

$(aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin ${account_id}.dkr.ecr.us-east-2.amazonaws.com)
docker pull ${account_id}.dkr.ecr.us-east-2.amazonaws.com/secure-voting-backend:latest
docker run -d -p 3000:3000 ${account_id}.dkr.ecr.us-east-2.amazonaws.com/secure-voting-backend:latest