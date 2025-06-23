provider "aws" {
  region = var.aws_region
}

# ---------------------------------------
# VPC Module
# ---------------------------------------
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.1"

  name = "three-tier-vpc"
  cidr = var.vpc_cidr

  azs             = var.availability_zones
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.3.0/24", "10.0.4.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Name = "three-tier-vpc"
  }
}

# ---------------------------------------
# EKS Security Group
# ---------------------------------------
resource "aws_security_group" "eks_sg" {
  name        = "eks-sg"
  description = "Allow intra EKS traffic"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ---------------------------------------
# EKS Module with Add-ons and Launch Template for public IP
# ---------------------------------------
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.8.4"

  cluster_name    = var.eks_cluster_name
  cluster_version = "1.32"

  cluster_endpoint_public_access = true

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.public_subnets  # ✅ Public subnets for nodes

  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
  }

  eks_managed_node_groups = {
    public_nodes = {
      desired_size = 2
      max_size     = 3
      min_size     = 1

      instance_types = ["t3.medium"]
      disk_size      = 20

      # ✅ Use launch template to auto-assign public IP
      create_launch_template       = true
      launch_template_name         = "${var.eks_cluster_name}-lt"
      associate_public_ip_address  = true
      subnet_ids                   = module.vpc.public_subnets

      additional_security_group_ids = [aws_security_group.eks_sg.id]
    }
  }

  tags = {
    Environment = "dev"
  }
}

# ---------------------------------------
# RDS MySQL
# ---------------------------------------
resource "aws_security_group" "rds_sg" {
  name        = "rds-sg"
  description = "Allow MySQL traffic"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "rds-subnet-group"
  subnet_ids = module.vpc.private_subnets
  tags = {
    Name = "rds-subnet-group"
  }
}

resource "aws_db_instance" "rds_instance" {
  identifier              = var.db_instance_identifier
  engine                  = "mysql"      # ✅ MySQL
  engine_version          = "8.0"
  instance_class          = "db.t3.micro"
  allocated_storage       = 20
  storage_type            = "gp2"
  username                = var.db_username
  password                = var.db_password
  db_subnet_group_name    = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids  = [aws_security_group.rds_sg.id]
  publicly_accessible     = false
  multi_az                = false
  deletion_protection     = false
  skip_final_snapshot     = true
}

# ---------------------------------------
# ECR Repositories
# ---------------------------------------
resource "aws_ecr_repository" "product_backend" {
  name = "product-backend"
}

resource "aws_ecr_repository" "product_frontend" {
  name = "product-frontend"
}

resource "aws_ecr_lifecycle_policy" "product_backend_policy" {
  repository = aws_ecr_repository.product_backend.name
  policy     = file("ecr-lifecycle-policy.json")
}

resource "aws_ecr_lifecycle_policy" "product_frontend_policy" {
  repository = aws_ecr_repository.product_frontend.name
  policy     = file("ecr-lifecycle-policy.json")
}
