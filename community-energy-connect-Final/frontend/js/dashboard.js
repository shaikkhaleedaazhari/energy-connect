// Dashboard functionality
let currentSection = "services"
const isEditMode = false
const editingId = null

// Load profile data
function loadProfileData() {
  console.log("Loading profile data...")
  fetch("php/get-profile.php")
    .then((response) => {
      console.log("Profile response status:", response.status)
      return response.json()
    })
    .then((data) => {
      console.log("Profile data:", data)
      if (data.success && data.profile) {
        displayProfileData(data.profile)
      } else {
        console.error("Error loading profile:", data.message)
        // Show empty state or error message
        // Optionally show an alert or message on the page
      }
    })
    .catch((error) => {
      console.error("Error loading profile:", error)
      // Optionally show an alert or message on the page
    })
}

// Display profile data in the business information form
function displayProfileData(profile) {
  // Sidebar name
  const providerName = document.getElementById("providerName")
  if (providerName) providerName.textContent = profile.company_name || 'Provider Name'

  // Business Information form fields
  if (document.getElementById('companyName')) document.getElementById('companyName').value = profile.company_name || '';
  if (document.getElementById('contactName')) document.getElementById('contactName').value = profile.contact_name || '';
  if (document.getElementById('email')) document.getElementById('email').value = profile.email || '';
  if (document.getElementById('phoneNumber')) document.getElementById('phoneNumber').value = profile.phone_number || '';
  if (document.getElementById('location')) document.getElementById('location').value = profile.location || '';
  if (document.getElementById('description')) document.getElementById('description').value = profile.description || '';
  if (document.getElementById('services')) document.getElementById('services').value = profile.services || '';
}

// Show different sections
function showSection(section) {
  // Hide all sections
  document.querySelectorAll(".content-section").forEach((sec) => {
    sec.classList.remove("active")
  })

  // Remove active class from nav items
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active")
  })

  // Show selected section
  const sectionElement = document.getElementById(section + "-section")
  if (sectionElement) {
    sectionElement.classList.add("active")
  }

  // Add active class to clicked nav item
  const navItem = document.querySelector(`[onclick="showSection('${section}')"]`)
  if (navItem) {
    navItem.classList.add("active")
  }

  // Update page title
  const titles = {
    services: "My Services",
    products: "My Products",
    settings: "Profile",
  }

  const titleElement = document.getElementById("pageTitle")
  if (titleElement) {
    titleElement.textContent = titles[section] || "Dashboard"
  }
  currentSection = section

  // Load data for the section
  if (section === "services") {
    loadServices()
  } else if (section === "products") {
    loadProducts()
  } else if (section === "settings") {
    loadProfileData()
  }
}

// Load services
function loadServices() {
  console.log("Loading services...")
  fetch("php/get-provider-services.php")
    .then((response) => {
      console.log("Services response status:", response.status)
      return response.json()
    })
    .then((data) => {
      console.log("Services data:", data)
      if (data.success) {
        displayServices(data.services)
      } else {
        console.error("Error loading services:", data.message)
        // Show empty state or error message
        const tbody = document.getElementById("servicesTableBody")
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="5">No services found or error loading services</td></tr>'
        }
      }
    })
    .catch((error) => {
      console.error("Error loading services:", error)
      const tbody = document.getElementById("servicesTableBody")
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="5">Error loading services</td></tr>'
      }
    })
}

// Load products
function loadProducts() {
  console.log("Loading products...")
  fetch("php/get-provider-products.php")
    .then((response) => {
      console.log("Products response status:", response.status)
      return response.json()
    })
    .then((data) => {
      console.log("Products data:", data)
      if (data.success) {
        displayProducts(data.products)
      } else {
        console.error("Error loading products:", data.message)
        const tbody = document.getElementById("productsTableBody")
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="6">No products found or error loading products</td></tr>'
        }
      }
    })
    .catch((error) => {
      console.error("Error loading products:", error)
      const tbody = document.getElementById("productsTableBody")
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6">Error loading products</td></tr>'
      }
    })
}

// Display services in table
function displayServices(services) {
  const tbody = document.getElementById("servicesTableBody")
  if (!tbody) {
    console.error("Services table body not found")
    return
  }

  if (!services || services.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No services found</td></tr>'
    return
  }

  tbody.innerHTML = services
    .map(
      (service) => `
        <tr id="service-${service.id}">
            <td>
                <div class="service-info">
                    <strong>${service.title}</strong>
                    <br><small>${service.subcategory || service.category}</small>
                </div>
            </td>
            <td>${service.category}</td>
            <td>$${Number.parseFloat(service.pricing).toFixed(2)}</td>
            <td><span class="status-${service.status || "active"}">${(service.status || "active").charAt(0).toUpperCase() + (service.status || "active").slice(1)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editService(${service.id})" title="Edit">
                        <i class="icon-edit">✏️</i>
                    </button>
                    <button class="action-btn remove-btn" onclick="deleteService(${service.id})" title="Delete">
                        <i class="icon-delete">🗑️</i>
                    </button>
                    <button class="action-btn view-btn" onclick="viewService(${service.id})" title="View">
                        <i class="icon-view">👁️</i>
                    </button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("")
}

// Display products in table
function displayProducts(products) {
  const tbody = document.getElementById("productsTableBody")
  if (!tbody) {
    console.error("Products table body not found")
    return
  }

  if (!products || products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">No products found</td></tr>'
    return
  }

  tbody.innerHTML = products
    .map(
      (product) => `
        <tr id="product-${product.id}">
            <td>
                <div class="product-info">
                    <strong>${product.title}</strong>
                    <br><small>${product.subcategory || product.category}</small>
                </div>
            </td>
            <td>${product.category}</td>
            <td>$${Number.parseFloat(product.pricing).toFixed(2)}</td>
            <td>${product.quantity || 0}</td>
            <td><span class="status-${product.status || "active"}">${(product.status || "active").charAt(0).toUpperCase() + (product.status || "active").slice(1)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editProduct(${product.id})" title="Edit">
                        <i class="icon-edit">✏️</i>
                    </button>
                    <button class="action-btn remove-btn" onclick="deleteProduct(${product.id})" title="Delete">
                        <i class="icon-delete">🗑️</i>
                    </button>
                    <button class="action-btn view-btn" onclick="viewProduct(${product.id})" title="View">
                        <i class="icon-view">👁️</i>
                    </button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("")
}

// Delete service with real-time UI update
function deleteService(id) {
  if (confirm("Are you sure you want to delete this service?")) {
    fetch("php/manage-services.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=delete&id=${id}`,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Remove from UI immediately
          const row = document.getElementById(`service-${id}`)
          if (row) {
            row.remove()
          }
          alert("Service deleted successfully!")
        } else {
          alert("Error: " + data.message)
        }
      })
      .catch((error) => console.error("Error:", error))
  }
}

// Delete product with real-time UI update
function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    fetch("php/manage-products.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=delete&id=${id}`,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Remove from UI immediately
          const row = document.getElementById(`product-${id}`)
          if (row) {
            row.remove()
          }
          alert("Product deleted successfully!")
        } else {
          alert("Error: " + data.message)
        }
      })
      .catch((error) => console.error("Error:", error))
  }
}

// View service
function viewService(id) {
  localStorage.setItem("selectedService", id)
  localStorage.setItem("selectedServiceType", "provider")
  window.open("service-detail.html", "_blank")
}

// View product
function viewProduct(id) {
  localStorage.setItem("selectedProduct", id)
  localStorage.setItem("selectedProductType", "provider")
  window.open("product-detail.html", "_blank")
}

// Handle provider profile update
const profileUpdateForm = document.getElementById('profileUpdateForm');
if (profileUpdateForm) {
  profileUpdateForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('php/update-profile.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Profile updated successfully!');
        loadProfileData();
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while updating profile');
    });
  });
}

// Handle provider password change
const passwordChangeForm = document.getElementById('passwordChangeForm');
if (passwordChangeForm) {
  passwordChangeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const newPassword = formData.get('new_password');
    const confirmPassword = formData.get('confirm_password');
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    fetch('php/change-password.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Password changed successfully!');
        this.reset();
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while changing password');
    });
  });
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  console.log("Dashboard initialized")
  loadServices()
})
