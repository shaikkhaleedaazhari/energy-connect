# Community Energy Connect – Frontend Service

This directory contains the static frontend assets and configuration for Community Energy Connect. The frontend is responsible for rendering HTML pages, CSS styles, and JavaScript logic, and is containerized using Docker with NGINX as the web server.

---

## 📂 Directory Structure

```
frontend/
├── css/                       # Stylesheets directory
│   └── styles.css             # Main CSS file
├── js/                        # JavaScript logic directory
│   └── products.js            # Product listing and interaction scripts
├── Dockerfile                 # Builds an NGINX container serving static assets
├── add-product.html           # Page to add a new product
├── add-service.html           # Page to add a new service
├── article-detail.html        # Article detail page
├── contact-provider.html      # Contact provider page
├── edit-product.html          # Page to edit an existing product
├── edit-service.html          # Page to edit an existing service
├── education.html             # Educational resources landing page
├── index.html                 # Homepage
├── login.html                 # User login page
├── more-services.html         # Additional services listing
├── product-detail.html        # Product detail page
├── products.html              # Public product catalog
├── products-management.html   # Admin product management dashboard
├── provider-signup.html       # Provider signup page
├── provider-directory.html    # List of service providers
├── provider-dashboard.html    # Provider dashboard for service providers
├── service-detail.html        # Service detail page
├── services.html              # Public service catalog
├── services-management.html   # Admin service management dashboard
├── signup.html                # User signup page
└── user-profile.html          # User profile page
```

---

## 🚀 Features

* Responsive static pages built with **HTML5** and **CSS3**
* Interactive client-side functionality using **JavaScript (ES6)**
* Modular file structure for maintainability and scalability
* Containerized deployment with Docker and **NGINX**
* Ready to integrate with backend APIs for data-driven features

---

## 🔧 Prerequisites

* **Docker** installed on your development machine or server
* Familiarity with HTML, CSS, and JavaScript
* Access to the backend API endpoints (configured separately)

---

## 🐳 Build & Run with Docker

1. **Build the Docker image**

   ```bash
   cd frontend
   docker build -t community-frontend:latest .
   ```

2. **Run the container**

   ```bash
   docker run -d \
     --name community-frontend \
     -p 80:80 \
     community-frontend:latest
   ```

3. **Verify**
   Open your browser and navigate to `http://localhost/` to view the frontend pages.

---

## ⚙️ Customization & Configuration

* **HTML Pages**: Add or modify `.html` files in the root of this directory. Ensure links to CSS and JS assets are correct.
* **CSS**: Edit `css/styles.css` for styling changes. You can organize additional stylesheets within the `css/` folder.
* **JavaScript**: Update or extend scripts in the `js/` folder. The entry point script for product-related interactions is `js/products.js`.
* **NGINX Configuration**: If you need to customize NGINX, modify the `nginx.conf` section within the `Dockerfile` or provide a custom config file and update the Dockerfile accordingly.

---

## 🔄 Development Workflow Tips

* Use a live-reload tool (e.g., `live-server` or `browser-sync`) for rapid local development.
* Validate your HTML and CSS with online validators (W3C) before committing.
* Consider adding a build step (e.g., Webpack, Gulp) for production optimizations such as minification and bundling.

---

## 🛠️ CI/CD Integration (Optional)

* **Docker Hub**: Push your `community-frontend:latest` image to Docker Hub or your private registry.
* **Kubernetes**: Use `frontend-deployment.yaml` (in the infrastructure directory) to deploy the image to EKS or any K8s cluster.
* **Monitoring**: Integrate with a CDN or monitoring tool (e.g., CloudFront, Sentry) for better performance and error tracking.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](../LICENSE) for details.
