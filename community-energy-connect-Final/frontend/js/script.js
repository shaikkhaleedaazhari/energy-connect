// Backend container DNS name on Docker network
const API_BASE_URL = "http://k8s-default-appingre-f839a6fdd0-522583786.us-east-1.elb.amazonaws.com/php";

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking on a link
    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // Make logo clickable
  const logo = document.querySelector(".nav-logo");
  if (logo) {
    logo.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // Initialize page-specific functionality
  const currentPage = window.location.pathname.split("/").pop();
  switch (currentPage) {
    case "products.html":
      loadProducts();
      break;
    case "provider-directory.html":
      loadProviders();
      break;
    case "product-detail.html":
      loadProductDetails();
      break;
    case "service-detail.html":
      loadServiceDetails();
      break;
    case "article-detail.html":
      loadArticleDetails();
      break;
  }

  // Add this for the home page featured products
  if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/"
  ) {
    loadFeaturedProducts();
    loadFeaturedServices();
  }
});

// Update the navigateToProduct function to handle both regular products and provider products
function navigateToProduct(id, source = "regular") {
  localStorage.setItem("selectedProduct", id);
  localStorage.setItem("selectedProductType", source);
  window.location.href = "product-detail.html";
}


// Add function for provider products
function navigateToProviderProduct(productId) {
  localStorage.setItem("selectedProduct", productId);
  localStorage.setItem("selectedProductType", "provider"); // provider products from provider_products table
  window.location.href = "product-detail.html";
}

// Update the navigateToService function to handle both predefined and provider services
function navigateToService(serviceId, source = "regular") {
  const serviceMap = {
    "solar-installation": "residential-solar-installation",
    "energy-audits": "home-energy-audit",
    "smart-thermostat": "smart-thermostat-installation",
    "residential-solar-installation": "residential-solar-installation",
    "commercial-solar-installation": "commercial-solar-installation",
    "solar-maintenance": "solar-maintenance",
    "solar-consultation": "solar-consultation",
    "home-energy-audit": "home-energy-audit",
    "insulation-installation": "insulation-installation",
    "window-upgrades": "window-upgrades",
    "hvac-optimization": "hvac-optimization",
    "residential-wind-turbine": "residential-wind-turbine",
    "wind-assessment": "wind-assessment",
    "wind-maintenance": "wind-maintenance",
    "smart-thermostat-installation": "smart-thermostat-installation",
    "energy-monitoring-setup": "energy-monitoring-setup",
    "led-lighting-conversion": "led-lighting-conversion",
  };

  const mappedServiceId = serviceMap[serviceId] || serviceId;
  localStorage.setItem("selectedService", mappedServiceId);
  localStorage.setItem(
    "selectedServiceType",
    source === "provider" ? "provider" : "regular"
  );
  window.location.href = "service-detail.html";
}

// Add function for provider services
function navigateToProviderService(serviceId) {
  localStorage.setItem("selectedService", serviceId);
  localStorage.setItem("selectedServiceType", "provider");
  window.location.href = "service-detail.html";
}

// Provider navigation
function navigateToProvider(providerId) {
  localStorage.setItem("selectedProvider", providerId);
  window.location.href = "provider-detail.html";
}

// Article navigation
function navigateToArticle(articleId) {
  localStorage.setItem("selectedArticle", articleId);
  window.location.href = "article-detail.html";
}

// Form validation
function validateForm(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll("input[required]");
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.style.borderColor = "#ef4444";
      isValid = false;
    } else {
      input.style.borderColor = "#e5e7eb";
    }
  });

  return isValid;
}

// Search functionality
function searchProviders() {
  const searchTerm = document.getElementById("searchInput").value;
  const serviceType =
    document.querySelector('select[onchange*="service"]').value;
  const location =
    document.querySelector('select[onchange*="location"]').value;

  const params = new URLSearchParams({
    search: searchTerm,
    service_type: serviceType,
    location: location,
  });

  fetch(`${API_BASE_URL}/php/get-providers.php?${params}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayProviders(data.providers);
      } else {
        console.error("Error searching providers:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Filter functionality
function filterProviders(filterType, value) {
  const providerCards = document.querySelectorAll(".provider-card");

  providerCards.forEach((card) => {
    card.style.display = "flex";
  });
}

// Newsletter signup
function signupNewsletter() {
  const email = prompt("Enter your email address:");
  if (email && email.includes("@")) {
    alert("Thank you for signing up for our newsletter!");
  } else if (email) {
    alert("Please enter a valid email address.");
  }
}

// Workshop registration
function registerWorkshop(workshopId) {
  if (confirm("Would you like to register for this workshop?")) {
    alert("Registration successful! You will receive a confirmation email shortly.");
  }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Form submission handlers
function handleSignup(event) {
  event.preventDefault();

  if (!validateForm("signupForm")) {
    alert("Please fill in all required fields.");
    return;
  }

  const formData = new FormData(event.target);

  // Send to PHP backend
  fetch(`${API_BASE_URL}/php/signup.php`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Account created successfully!");
        window.location.href = "login.html";
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    });
}

function handleLogin(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  fetch(`${API_BASE_URL}/php/login.php`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const authManager = window.authManager;
        if (typeof authManager !== "undefined") {
          authManager.handleLoginSuccess(data.user);
        } else {
          sessionStorage.setItem("userSession", JSON.stringify(data.user));
          if (data.user.type === "provider") {
            window.location.href = "provider-dashboard.html";
          } else {
            window.location.href = "index.html";
          }
        }
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    });
}

// Load product details
function loadProductDetails() {
  const productId = localStorage.getItem("selectedProduct");
  const productType = localStorage.getItem("selectedProductType") || "regular";

  if (!productId) {
    alert("No product selected");
    window.location.href = "products.html";
    return;
  }

  const endpoint =
    productType === "provider"
      ? `${API_BASE_URL}/php/get-provider-product-detail.php?id=${productId}`
      : `${API_BASE_URL}/php/get-product-detail.php?id=${productId}`;

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayProductDetails(data.product, data.provider);
        if (data.product.category) {
          loadRelatedProducts(data.product.category, productId);
        }
      } else {
        alert("Product not found");
        window.location.href = "products.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error loading product details");
    });
}

// Load service details
function loadServiceDetails() {
  const serviceId = localStorage.getItem("selectedService");
  const serviceType = localStorage.getItem("selectedServiceType") || "regular";

  if (!serviceId) {
    alert("No service selected");
    window.location.href = "services.html";
    return;
  }

  const endpoint =
    serviceType === "provider"
      ? `${API_BASE_URL}/php/get-provider-service-detail.php?id=${serviceId}`
      : `${API_BASE_URL}/php/get-service-detail.php?id=${serviceId}`;

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayServiceDetails(data.service, data.provider);
        if (data.service.category) {
          loadRelatedServices(data.service.category, serviceId);
        }
      } else {
        alert("Service not found");
        window.location.href = "services.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error loading service details");
    });
}

// Load article details
function loadArticleDetails() {
  const articleId = localStorage.getItem("selectedArticle");

  if (!articleId) {
    alert("No article selected");
    window.location.href = "education.html";
    return;
  }

  fetch(`${API_BASE_URL}/php/get-article-detail.php?id=${articleId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayArticleDetails(data.article);
        loadRelatedArticles(data.article.category, articleId);
      } else {
        alert("Article not found");
        window.location.href = "education.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error loading article details");
    });
}

// Provider signup handler
function handleProviderSignup(event) {
  event.preventDefault();

  if (!validateForm("providerSignupForm")) {
    alert("Please fill in all required fields.");
    return;
  
}}

