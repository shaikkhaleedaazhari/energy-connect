// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })

    // Close menu when clicking on a link
    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      })
    })
  }

  // Make logo clickable
  const logo = document.querySelector(".nav-logo")
  if (logo) {
    logo.addEventListener("click", () => {
      window.location.href = "index.html"
    })
  }

  // Initialize page-specific functionality
  const currentPage = window.location.pathname.split("/").pop()
  switch (currentPage) {
    case "products.html":
      loadProducts()
      break
    case "provider-directory.html":
      loadProviders()
      break
    case "product-detail.html":
      loadProductDetails()
      break
    case "service-detail.html":
      loadServiceDetails()
      break
    case "article-detail.html":
      loadArticleDetails()
      break
  }

  // Add this for the home page featured products
  if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
    loadFeaturedProducts()
    loadFeaturedServices()
  }
})

// Update the navigateToProduct function to handle both regular products and provider products
function navigateToProduct(id, source = "regular") {
  localStorage.setItem("selectedProduct", id);
  localStorage.setItem("selectedProductType", source);
  window.location.href = "product-detail.html";
}


// Add function for provider products
function navigateToProviderProduct(productId) {
  localStorage.setItem("selectedProduct", productId)
  localStorage.setItem("selectedProductType", "provider") // provider products from provider_products table
  window.location.href = "product-detail.html"
}

// Update the navigateToService function to handle both predefined and provider services
function navigateToService(serviceId, source = "regular") {
  // Map of predefined service IDs to ensure they work
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
  }

  const mappedServiceId = serviceMap[serviceId] || serviceId
  localStorage.setItem("selectedService", mappedServiceId)
  localStorage.setItem("selectedServiceType", source === "provider" ? "provider" : "regular")
  window.location.href = "service-detail.html"
}

// Add function for provider services
function navigateToProviderService(serviceId) {
  localStorage.setItem("selectedService", serviceId)
  localStorage.setItem("selectedServiceType", "provider")
  window.location.href = "service-detail.html"
}

// Provider navigation
function navigateToProvider(providerId) {
  localStorage.setItem("selectedProvider", providerId)
  window.location.href = "provider-detail.html"
}

// Article navigation
function navigateToArticle(articleId) {
  localStorage.setItem("selectedArticle", articleId)
  window.location.href = "article-detail.html"
}

// Form validation
function validateForm(formId) {
  const form = document.getElementById(formId)
  const inputs = form.querySelectorAll("input[required]")
  let isValid = true

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.style.borderColor = "#ef4444"
      isValid = false
    } else {
      input.style.borderColor = "#e5e7eb"
    }
  })

  return isValid
}

// Search functionality
function searchProviders() {
  const searchTerm = document.getElementById("searchInput").value
  const serviceType = document.querySelector('select[onchange*="service"]').value
  const location = document.querySelector('select[onchange*="location"]').value

  const params = new URLSearchParams({
    search: searchTerm,
    service_type: serviceType,
    location: location,
  })

  fetch(`php/get-providers.php?${params}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayProviders(data.providers)
      } else {
        console.error("Error searching providers:", data.message)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}

// Filter functionality
function filterProviders(filterType, value) {
  const providerCards = document.querySelectorAll(".provider-card")

  providerCards.forEach((card) => {
    // This would be enhanced with actual data attributes
    card.style.display = "flex"
  })
}

// Newsletter signup
function signupNewsletter() {
  const email = prompt("Enter your email address:")
  if (email && email.includes("@")) {
    alert("Thank you for signing up for our newsletter!")
  } else if (email) {
    alert("Please enter a valid email address.")
  }
}

// Workshop registration
function registerWorkshop(workshopId) {
  if (confirm("Would you like to register for this workshop?")) {
    alert("Registration successful! You will receive a confirmation email shortly.")
  }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Form submission handlers
function handleSignup(event) {
  event.preventDefault()

  if (!validateForm("signupForm")) {
    alert("Please fill in all required fields.")
    return
  }

  const formData = new FormData(event.target)

  // Send to PHP backend
  fetch("php/signup.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Account created successfully!")
        window.location.href = "login.html"
      } else {
        alert("Error: " + data.message)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("An error occurred. Please try again.")
    })
}

function handleLogin(event) {
  event.preventDefault()

  const formData = new FormData(event.target)

  fetch("php/login.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Use auth manager to handle login success
        const authManager = window.authManager
        if (typeof authManager !== "undefined") {
          authManager.handleLoginSuccess(data.user)
        } else {
          // Fallback if authManager is not available
          sessionStorage.setItem("userSession", JSON.stringify(data.user))
          if (data.user.type === "provider") {
            window.location.href = "provider-dashboard.html"
          } else {
            window.location.href = "index.html"
          }
        }
      } else {
        alert("Error: " + data.message)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("An error occurred. Please try again.")
    })
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
      ? `php/get-provider-product-detail.php?id=${productId}`
      : `php/get-product-detail.php?id=${productId}`;

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
  const serviceId = localStorage.getItem("selectedService")
  const serviceType = localStorage.getItem("selectedServiceType") || "regular"

  if (!serviceId) {
    alert("No service selected")
    window.location.href = "services.html"
    return
  }

  const endpoint =
    serviceType === "provider"
      ? `php/get-provider-service-detail.php?id=${serviceId}`
      : `php/get-service-detail.php?id=${serviceId}`

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayServiceDetails(data.service, data.provider)
        if (data.service.category) {
          loadRelatedServices(data.service.category, serviceId)
        }
      } else {
        alert("Service not found")
        window.location.href = "services.html"
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Error loading service details")
    })
}

// Load article details
function loadArticleDetails() {
  const articleId = localStorage.getItem("selectedArticle")

  if (!articleId) {
    alert("No article selected")
    window.location.href = "education.html"
    return
  }

  fetch(`php/get-article-detail.php?id=${articleId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayArticleDetails(data.article)
        loadRelatedArticles(data.article.category, articleId)
      } else {
        alert("Article not found")
        window.location.href = "education.html"
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Error loading article details")
    })
}

// Provider signup handler
function handleProviderSignup(event) {
  event.preventDefault()

  if (!validateForm("providerSignupForm")) {
    alert("Please fill in all required fields.")
    return
  }

  const formData = new FormData(event.target)

  // Send to PHP backend
  fetch("php/provider-signup.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Provider account created successfully!")
        window.location.href = "login.html"
      } else {
        alert("Error: " + data.message)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("An error occurred. Please try again.")
    })
}

// Load products dynamically
function loadProducts(category = "") {
  fetch(`php/get-all-products.php?category=${category}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayProducts(data.products)
      } else {
        console.error("Error loading products:", data.message)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}

// Load services dynamically
function loadServices(category = "") {
  fetch(`php/get-all-services.php?category=${category}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayServices(data.services)
      } else {
        console.error("Error loading services:", data.message)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}

// Display products
function displayProducts(products) {
  const container = document.getElementById("productsContainer")
  if (!container) return

  container.innerHTML = products
    .map(
      (product) => `
    <div class="product-card" onclick="navigateToProduct('${product.id}', '${product.source}')">
      <img src="${product.image_url}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <div class="product-price">$${product.pricing}</div>
      <div class="product-category">${product.category}</div>
    </div>
  `,
    )
    .join("")
}

// Display services
function displayServices(services) {
  const container = document.getElementById("servicesContainer")
  if (!container) return

  container.innerHTML = services
    .map(
      (service) => `
    <div class="service-card" onclick="navigateToService('${service.id}', '${service.source}')">
      <img src="${service.image_url}" alt="${service.title}">
      <h3>${service.title}</h3>
      <p>${service.description}</p>
      <div class="service-price">Starting at $${service.pricing}</div>
      <div class="service-category">${service.category}</div>
    </div>
  `,
    )
    .join("")
}

// Load providers dynamically
function loadProviders() {
  fetch("php/get-providers.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayProviders(data.providers)
      } else {
        console.error("Error loading providers:", data.message)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}

// Display providers
function displayProviders(providers) {
  const container = document.getElementById("providersContainer")
  if (!container) return

  container.innerHTML = providers
    .map(
      (provider) => `
    <div class="provider-card" onclick="navigateToProvider(${provider.id})">
      <img src="${provider.image_url || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150&q=80"}" alt="${provider.company_name}">
      <div class="provider-info">
        <h3>${provider.company_name}</h3>
        <p>${provider.description}</p>
        <div class="provider-rating">Rating: ${provider.rating}/5</div>
        <button class="view-profile-btn">View Profile</button>
      </div>
    </div>
  `,
    )
    .join("")
}

// Display product details
function displayProductDetails(product, provider) {
  const productNameEl = document.getElementById("productName")
  const productPriceEl = document.getElementById("productPrice")
  const productCategoryEl = document.getElementById("productCategory")
  const productDescriptionEl = document.getElementById("productDescription")
  const productSpecsEl = document.querySelector('.specifications-list') || document.getElementById("productSpecs")
  const productImageEl = document.getElementById("productImage")
  const availabilityEl = document.getElementById("productAvailability")

  if (productNameEl) productNameEl.textContent = product.name || product.title
  if (productPriceEl) productPriceEl.textContent = `$${product.price || product.pricing}`
  if (productCategoryEl) productCategoryEl.textContent = product.category
  if (productDescriptionEl) productDescriptionEl.textContent = product.description

  // Defensive: always treat specifications as array
  if (productSpecsEl) {
    let specifications = [];
    try {
      if (Array.isArray(product.specifications)) {
        specifications = product.specifications;
      } else if (typeof product.specifications === 'string' && product.specifications.trim() !== '') {
        specifications = JSON.parse(product.specifications);
      }
    } catch (error) {
      console.warn('Error parsing specifications:', error);
    }
    if (!Array.isArray(specifications)) specifications = [];
    console.log('Product specifications:', specifications);
    if (specifications.length > 0) {
      productSpecsEl.innerHTML = specifications.map(spec => `<li><i class="fas fa-check"></i> ${spec}</li>`).join('');
    } else {
      productSpecsEl.innerHTML = '<li>No specifications available</li>';
    }
  }

  if (productImageEl && product.image_url) {
    productImageEl.src = product.image_url
  }

  if (availabilityEl) {
    availabilityEl.innerHTML = `<span class="availability-status">${product.availability || "Available"}</span>`
  }

  // Display provider info
  if (provider) {
    displayProviderInfo(provider)
  }
}

// Display service details
function displayServiceDetails(service, provider) {
  const serviceNameEl = document.getElementById("serviceName")
  const servicePriceEl = document.getElementById("servicePrice")
  const serviceCategoryEl = document.getElementById("serviceCategory")
  const serviceDescriptionEl = document.getElementById("serviceDescription")
  const serviceFeaturesEl = document.querySelector('.features-list') || document.getElementById("serviceFeatures")
  const serviceImageEl = document.getElementById("serviceImage")
  const availabilityEl = document.getElementById("serviceAvailability")

  if (serviceNameEl) serviceNameEl.textContent = service.name || service.title
  if (servicePriceEl) servicePriceEl.textContent = `Starting at $${service.price || service.pricing}`
  if (serviceCategoryEl) serviceCategoryEl.textContent = service.category
  if (serviceDescriptionEl) serviceDescriptionEl.textContent = service.description

  // Defensive: always treat features as array
  if (serviceFeaturesEl) {
    let features = [];
    if (Array.isArray(service.features)) {
      features = service.features;
    } else if (typeof service.features === 'string' && service.features.trim() !== '') {
      try {
        features = JSON.parse(service.features);
      } catch (e) {
        features = service.features.split('\n');
      }
    }
    if (!Array.isArray(features)) features = [];
    console.log('Service features:', features);
    if (features.length > 0) {
      serviceFeaturesEl.innerHTML = features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('');
    } else {
      serviceFeaturesEl.innerHTML = '<li>No features listed</li>';
    }
  }

  if (serviceImageEl && service.image_url) {
    serviceImageEl.src = service.image_url
  }

  if (availabilityEl) {
    availabilityEl.innerHTML = `<span class="availability-status">${service.availability || "Available"}</span>`
  }

  // Display provider info
  if (provider) {
    displayProviderInfo(provider)
  }
}

// Display article details
function displayArticleDetails(article) {
  const articleTitleEl = document.getElementById("articleTitle")
  const articleCategoryEl = document.getElementById("articleCategory")
  const articleImageEl = document.getElementById("articleImage")
  const articleContentEl = document.getElementById("articleContent")

  if (articleTitleEl) articleTitleEl.textContent = article.title
  if (articleCategoryEl) articleCategoryEl.textContent = article.category
  if (articleImageEl) articleImageEl.src = article.image_url
  if (articleContentEl) articleContentEl.innerHTML = article.content
}

// Display provider information
function displayProviderInfo(provider) {
  const providerInfoElement = document.getElementById("providerInfo")
  if (providerInfoElement) {
    providerInfoElement.innerHTML = `
      <img src="${provider.image_url || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"}" alt="${provider.company_name}">
      <div class="provider-details">
        <h3>${provider.company_name}</h3>
        <p>${provider.description}</p>
        <div class="provider-rating">
          <span class="rating">★★★★☆</span>
          <span class="rating-text">${provider.rating || 4.5}/5</span>
        </div>
        <button class="btn-secondary" onclick="viewProviderProfile(${provider.id})">View Full Profile</button>
      </div>
    `
  }
}

// Load related products
function loadRelatedProducts(category, excludeId) {
  fetch(`php/get-products.php?category=${category}&exclude=${excludeId}&limit=3`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.products.length > 0) {
        displayRelatedProducts(data.products)
      }
    })
    .catch((error) => console.error("Error loading related products:", error))
}

// Load related services
function loadRelatedServices(category, excludeId) {
  fetch(`php/get-services.php?category=${category}&exclude=${excludeId}&limit=3`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.services.length > 0) {
        displayRelatedServices(data.services)
      }
    })
    .catch((error) => console.error("Error loading related services:", error))
}

// Load related articles
function loadRelatedArticles(category, excludeId) {
  // For now, we'll show some sample related articles
  const relatedArticles = [
    {
      id: "energy-efficiency-tips",
      title: "Energy Efficiency Tips",
      description: "Simple ways to make your home more energy efficient",
      image_url:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
    },
    {
      id: "renewable-energy-basics",
      title: "Renewable Energy Basics",
      description: "Understanding different types of renewable energy",
      image_url:
        "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
    },
  ]

  displayRelatedArticles(relatedArticles)
}

// Display related products
function displayRelatedProducts(products) {
  const container = document.getElementById("relatedProducts")
  if (container) {
    container.innerHTML = products
      .map(
        (product) => `
      <div class="product-card" onclick="navigateToProduct(${product.id})">
        <img src="${product.image_url}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-price">$${product.price}</div>
      </div>
    `,
      )
      .join("")
  }
}

// Display related services
function displayRelatedServices(services) {
  const container = document.getElementById("relatedServices")
  if (container) {
    container.innerHTML = services
      .map(
        (service) => `
      <div class="service-card" onclick="navigateToService(${service.id})">
        <img src="${service.image_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=300&q=80"}" alt="${service.name}">
        <h3>${service.name}</h3>
        <p>${service.description}</p>
        <div class="service-price">Starting at $${service.price}</div>
      </div>
    `,
      )
      .join("")
  }
}

// Display related articles
function displayRelatedArticles(articles) {
  const container = document.getElementById("relatedArticles")
  if (container) {
    container.innerHTML = articles
      .map(
        (article) => `
      <div class="article-card" onclick="navigateToArticle('${article.id}')">
        <img src="${article.image_url}" alt="${article.title}">
        <h3>${article.title}</h3>
        <p>${article.description}</p>
      </div>
    `,
      )
      .join("")
  }
}

// Contact provider - redirect to contact provider page
function contactProvider() {
  const productId = localStorage.getItem("selectedProduct")
  const serviceId = localStorage.getItem("selectedService")

  if (productId) {
    // Get provider ID from product and redirect
    localStorage.setItem("contactReason", "product")
    localStorage.setItem("contactItemId", productId)
  } else if (serviceId) {
    // Get provider ID from service and redirect
    localStorage.setItem("contactReason", "service")
    localStorage.setItem("contactItemId", serviceId)
  }

  window.location.href = "contact-provider.html"
}

// Load provider details for contact page
function loadProviderDetails() {
  const reason = localStorage.getItem("contactReason")
  const itemId = localStorage.getItem("contactItemId")

  if (!reason || !itemId) {
    alert("No provider information available")
    window.location.href = "index.html"
    return
  }

  // Fetch provider details based on the reason (product or service)
  const endpoint = reason === "product" 
    ? `php/get-provider-product-detail.php?id=${itemId}`
    : `php/get-provider-service-detail.php?id=${itemId}`

  fetch(endpoint)
    .then(response => response.json())
    .then(data => {
      if (data.success && data.provider) {
        displayProviderContactDetails(data.provider)
        loadProviderProductsAndServices(data.provider.id)
      } else {
        alert("Unable to load provider details")
        window.location.href = "index.html"
      }
    })
    .catch(error => {
      console.error("Error:", error)
      alert("Error loading provider details")
      window.location.href = "index.html"
    })
}

// Display provider contact details
function displayProviderContactDetails(provider) {
  document.getElementById("providerName").textContent = provider.company_name
  document.getElementById("providerDescription").textContent = provider.description
  document.getElementById("contactName").textContent = provider.contact_name
  document.getElementById("contactEmail").textContent = provider.email
  document.getElementById("contactPhone").textContent = provider.phone_number
  document.getElementById("providerLocation").textContent = provider.location
  document.getElementById("providerLogo").src = provider.image_url || "images/default-provider.jpg"
}

// Load provider's products and services
function loadProviderProductsAndServices(providerId) {
  // Fetch provider's products
  fetch(`php/get-provider-products.php?provider_id=${providerId}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const productsGrid = document.getElementById("providerProducts")
        if (productsGrid) {
          productsGrid.innerHTML = data.products.map(product => `
            <div class="product-card">
              <div class="card-image">
                <img src="${product.image_url || 'images/default-product.jpg'}" alt="${product.name}">
              </div>
              <div class="card-content">
                <span class="card-category">${product.category}</span>
                <h3 class="card-title">${product.name}</h3>
                <p class="card-description">${product.description}</p>
                <div class="card-price">$${product.price}</div>
                <button class="learn-more-btn" onclick="viewProduct(${product.id})">Learn More</button>
              </div>
            </div>
          `).join('')
        }
      }
    })
    .catch(error => console.error("Error loading products:", error))

  // Fetch provider's services
  fetch(`php/get-provider-services.php?provider_id=${providerId}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const servicesGrid = document.getElementById("providerServices")
        if (servicesGrid) {
          servicesGrid.innerHTML = data.services.map(service => `
            <div class="service-card">
              <div class="card-image">
                <img src="${service.image_url || 'images/default-service.jpg'}" alt="${service.name}">
              </div>
              <div class="card-content">
                <span class="card-category">${service.category}</span>
                <h3 class="card-title">${service.name}</h3>
                <p class="card-description">${service.description}</p>
                <div class="card-price">$${service.price}</div>
                <button class="learn-more-btn" onclick="viewService(${service.id})">Learn More</button>
              </div>
            </div>
          `).join('')
        }
      }
    })
    .catch(error => console.error("Error loading services:", error))
}

// Add to wishlist
function addToWishlist() {
  alert("Item added to wishlist! (Feature to be implemented)")
}

// View provider profile
function viewProviderProfile(providerId) {
  if (providerId) {
    localStorage.setItem("selectedProvider", providerId)
  }
  window.location.href = "provider-profile.html"
}

// Contact for service
function contactForService() {
  const serviceId = localStorage.getItem("selectedService")
  if (serviceId) {
    localStorage.setItem("contactReason", "service")
    localStorage.setItem("contactItemId", serviceId)
    window.location.href = "contact-provider.html"
  } else {
    alert("Please contact us for more information about this service.")
  }
}

// Contact for product
function contactForProduct() {
  const productId = localStorage.getItem("selectedProduct")
  if (productId) {
    localStorage.setItem("contactReason", "product")
    localStorage.setItem("contactItemId", productId)
    window.location.href = "contact-provider.html"
  } else {
    alert("Please contact us for more information about this product.")
  }
}

function loadFeaturedProducts() {
  fetch('php/get-all-products.php')
    .then(response => response.json())
    .then(data => {
      if (data && data.products && data.products.length > 0) {
        // Show the 3 most recent products
        const products = data.products.slice(0, 3);
        displayFeaturedProducts(products);
      } else {
        document.getElementById('featuredProductsGrid').innerHTML = '<p>No featured products available.</p>';
      }
    })
    .catch(error => {
      document.getElementById('featuredProductsGrid').innerHTML = '<p>Error loading featured products.</p>';
    });
}

function displayFeaturedProducts(products) {
  const grid = document.getElementById('featuredProductsGrid');
  if (!grid) return;

  grid.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="card-image">
        <img src="${product.image_url}" alt="${product.title || ''}" onerror="this.src='./images/default-product.jpg'">
      </div>
      <div class="card-content">
        <span class="card-category">${product.category || ''}</span>
        <h3 class="card-title">${product.title || ''}</h3>
        <p class="card-description">${product.description || 'No description available'}</p>
        <div class="card-price">$${parseFloat(product.pricing).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        <button onclick="navigateToProduct('${product.id}', '${product.source || 'regular'}')" class="learn-more-btn">Learn More</button>
      </div>
    </div>
  `).join('');
}


function loadFeaturedServices() {
  fetch('php/get-all-services.php')
    .then(response => response.json())
    .then(data => {
      if (data && data.services && data.services.length > 0) {
        // Show the 3 most recent services
        const services = data.services.slice(0, 3);
        displayFeaturedServices(services);
      } else {
        document.getElementById('featuredServicesGrid').innerHTML = '<p>No featured services available.</p>';
      }
    })
    .catch(error => {
      document.getElementById('featuredServicesGrid').innerHTML = '<p>Error loading featured services.</p>';
    });
}

function displayFeaturedServices(services) {
  const grid = document.getElementById('featuredServicesGrid');
  if (!grid) return;
  grid.innerHTML = services.map(service => `
    <div class="product-card">
      <div class="card-image">
        <img src="${service.image_url}" alt="${service.title || ''}" onerror="this.src='./images/default-service.jpg'">
      </div>
      <div class="card-content">
        <span class="card-category">${service.category || ''}</span>
        <h3 class="card-title">${service.title || ''}</h3>
        <p class="card-description">${service.description || 'No description available'}</p>
        <div class="card-price">$${parseFloat(service.pricing).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        <button onclick="navigateToService(${service.id})" class="learn-more-btn">Learn More</button>
      </div>
    </div>
  `).join('');
}
