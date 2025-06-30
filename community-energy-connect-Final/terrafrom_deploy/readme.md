# Kubernetes Application Deployment using Terraform Infrastructure

This project involves deploying frontend and backend containerized applications to an Amazon EKS cluster, provisioned using Terraform. The applications are routed using an AWS ALB Ingress Controller.

---

## 📁 Project Structure

```
terraform_deploy/                  # Kubernetes manifests for Terraform provisioned infra
├── backend-deployment1.yaml      # Backend deployment and service
├── frontend-deployment1.yaml     # Frontend deployment and service
└── ingress.yaml                  # ALB ingress configuration
```

---

## 🚀 Deployment Overview

### ✅ Prerequisites

* EKS cluster created using Terraform
* ALB Ingress Controller deployed
* AWS CLI and kubectl configured
* Container images available in Amazon ECR

### 🔧 Backend Deployment (backend-deployment1.yaml)

* ECR Image: `038462784735.dkr.ecr.us-east-2.amazonaws.com/energy-backend-v2:latest`
* Environment Variables:

  ```yaml
  env:
    - name: DB_HOST
      value: mymysqlinstance.ctcqusy24box.us-east-2.rds.amazonaws.com
    - name: DB_NAME
      value: test
    - name: DB_USER
      value: admin
    - name: DB_PASSWORD
      value: khaleeda
  ```
* Exposes port `80` via a `ClusterIP` service

### 🎨 Frontend Deployment (frontend-deployment1.yaml)

* ECR Image: `038462784735.dkr.ecr.us-east-2.amazonaws.com/energy-frontend-v2:latest`
* Exposes port `80` via a `ClusterIP` service

### 🌐 Ingress (ingress.yaml)

* Uses ALB via `kubernetes.io/ingress.class: alb`
* Ingress rules:

  * `/` → `energy-frontend-service`
  * `/php/` → `energy-backend-service`
* Key annotations:

  ```yaml
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}]'
    alb.ingress.kubernetes.io/group.name: energy-connect-group
  ```

---

## 🧪 Deployment Commands

1. Deploy backend:

   ```bash
   kubectl apply -f backend-deployment1.yaml
   ```

2. Deploy frontend:

   ```bash
   kubectl apply -f frontend-deployment1.yaml
   ```

3. Apply ingress:

   ```bash
   kubectl apply -f ingress.yaml
   ```

4. Check ingress ALB status:

   ```bash
   kubectl get ingress
   ```

---

## ⚠️ Notes

* Hardcoded credentials (`DB_PASSWORD=khaleeda`) are not secure. Consider using Kubernetes Secrets.
* Ensure Terraform-created security groups allow traffic between EKS and RDS.
* Ensure ALB Ingress Controller IAM roles and permissions are configured correctly.


