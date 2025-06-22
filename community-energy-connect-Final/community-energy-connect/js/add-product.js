// Add Product functionality
document.addEventListener("DOMContentLoaded", () => {
  loadProviderName()

  // Handle form submission
  const form = document.getElementById("addProductForm")
  if (form) {
    form.addEventListener("submit", handleProductSubmission)
  }
})

// Handle product form submission
function handleProductSubmission(event) {
  event.preventDefault()

  const form = event.target
  
  // Get all form values
  const title = document.getElementById('title').value.trim()
  const description = document.getElementById('description').value.trim()
  const category = document.getElementById('category').value
  const pricing = document.getElementById('pricing').value
  const specifications = document.getElementById('specifications').value.trim()
  const image_url = document.getElementById('image_url').value.trim()

  // Client-side validation
  if (!title) {
    alert('Please enter a product title')
    return
  }
  
  if (!description) {
    alert('Please enter a product description')
    return
  }
  
  if (!category) {
    alert('Please select a category')
    return
  }
  
  if (!pricing || parseFloat(pricing) <= 0) {
    alert('Please enter a valid price greater than 0')
    return
  }

  const formData = new FormData(form)
  formData.append("action", "create")

  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]')
  const originalText = submitButton.textContent
  submitButton.textContent = "Adding Product..."
  submitButton.disabled = true

  // Debug: Log form data
  console.log("Submitting product data:")
  for (const [key, value] of formData.entries()) {
    console.log(key, value)
  }

  fetch("php/manage-products.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      console.log("Response status:", response.status)
      return response.text()
    })
    .then((text) => {
      console.log("Raw response:", text)

      // Try to extract JSON from the response if it contains HTML
      let jsonText = text
      if (text.includes("{") && text.includes("}")) {
        const jsonStart = text.indexOf("{")
        const jsonEnd = text.lastIndexOf("}") + 1
        jsonText = text.substring(jsonStart, jsonEnd)
      }

      try {
        const data = JSON.parse(jsonText)
        console.log("Parsed response:", data)

        if (data.success) {
          alert("Product added successfully!")
          window.location.href = "products-management.html"
        } else {
          alert("Error: " + (data.message || "Failed to add product"))
        }
      } catch (e) {
        console.error("JSON parse error:", e)
        console.error("Response text:", text)

        // Check if the response contains a success message anyway
        if (text.includes('"success":true') && text.includes("Product created successfully")) {
          alert("Product added successfully!")
          window.location.href = "products-management.html"
        } else {
          alert("Server error: Invalid response format. Please check the console for details.")
        }
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error)
      alert("Network error: " + error.message)
    })
    .finally(() => {
      // Reset loading state
      submitButton.textContent = originalText
      submitButton.disabled = false
    })
}

// Load provider name
function loadProviderName() {
  fetch("php/get-profile.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.profile) {
        const nameElement = document.getElementById("providerName")
        if (nameElement) {
          nameElement.textContent = data.profile.company_name || data.profile.contact_name || "Provider"
        }
      }
    })
    .catch((error) => console.error("Error loading provider name:", error))
}

// Logout function
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    fetch("php/logout.php")
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.removeItem("userSession")
        window.location.href = "index.html"
      })
      .catch((error) => {
        console.error("Error:", error)
        sessionStorage.removeItem("userSession")
        window.location.href = "index.html"
      })
  }
}
