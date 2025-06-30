# Community Energy Connect – Backend Service

[![PHP Version](https://img.shields.io/badge/PHP-8.x-blue.svg)](https://www.php.net/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](../LICENSE)

This directory contains the **PHP + Apache** backend service for Community Energy Connect. It provides RESTful APIs, data access, and business logic, backed by a MySQL schema hosted on AWS RDS. The service is containerized via Docker for consistent deployment.

---

## 📂 Directory Structure

```
backend/
├── config/
│   └── database.php             # RDS connection settings
├── php/
│   ├── public/                  # Document root (index.php, assets, etc.)
│   ├── src/                     # Controllers, Models, Helpers
│   ├── .env.example             # Example environment variables
│   └── composer.json            # PHP dependencies
├── community_energy_connect.sql # MySQL schema & seed data
└── Dockerfile                   # Builds Apache + PHP container
```

---

## 🚀 Features

* **PHP 8.x** application running on **Apache** with PHP‑FPM
* **MySQL** schema & seed data ready for AWS RDS
* Config-driven database connection via environment or PHP config
* Containerized for easy build & run: single Dockerfile

---

## 🔧 Prerequisites

* **Docker** (Engine & CLI) installed
* **AWS RDS** MySQL instance (or local MySQL for development)
* **Git** to clone and manage the repository
* **Composer** (optional, if you install PHP dependencies locally)

---

## ⚙️ Configuration

1. **Environment Variables**
   Copy the example:

   ```bash
   cp php/.env.example php/.env
   ```

   Edit `php/.env` to set your database credentials:

   ```dotenv
   DB_HOST=your-rds-endpoint.amazonaws.com
   DB_NAME=community_energy
   DB_USER=admin
   DB_PASS=supersecret
   DB_CHARSET=utf8mb4
   ```
2. **(Optional) PHP Config File**
   Alternatively, open `config/database.php` and update the values:

   ```php
   <?php
   return [
       'host'     => getenv('DB_HOST')     ?: 'your-rds-endpoint.amazonaws.com',
       'database' => getenv('DB_NAME')     ?: 'community_energy',
       'username' => getenv('DB_USER')     ?: 'admin',
       'password' => getenv('DB_PASS')     ?: 'supersecret',
       'charset'  => getenv('DB_CHARSET')  ?: 'utf8mb4',
       'options'  => [
           PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
           PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
       ],
   ];
   ```

---

## 🏗️ Database Initialization

Execute the provided SQL script against your MySQL instance:

```bash
mysql \
  -h $DB_HOST \
  -u $DB_USER \
  -p$DB_PASS \
  $DB_NAME \
  < community_energy_connect.sql
```

This will create all tables, indexes, and insert seed data.

---

## 🐳 Build & Run with Docker

1. **Build the Docker image**
   From the `backend/` directory:

   ```bash
   docker build -t community-backend:latest .
   ```

2. **Run the container**

   ```bash
   docker run -d \
     --name community-backend \
     --env-file php/.env \
     -p 8080:80 \
     community-backend:latest
   ```

   * The service will listen on port **80** inside the container, mapped to **8080** on the host.
   * Verify by visiting: `http://localhost:8080/`

---

## ✅ Health Checks & Logs

* **Health endpoint**

  ```bash
  curl http://localhost:8080/health
  ```

  Should return HTTP 200 with a simple JSON or text response.

* **Container logs**

  ```bash
  docker logs -f community-backend
  ```

* **Database connectivity**

  ```bash
  mysql \
    -h $DB_HOST \
    -u $DB_USER \
    -p$DB_PASS \
    -e "SHOW TABLES;" \
    $DB_NAME
  ```

---

## 🔐 Security Best Practices

* **Do not** commit real credentials—use `.env` and Docker secrets.
* Restrict RDS security group to allow only your backend container’s IP range.
* Enable SSL/TLS for database connections and HTTP traffic (frontend proxy or load balancer).
* Rotate database credentials regularly and manage secrets via AWS Secrets Manager or SSM Parameter Store.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.
