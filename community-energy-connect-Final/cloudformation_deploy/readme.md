# Kubernetes Application Deployment with EKS and Ingress

This project focuses on deploying a frontend and backend application to an existing Amazon EKS cluster using Kubernetes manifests and routing them using AWS ALB ingress controller.

---

## 📁 Project Structure

```
cloudformation_deploy/             # CloudFormation template for infrastructure (optional if already deployed)
├── backend-deployment.yaml       # Deployment and service for backend
├── frontend-deployment.yaml      # Deployment and service for frontend
└── ingress.yaml                  # Ingress configuration using ALB
```

---

## 🚀 Deployment Overview

### ✅ Prerequisites

* An EKS cluster is already set up and configured
* IAM OIDC provider configured for the cluster
* AWS Load Balancer Controller installed
* `kubectl` and `aws` CLI configured and authenticated
* Backend and frontend container images pushed to Amazon ECR

### 🔧 Backend Deployment

File: `backend-deployment.yaml`

* Deploys `energy-backend` container from ECR:

  * Image: `038462784735.dkr.ecr.us-east-1.amazonaws.com/energy-backend:latest`
* Configured with environment variables to connect to RDS:

  ```yaml
  env:
    - name: DB_HOST
      value: eks-tree-rds.ch2c82wwifaa.us-east-1.rds.amazonaws.com
    - name: DB_NAME
      value: community_energy_connect
    - name: DB_USER
      value: admin
    - name: DB_PASSWORD
      value: khaleeda
  ```
* Exposes port 80 via `ClusterIP` service

### 🎨 Frontend Deployment

File: `frontend-deployment.yaml`

* Deploys `energy-frontend` container from ECR:

  * Image: `038462784735.dkr.ecr.us-east-1.amazonaws.com/energy-frontend:latest`
* Exposes port 80 via `ClusterIP` service

### 🌐 Ingress Configuration

File: `ingress.yaml`

* Uses AWS Load Balancer Controller with ALB ingress
* Two routes:

  * `/` → frontend service
  * `/php/` → backend service
* Sample annotation:

  ```yaml
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}]'
  ```

---

## 📦 Deployment Steps

1. Apply backend deployment and service:

   ```bash
   kubectl apply -f backend-deployment.yaml
   ```

2. Apply frontend deployment and service:

   ```bash
   kubectl apply -f frontend-deployment.yaml
   ```

3. Apply ingress:

   ```bash
   kubectl apply -f ingress.yaml
   ```

4. Wait and verify the ALB is created and publicly accessible:

   ```bash
   kubectl get ingress
   ```

---

## 📎 Notes

* DB credentials are hardcoded in the manifest for demo; prefer using Kubernetes Secrets in production.
* Make sure the security group and RDS settings allow traffic from EKS worker nodes.
* Ingress routes are flexible and can be adjusted per service structure.


