# Terraform Infrastructure for EKS, RDS, and ECR

This project sets up a complete AWS infrastructure using **Terraform**, including a custom VPC, public/private subnets, EKS cluster, RDS MySQL database, and ECR repositories.

---

## ✨ Key Components

* Custom VPC with public and private subnets across two Availability Zones
* Internet Gateway and NAT Gateway for internet access
* Security Group allowing all traffic (suitable for testing)
* EKS Cluster with managed node group
* RDS MySQL database in private subnets
* ECR Repositories for backend and frontend

---

## 📂 Folder Structure

```
terraform_infra/
├── main.tf        # Main Terraform configuration
├── variables.tf   # Variables (optional if using)
├── outputs.tf     # Outputs
```

---

## ⚡ Pre-requisites

* AWS CLI configured
* Terraform installed (v1.0+)
* AWS IAM user with permissions for EC2, VPC, RDS, EKS, ECR

---

## 🚀 Setup Instructions

### 1. Initialize Terraform

```bash
terraform init
```

### 2. Apply the Infrastructure

```bash
terraform apply
```

> It will create all resources and print outputs like EKS cluster name, RDS endpoint, and ECR repo URLs.

---

## 🌐 Network Architecture

* **VPC CIDR:** 10.0.0.0/16
* **Public Subnets:** 10.0.1.0/24 (us-east-2a), 10.0.2.0/24 (us-east-2b)
* **Private Subnets:** 10.0.3.0/24 (us-east-2a), 10.0.4.0/24 (us-east-2b)
* **Routing:**

  * Public subnets: connected to Internet Gateway
  * Private subnets: connected to NAT Gateway in public subnet

---

## ✨ EKS Cluster Details

* **Cluster Name:** MyRenamedEKSCluster
* **Node Group:** MyRenamedNodeGroup
* **Node Type:** t3.medium
* **AMI:** Amazon Linux 2 (AL2\_x86\_64)
* **Desired Capacity:** 2 nodes
* **Subnet Placement:** Public subnets

---

## 📁 RDS MySQL Database

* **Instance ID:** mymysqlinstance
* **Engine:** MySQL 8.0
* **Instance Class:** db.t3.micro
* **Username:** admin
* **Password:** khaleeda
* **DB Name:** test
* **Subnet Group:** Private subnets only
* **Access:** Publicly accessible for testing (modify for production)

---

## 🤖 IAM Roles and Policies

### For EKS Cluster:

* `AmazonEKSClusterPolicy`

### For Worker Nodes:

* `AmazonEKSWorkerNodePolicy`
* `AmazonEKS_CNI_Policy`
* `AmazonEC2ContainerRegistryReadOnly`

---

## 🏠 ECR (Elastic Container Registry)

* `energy-backend-v2`
* `energy-frontend-v2`

> These repositories will store Docker images used by your Kubernetes deployments.

---

## 🔹 Outputs

After successful `terraform apply`, the following values will be available:

* `eks_cluster_name` - Name of the EKS cluster
* `rds_endpoint` - Endpoint of the RDS instance
* `energy_backend_ecr_uri` - Full URI of the backend ECR repo
* `energy_frontend_ecr_uri` - Full URI of the frontend ECR repo

---

## 🛡️ Security Notes

* All-Open Security Group used (for testing only)
* Replace plain DB credentials with Secrets Manager or Kubernetes Secrets for production

---

## 📅 Clean Up

To destroy all the resources:

```bash
terraform destroy
```

---

## 🔗 References

* [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
* [Amazon EKS](https://docs.aws.amazon.com/eks/)
* [Amazon RDS](https://docs.aws.amazon.com/rds/)
* [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)

