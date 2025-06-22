// Authentication and navigation management
class AuthManager {
  constructor() {
    this.apiBaseUrl = "http://k8s-default-appingre-f839a6fdd0-522583786.us-east-1.elb.amazonaws.com/php"; // Backend container IP
    this.init();
  }

  init() {
    this.checkAuthStatus();
    this.updateNavigation();
  }

  // Check if user is logged in
  checkAuthStatus() {
    const userSession = sessionStorage.getItem("userSession");
    if (userSession) {
      try {
        this.currentUser = JSON.parse(userSession);
        return true;
      } catch (e) {
        sessionStorage.removeItem("userSession");
        return false;
      }
    }
    return false;
  }

  // Update navigation based on auth status
  updateNavigation() {
    const navAuth = document.getElementById("navAuth");
    if (!navAuth) return;

    if (this.checkAuthStatus()) {
      const userType = this.currentUser.type;
      const userName = this.currentUser.name;

      navAuth.innerHTML = `
        <div class="user-profile-dropdown">
          <button class="profile-btn" onclick="authManager.toggleProfileMenu()">
            <div class="profile-icon">👤</div>
            <span class="profile-name">${userName}</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          <div class="profile-menu" id="profileMenu" style="display: none;">
            ${
              userType === "provider"
                ? '<a href="provider-dashboard.html" class="menu-item">Dashboard</a>'
                : '<a href="user-profile.html" class="menu-item">Profile</a>'
            }
            <a href="#" class="menu-item" onclick="authManager.logout()">Logout</a>
          </div>
        </div>
      `;
    } else {
      navAuth.innerHTML = `
        <a href="signup.html" class="btn-signup">Sign Up</a>
        <a href="login.html" class="btn-login">Login</a>
      `;
    }
  }

  // Toggle profile dropdown menu
  toggleProfileMenu() {
    const profileMenu = document.getElementById("profileMenu");
    if (profileMenu) {
      profileMenu.style.display = profileMenu.style.display === "none" ? "block" : "none";
    }
  }

  // Handle login API call
  async login(email, password) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/php/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      this.handleLoginSuccess(data.user);
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed. Please check your credentials.");
    }
  }

  // Handle login success
  handleLoginSuccess(userData) {
    this.currentUser = userData;
    sessionStorage.setItem("userSession", JSON.stringify(userData));

    if (userData.type === "provider") {
      window.location.href = "provider-dashboard.html";
    } else {
      window.location.href = "index.html";
    }
  }

  logout() {
    sessionStorage.removeItem("userSession");
    this.currentUser = null;
    window.location.href = "index.html";
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isProvider() {
    return this.currentUser && this.currentUser.type === "provider";
  }
}

const authManager = new AuthManager();

document.addEventListener("click", (event) => {
  const profileDropdown = document.querySelector(".user-profile-dropdown");
  const profileMenu = document.getElementById("profileMenu");

  if (profileDropdown && profileMenu && !profileDropdown.contains(event.target)) {
    profileMenu.style.display = "none";
  }
});

function updateActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateActiveNavLink();
});

