# AWS EKS Cluster with RDS MySQL using CloudFormation

This project provisions a complete AWS infrastructure using a single CloudFormation template. It includes:

* Custom VPC with public and private subnets
* Internet Gateway and NAT Gateway
* Amazon EKS Cluster with managed Node Group
* Amazon ECR for container image storage
* Amazon RDS MySQL instance (in private subnet)
* IAM roles for EKS control plane and worker nodes
* Security Group with open ingress/egress (customize as needed)

---

## 🧱 Architecture Overview

```
VPC (10.0.0.0/16)
├── Public Subnet 1 (10.0.1.0/24) - us-east-1a
│   ├── NAT Gateway
│   └── EKS Worker Node
├── Public Subnet 2 (10.0.2.0/24) - us-east-1b
│   └── EKS Worker Node
├── Private Subnet 1 (10.0.3.0/24) - us-east-1a
│   └── RDS MySQL
└── Private Subnet 2 (10.0.4.0/24) - us-east-1b
    └── RDS MySQL (Multi-AZ disabled)

Internet Gateway ↔ Public Route Table ↔ Public Subnets  
NAT Gateway ↔ Private Route Table ↔ Private Subnets  
```

---

## 🚀 Stack Deployment Instructions

### 📌 Prerequisites

* AWS CLI configured with appropriate IAM permissions
* AWS account with default VPC limits increased (optional for larger clusters)
* CloudFormation service permissions to create VPC, IAM roles, EKS, RDS, etc.

### 🛠️ Parameters Required During Stack Creation

| Parameter    | Description                                 | Example       |
| ------------ | ------------------------------------------- | ------------- |
| `VpcCIDR`    | CIDR block for the VPC                      | `10.0.0.0/16` |
| `DBUsername` | Admin username for MySQL DB                 | `admin`       |
| `DBPassword` | Admin password for MySQL DB (NoEcho secure) | `khaleeda`    |

### 🏗️ Deploy the Stack via AWS CLI

```bash
aws cloudformation create-stack \
  --stack-name eks-rds-cluster-stack \
  --template-body file://eks-rds-cluster-template.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
      ParameterKey=DBUsername,ParameterValue=admin \
      ParameterKey=DBPassword,ParameterValue=khaleeda
```

---

## 📦 Resources Created

| Resource Type             | Description                           |
| ------------------------- | ------------------------------------- |
| `AWS::EC2::VPC`           | Custom VPC                            |
| `AWS::EC2::Subnet`        | 2 Public and 2 Private Subnets        |
| `AWS::EC2::RouteTable`    | Public and Private Route Tables       |
| `AWS::EC2::NATGateway`    | NAT Gateway in Public Subnet          |
| `AWS::EKS::Cluster`       | EKS Cluster Control Plane             |
| `AWS::EKS::Nodegroup`     | Managed Node Group in public subnets  |
| `AWS::IAM::Role`          | IAM Roles for EKS and Nodegroup       |
| `AWS::RDS::DBInstance`    | MySQL RDS instance in private subnets |
| `AWS::RDS::DBSubnetGroup` | DB subnet group for RDS               |
| `AWS::EC2::SecurityGroup` | Security group for EKS and RDS        |
| `Amazon ECR`              | Elastic Container Registry for Docker |

---

## 🔐 Security Considerations

* The `SecurityGroup` currently allows all inbound/outbound traffic (`0.0.0.0/0`). For production use, restrict CIDR blocks appropriately.
* Database password is masked using `NoEcho: true` but consider using AWS Secrets Manager for enhanced security.

---

## 🧹 Cleanup

To delete all resources created by this stack:

```bash
aws cloudformation delete-stack --stack-name eks-rds-cluster-stack
```

---

## 📎 References

* [Amazon EKS Documentation](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)
* [Amazon RDS MySQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html)
* [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)
* [AWS CloudFormation User Guide](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html)

