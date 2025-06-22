// User Profile Management
document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile()

  // Handle profile form submission
  document.getElementById("profileForm").addEventListener("submit", handleProfileUpdate)

  // Handle password change form submission
  document.getElementById("passwordForm").addEventListener("submit", handlePasswordChange)
})

// Load user profile data
function loadUserProfile() {
  fetch("php/get-profile.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.profile) {
        populateProfileForm(data.profile)
      } else {
        console.error("Error loading profile:", data.message)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}

// Populate profile form with current data
function populateProfileForm(profile) {
  document.getElementById("company_name").value = profile.company_name || ""
  document.getElementById("contact_name").value = profile.contact_name || ""
  document.getElementById("email").value = profile.email || ""
  document.getElementById("phone_number").value = profile.phone_number || ""
  document.getElementById("location").value = profile.location || ""
  document.getElementById("description").value = profile.description || ""
  document.getElementById("services").value = profile.services || ""
}

// Handle profile update
function handleProfileUpdate(event) {
  event.preventDefault()

  const formData = new FormData(event.target)

  fetch("php/update-profile.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Profile updated successfully!")
        // Update userSession in sessionStorage with new name
        const userSession = sessionStorage.getItem("userSession")
        if (userSession) {
          const userObj = JSON.parse(userSession)
          // Try to use contact_name, company_name, or first/last name
          if (formData.get("contact_name")) {
            userObj.name = formData.get("contact_name")
          } else if (formData.get("company_name")) {
            userObj.name = formData.get("company_name")
          } else if (formData.get("firstName") && formData.get("lastName")) {
            userObj.name = formData.get("firstName") + " " + formData.get("lastName")
          }
          sessionStorage.setItem("userSession", JSON.stringify(userObj))
          if (window.authManager) authManager.updateNavigation()
        }
        loadUserProfile() // Reload to show updated data
      } else {
        alert("Error: " + data.message)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("An error occurred. Please try again.")
    })
}

// Handle password change
function handlePasswordChange(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const newPassword = formData.get("new_password")
  const confirmPassword = formData.get("confirm_password")

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match!")
    return
  }

  fetch("php/change-password.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Password changed successfully!")
        event.target.reset() // Clear the form
      } else {
        alert("Error: " + data.message)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("An error occurred. Please try again.")
    })
}
