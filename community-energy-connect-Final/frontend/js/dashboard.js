const API_BASE_URL = "http://k8s-default-appingre-f839a6fdd0-522583786.us-east-1.elb.amazonaws.com/php";
let currentSection = "services";
const isEditMode = false;
const editingId = null;

// Load profile data
function loadProfileData() {
  console.log("Loading profile data...");
  fetch(`${API_BASE_URL}/php/get-profile.php`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.profile) {
        displayProfileData(data.profile);
      } else {
        console.error("Error loading profile:", data.message);
      }
    })
    .catch((error) => console.error("Error loading profile:", error));
}

function displayProfileData(profile) {
  const providerName = document.getElementById("providerName");
  if (providerName) providerName.textContent = profile.company_name || 'Provider Name';

  if (document.getElementById('companyName')) document.getElementById('companyName').value = profile.company_name || '';
  if (document.getElementById('contactName')) document.getElementById('contactName').value = profile.contact_name || '';
  if (document.getElementById('email')) document.getElementById('email').value = profile.email || '';
  if (document.getElementById('phoneNumber')) document.getElementById('phoneNumber').value = profile.phone_number || '';
  if (document.getElementById('location')) document.getElementById('location').value = profile.location || '';
  if (document.getElementById('description')) document.getElementById('description').value = profile.description || '';
  if (document.getElementById('services')) document.getElementById('services').value = profile.services || '';
}

function showSection(section) {
  document.querySelectorAll(".content-section").forEach(sec => sec.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));

  const sectionElement = document.getElementById(section + "-section");
  if (sectionElement) sectionElement.classList.add("active");

  const navItem = document.querySelector(`[onclick="showSection('${section}')"]`);
  if (navItem) navItem.classList.add("active");

  const titles = {
    services: "My Services",
    products: "My Products",
    settings: "Profile",
  };
  const titleElement = document.getElementById("pageTitle");
  if (titleElement) titleElement.textContent = titles[section] || "Dashboard";

  currentSection = section;

  if (section === "services") loadServices();
  else if (section === "products") loadProducts();
  else if (section === "settings") loadProfileData();
}

function loadServices() {
  console.log("Loading services...");
  fetch(`${API_BASE_URL}/php/get-provider-services.php`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayServices(data.services);
      } else {
        console.error("Error loading services:", data.message);
        const tbody = document.getElementById("servicesTableBody");
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="5">No services found or error loading services</td></tr>';
        }
      }
    })
    .catch((error) => {
      console.error("Error loading services:", error);
      const tbody = document.getElementById("servicesTableBody");
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="5">Error loading services</td></tr>';
      }
    });
}

function loadProducts() {
  console.log("Loading products...");
  fetch(`${API_BASE_URL}/php/get-provider-products.php`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayProducts(data.products);
      } else {
        console.error("Error loading products:", data.message);
        const tbody = document.getElementById("productsTableBody");
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="6">No products found or error loading products</td></tr>';
        }
      }
    })
    .catch((error) => {
      console.error("Error loading products:", error);
      const tbody = document.getElementById("productsTableBody");
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6">Error loading products</td></tr>';
      }
    });
}

function displayServices(services) {
  const tbody = document.getElementById("servicesTableBody");
  if (!tbody) return;

  if (!services || services.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No services found</td></tr>';
    return;
  }

  tbody.innerHTML = services.map(service => `
    <tr id="service-${service.id}">
      <td>
        <div class="service-info">
          <strong>${service.title}</strong><br>
          <small>${service.subcategory || service.category}</small>
        </div>
      </td>
      <td>${service.category}</td>
      <td>$${Number.parseFloat(service.pricing).toFixed(2)}</td>
      <td><span class="status-${service.status || "active"}">${(service.status || "active").charAt(0).toUpperCase() + (service.status || "active").slice(1)}</span></td>
      <td>
        <div class="action-buttons">
          <button class="action-btn edit-btn" onclick="editService(${service.id})" title="Edit"><i class="icon-edit">✏️</i></button>
          <button class="action-btn remove-btn" onclick="deleteService(${service.id})" title="Delete"><i class="icon-delete">🗑️</i></button>
          <button class="action-btn view-btn" onclick="viewService(${service.id})" title="View"><i class="icon-view">👁️</i></button>
        </div>
      </td>
    </tr>`).join("");
}

function displayProducts(products) {
  const tbody = document.getElementById("productsTableBody");
  if (!tbody) return;

  if (!products || products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">No products found</td></tr>';
    return;
  }

  tbody.innerHTML = products.map(product => `
    <tr id="product-${product.id}">
      <td>
        <div class="product-info">
          <strong>${product.title}</strong><br>
          <small>${product.subcategory || product.category}</small>
        </div>
      </td>
      <td>${product.category}</td>
      <td>$${Number.parseFloat(product.pricing).toFixed(2)}</td>
      <td>${product.quantity || 0}</td>
      <td><span class="status-${product.status || "active"}">${(product.status || "active").charAt(0).toUpperCase() + (product.status || "active").slice(1)}</span></td>
      <td>
        <div class="action-buttons">
          <button class="action-btn edit-btn" onclick="editProduct(${product.id})" title="Edit"><i class="icon-edit">✏️</i></button>
          <button class="action-btn remove-btn" onclick="deleteProduct(${product.id})" title="Delete"><i class="icon-delete">🗑️</i></button>
          <button class="action-btn view-btn" onclick="viewProduct(${product.id})" title="View"><i class="icon-view">👁️</i></button>
        </div>
      </td>
    </tr>`).join("");
}

function deleteService(id) {
  if (confirm("Are you sure you want to delete this service?")) {
    fetch(`${API_BASE_URL}/php/manage-services.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=delete&id=${id}`,
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const row = document.getElementById(`service-${id}`);
        if (row) row.remove();
        alert("Service deleted successfully!");
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
  }
}

function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    fetch(`${API_BASE_URL}/php/manage-products.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=delete&id=${id}`,
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const row = document.getElementById(`product-${id}`);
        if (row) row.remove();
        alert("Product deleted successfully!");
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
  }
}

function viewService(id) {
  localStorage.setItem("selectedService", id);
  localStorage.setItem("selectedServiceType", "provider");
  window.open("service-detail.html", "_blank");
}

function viewProduct(id) {
  localStorage.setItem("selectedProduct", id);
  localStorage.setItem("selectedProductType", "provider");
  window.open("product-detail.html", "_blank");
}

const profileUpdateForm = document.getElementById('profileUpdateForm');
if (profileUpdateForm) {
  profileUpdateForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch(`${API_BASE_URL}/php/update-profile.php`, {
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
    fetch(`${API_BASE_URL}/php/change-password.php`, {
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

document.addEventListener("DOMContentLoaded", () => {
  console.log("Dashboard initialized");
  loadServices();
});

