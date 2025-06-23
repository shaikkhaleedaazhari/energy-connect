// Products Management functionality
document.addEventListener("DOMContentLoaded", () => {
  loadProducts()
  loadProviderName()
})

// Load products
function loadProducts() {
  fetch("php/get-provider-products.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayProducts(data.products)
      } else {
        console.error("Error loading products:", data.message)
        document.getElementById("productsTableBody").innerHTML = 
          '<tr><td colspan="4" class="text-center">No products found</td></tr>'
      }
    })
    .catch((error) => {
      console.error("Error loading products:", error)
      document.getElementById("productsTableBody").innerHTML = 
        '<tr><td colspan="4" class="text-center">Error loading products</td></tr>'
    })
}

// Display products in table
function displayProducts(products) {
  const tbody = document.getElementById("productsTableBody")
  if (!products || products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center">No products found</td></tr>'
    return
  }

  tbody.innerHTML = products.map(product => `
    <tr>
      <td>
        <div class="product-info">
          <span class="product-title">${product.name || product.title}</span>
          <span class="product-description">${product.description}</span>
        </div>
      </td>
      <td>${product.category} ${product.subcategory ? `- ${product.subcategory}` : ''}</td>
      <td>$${parseFloat(product.price || product.pricing).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
      <td>
        <div class="actions-section">
          <button onclick="viewProduct(${product.id})" class="action-btn view-btn">
            <i class="fas fa-eye"></i> View
          </button>
          <button onclick="editProduct(${product.id})" class="action-btn edit-btn">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button onclick="deleteProduct(${product.id})" class="action-btn remove-btn">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('')
}

// Edit product
function editProduct(id) {
  window.location.href = `edit-product.html?id=${id}`
}

// View product
function viewProduct(id) {
  window.location.href = `product-detail.html?id=${id}`
}

// Delete product
function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return
  }

  const formData = new FormData()
  formData.append('action', 'delete')
  formData.append('id', id)

  fetch("php/manage-products.php", {
    method: 'POST',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        loadProducts() // Reload products after deletion
      } else {
        alert(data.message || "Failed to delete product")
      }
    })
    .catch((error) => {
      console.error("Error deleting product:", error)
      alert("Error deleting product")
    })
}

// Load provider name
function loadProviderName() {
  fetch("php/get-profile.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.profile) {
        document.getElementById("providerName").textContent = data.profile.company_name || "Provider"
      }
    })
    .catch((error) => console.error("Error loading provider name:", error))
}

// Logout function
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    sessionStorage.removeItem("userSession")
    window.location.href = "index.html"
  }
}
