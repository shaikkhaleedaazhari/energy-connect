# Community Energy Connect

A full-stack, cloud-native web application to empower communities in adopting renewable energy. This repository includes infrastructure as code, backend services, a static frontend, and CI/CD configurations for AWS deployment.

---

## 📂 Repository Structure

```
.
├── .gitattributes                                   # Git attributes
├── .gitignore                                       # Ignored files
├── buildspec.yml                                    # AWS CodeBuild spec for full build & deploy
├── buildspec1.yml                                   # Alternate CodeBuild spec
├── sonardb-buildspec.yml                            # SonarQube scanning spec
├── trivy-buildspec.yml                              # Trivy vulnerability scanning spec
├── community_energy_connect.sql                     # Core MySQL schema & seed data
├── enerygy-connect.docx                             # Project documentation
├── community-energy-connect-Final/                  # Main app directory containing code and configs
│   ├── backend/                                     # PHP + Apache backend service
│   ├── frontend/                                    # Static frontend served via NGINX
│   ├── cloudformation_deploy/                       # Deployment scripts for CloudFormation
│   ├── cloudformation_infra/                        # CloudFormation templates and README
│   ├── terraform_deploy/                            # Deployment scripts for Terraform
│   ├── terraform_infra/                             # Terraform configuration and README
│   └── README.md                                    # App-specific README
└── README.md                                        # Root-level README (this file)
```

---

## 🚀 Project Overview

Community Energy Connect provides:

* A public catalog of eco-friendly **products** and **services**
* **Provider dashboards** for managing offerings
* **User** authentication, profiles, and contact features
* **Scalable**, **secure** AWS-based deployment with CI/CD

---

## 🔧 Prerequisites

* **AWS Account** with privileges to create VPCs, EKS clusters, RDS, IAM roles, and CodeBuild projects
* **Docker** (Engine & CLI) installed
* **AWS CLI**, **eksctl**, **kubectl** for EKS workflows
* **Terraform** v1.3+ if choosing the Terraform path
* **Node.js** (optional) for frontend build tools

---

## 🏗️ Getting Started

### Local Development

1. **Backend**

   ```bash
   cd community-energy-connect-Final/backend
   # follow backend/README.md to build and run via Docker
   ```
2. **Frontend**

   ```bash
   cd community-energy-connect-Final/frontend
   # follow frontend/README.md to build and run via Docker
   ```
3. **Database**

   ```bash
   mysql -h <host> -u <user> -p < community_energy_connect.sql
   ```

---

## 🌐 Deployment Options

### CloudFormation & EKS

```bash
cd community-energy-connect-Final/cloudformation_deploy
# run provided scripts to deploy infra and apps via CloudFormation
```

### Terraform

```bash
cd community-energy-connect-Final/terraform_deploy
# run provided scripts to deploy infra and apps via Terraform
```

### CI/CD with AWS CodeBuild

* Full pipeline defined in `buildspec.yml`
* SonarQube scan with `sonardb-buildspec.yml`
* Container vulnerability scan with `trivy-buildspec.yml`

---

## 📄 Documentation

* **Design docs** and **ER diagrams** in `enerygy-connect.docx`
* **SQL schema** and **seed data** in `community_energy_connect.sql`

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
