// Services Management functionality
document.addEventListener("DOMContentLoaded", () => {
  loadServices()
})

// Load services
function loadServices() {
  fetch("php/get-provider-services.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayServices(data.services)
      } else {
        console.error("Error loading services:", data.message)
        document.getElementById("servicesTableBody").innerHTML = 
          '<tr><td colspan="4" class="text-center">No services found</td></tr>'
      }
    })
    .catch((error) => {
      console.error("Error loading services:", error)
      document.getElementById("servicesTableBody").innerHTML = 
        '<tr><td colspan="4" class="text-center">Error loading services</td></tr>'
    })
}

// Display services in table
function displayServices(services) {
  const tbody = document.getElementById("servicesTableBody")
  if (!services || services.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center">No services found</td></tr>'
    return
  }

  tbody.innerHTML = services.map(service => `
    <tr>
      <td>
        <div class="service-info">
          <span class="service-title">${service.name || service.title}</span>
          <span class="service-description">${service.description}</span>
        </div>
      </td>
      <td>${service.category} ${service.subcategory ? `- ${service.subcategory}` : ''}</td>
      <td>$${parseFloat(service.price || service.pricing).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
      <td>
        <div class="actions-section">
          <button onclick="viewService(${service.id})" class="action-btn view-btn">
            <i class="fas fa-eye"></i> View
          </button>
          <button onclick="editService(${service.id})" class="action-btn edit-btn">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button onclick="deleteService(${service.id})" class="action-btn remove-btn">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('')
}

// Delete service
function deleteService(id) {
  if (!confirm("Are you sure you want to delete this service?")) {
    return
  }

  const formData = new FormData()
  formData.append('action', 'delete')
  formData.append('id', id)

  fetch("php/manage-services.php", {
    method: 'POST',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        loadServices() // Reload services after deletion
      } else {
        alert(data.message || "Failed to delete service")
      }
    })
    .catch((error) => {
      console.error("Error deleting service:", error)
      alert("Error deleting service")
    })
}

// Edit service
function editService(id) {
  window.location.href = `edit-service.html?id=${id}`
}

// View service
function viewService(id) {
  window.location.href = `service-detail.html?id=${id}`
}

// Logout function
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    sessionStorage.removeItem("userSession")
    window.location.href = "index.html"
  }
}
