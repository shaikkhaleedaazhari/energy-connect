// Backend container IP
const API_BASE_URL = "http://backend";

// Add Service functionality
document.addEventListener("DOMContentLoaded", () => {
  loadProviderName();

  const form = document.getElementById("addServiceForm");
  if (form) {
    form.addEventListener("submit", handleServiceSubmission);
  }
});

// Handle service form submission
function handleServiceSubmission(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  formData.append("action", "create");

  // Convert features textarea to JSON string
  const featuresField = document.getElementById("features");
  if (featuresField) {
    const features = featuresField.value
      .split("\n")
      .map(f => f.trim())
      .filter(f => f.length > 0);
    formData.set("features", JSON.stringify(features));
  }

  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = "Adding Service...";
  submitButton.disabled = true;

  console.log("Submitting service data:");
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  fetch(`${API_BASE_URL}/php/manage-services.php`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      console.log("Response status:", response.status);
      return response.text();
    })
    .then((text) => {
      console.log("Raw response:", text);

      if (!text || text.trim() === "") {
        console.error("Empty response received");
        alert("Server error: Empty response. Please check server configuration.");
        return;
      }

      let jsonText = text;
      if (text.includes("{") && text.includes("}")) {
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}") + 1;
        jsonText = text.substring(jsonStart, jsonEnd);
      }

      try {
        const data = JSON.parse(jsonText);
        console.log("Parsed response:", data);

        if (data.success) {
          alert("Service added successfully!");
          window.location.href = "services-management.html";
        } else {
          alert("Error: " + (data.message || "Failed to add service"));
        }
      } catch (e) {
        console.error("JSON parse error:", e);
        console.error("Response text:", text);

        if (text.includes('"success":true') && text.includes("Service created successfully")) {
          alert("Service added successfully!");
          window.location.href = "services-management.html";
        } else {
          alert("Server error: Invalid response format. Please check the console for details.");
        }
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      alert("Network error: " + error.message);
    })
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
}

// Load provider name
function loadProviderName() {
  fetch(`${API_BASE_URL}/php/get-profile.php`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.profile) {
        const nameElement = document.getElementById("providerName");
        if (nameElement) {
          nameElement.textContent = data.profile.company_name || data.profile.contact_name || "Provider";
        }
      }
    })
    .catch((error) => console.error("Error loading provider name:", error));
}

// Logout function
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    fetch(`${API_BASE_URL}/php/logout.php`)
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.removeItem("userSession");
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Error:", error);
        sessionStorage.removeItem("userSession");
        window.location.href = "index.html";
      });
  }
}

