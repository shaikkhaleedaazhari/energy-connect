# Community Energy Connect

[![PHP Version](https://img.shields.io/badge/PHP-8.x-blue.svg)](https://www.php.net/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A web‑based platform that empowers communities to adopt renewable energy. This repo contains:

- **PHP backend** served by Apache  
- **Static frontend** served by NGINX  
- **MySQL** database hosted on AWS RDS  
- Dockerfile definitions for both frontend and backend

---

## 🚀 Features

- **PHP 8.x + Apache** for dynamic backend logic  
- **NGINX** for ultra‑fast static asset delivery  
- **MySQL on AWS RDS** for reliable, scalable data storage  
- Docker‑based deployment—just build & run  
- Secure VPC design with public/private subnets and NAT gateway  

---

## 📦 Tech Stack

| Component        | Technology              |
| ---------------- | ----------------------- |
| Backend runtime  | PHP 8.x + Apache        |
| Frontend server  | NGINX                   |
| Database         | MySQL on AWS RDS        |
| Infrastructure   | AWS VPC, EC2, RDS       |
| Containerization | Docker                  |

---

## 🏗️ Architecture

```mermaid
flowchart TD
    Internet -->|80/443| NGX[NGINX Frontend Container]
    NGX -->|HTTP| PHP[Apache + PHP Backend Container]
    PHP --> RDS[(MySQL RDS)]  
