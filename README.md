# capstone-project
An interactive, secure voting application built with Terraform, Docker, and AWS

# 🗳️ Secure Voting App  
An interactive, secure voting application built with **Terraform, Docker, AWS, and CI/CD pipelines**. This project demonstrates **DevSecOps principles** with security best practices integrated at every stage.

![Project Screenshot](https://via.placeholder.com/800x400) <!-- Replace with actual screenshot link -->

---

## 🚀 **Project Overview**
This application allows users to **vote for their preferred option** in a secure, scalable environment.  
It follows best practices in **Infrastructure as Code (IaC), containerization, automation, and security**.

---

## **🛠️ Tech Stack**
| Layer | Tools & Services |
|-------|-----------------|
| **Frontend** | React, AWS S3, CloudFront |
| **Backend** | Node.js, Express, PostgreSQL (AWS RDS) |
| **Infrastructure** | Terraform (AWS EC2, S3, RDS, IAM) |
| **Security** | Aikido Security Scans, AWS IAM, GitHub Actions |
| **CI/CD** | GitHub Actions, AWS ECR, Docker |

---

## **📂 Project Structure**
```sh
secure-voting-app/
│── backend/          # Node.js backend API
│── frontend/         # React frontend
│── terraform/        # Infrastructure as Code
│── .github/workflows # CI/CD Automation
│── README.md         # Project documentation

🔧 Setup & Deployment
Prerequisites
✅ AWS Account & AWS CLI Installed
✅ Terraform Installed (terraform -v)
✅ Docker Installed (docker -v)
✅ Node.js Installed (node -v)

1️⃣ Clone the Repository
sh
Copy
Edit
git clone https://github.com/YOUR_GITHUB_USERNAME/secure-voting-app.git
cd secure-voting-app
2️⃣ Setup Backend
sh
Copy
Edit
cd backend
npm install
npm start
🔹 API runs on http://localhost:3000

3️⃣ Build & Deploy Frontend
sh
Copy
Edit
cd frontend/secure-voting-frontend
npm install
npm run build
aws s3 sync build/ s3://secure-voting-app-YOURNAME/
🔹 Access frontend via terraform output cloudfront_url

4️⃣ Deploy Full Infrastructure with Terraform
sh
Copy
Edit
cd terraform
terraform init
terraform apply -auto-approve
🔹 This provisions AWS resources (EC2, S3, RDS, CloudFront).

🔍 Security & Testing
Run Aikido Security Scans
sh
Copy
Edit
cd terraform
aikido scan .
cd ../backend
aikido scan docker/
Run Backend Tests
sh
Copy
Edit
cd backend
npm test
Run Frontend Tests
sh
Copy
Edit
cd frontend/secure-voting-frontend
npm test
⚡ CI/CD Automation
🔹 This project is automated using GitHub Actions:
✅ Push to GitHub = Auto Deployment
✅ CI/CD includes:

Security scanning (Terraform & Docker)
Automated testing (Backend & Frontend)
Deployment to AWS EC2 (Backend)
Deployment to S3 + CloudFront (Frontend)
📌 Important Outputs
Run:

sh
Copy
Edit
terraform output
Expected outputs:

Name	Description
backend_server_ip	Public IP of EC2 instance
cloudfront_url	CloudFront URL for frontend

