// Authentication System
class AuthSystem {
  constructor() {
    this.isLoggedIn = false;
    this.currentUser = null;
    this.init();
  }
  
  init() {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('daycare_user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
        this.isLoggedIn = true;
        this.updateUI();
      } catch (e) {
        console.error('Failed to parse saved user data');
        localStorage.removeItem('daycare_user');
      }
    }
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Login button click
    document.querySelectorAll('.login-btn').forEach(btn => {
      btn.addEventListener('click', () => this.showLoginModal());
    });
    
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => this.hideModals());
    });
    
    // Switch between login and signup
    document.getElementById('switchToSignup').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('loginModal').classList.remove('active');
      document.getElementById('signupModal').classList.add('active');
    });
    
    document.getElementById('switchToLogin').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('signupModal').classList.remove('active');
      document.getElementById('loginModal').classList.add('active');
    });
    
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });
    
    document.getElementById('signupForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSignup();
    });
    
    // Logout
    document.querySelectorAll('.logout-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleLogout());
    });
    
    // Profile dropdown toggle
    document.querySelectorAll('.profile-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector('.profile-dropdown').classList.toggle('active');
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const dropdown = document.querySelector('.profile-dropdown');
      const toggle = document.querySelector('.profile-toggle');
      if (dropdown && toggle && !dropdown.contains(e.target) && !toggle.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  }
  
  showLoginModal() {
    if (this.isLoggedIn) return;
    document.getElementById('loginModal').classList.add('active');
    document.getElementById('authOverlay').classList.add('active');
  }
  
  hideModals() {
    document.querySelectorAll('.auth-modal').forEach(modal => {
      modal.classList.remove('active');
    });
    document.getElementById('authOverlay').classList.remove('active');
  }
  
  handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
      this.showError('loginError', 'Please enter both email and password');
      return;
    }
    
    // In a real app, you would verify credentials with a server
    // For demo purposes, we'll simulate a successful login
    
    // Simulate API call with timeout
    this.setLoading('loginBtn', true);
    
    setTimeout(() => {
      // Create user object (in a real app, this would come from your backend)
      this.currentUser = {
        id: 'user_' + Date.now(),
        name: email.split('@')[0], // Extract name from email
        email: email,
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage (in a real app, you'd use secure cookies or tokens)
      localStorage.setItem('daycare_user', JSON.stringify(this.currentUser));
      
      this.isLoggedIn = true;
      this.updateUI();
      this.hideModals();
      this.setLoading('loginBtn', false);
    }, 1000);
  }
  
  handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Simple validation
    if (!name || !email || !password) {
      this.showError('signupError', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      this.showError('signupError', 'Passwords do not match');
      return;
    }
    
    // Simulate API call with timeout
    this.setLoading('signupBtn', true);
    
    setTimeout(() => {
      // Create user object
      this.currentUser = {
        id: 'user_' + Date.now(),
        name: name,
        email: email,
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('daycare_user', JSON.stringify(this.currentUser));
      
      this.isLoggedIn = true;
      this.updateUI();
      this.hideModals();
      this.setLoading('signupBtn', false);
    }, 1000);
  }
  
  handleLogout() {
    // Clear user data
    this.currentUser = null;
    this.isLoggedIn = false;
    
    // Remove from localStorage
    localStorage.removeItem('daycare_user');
    
    // Update UI
    this.updateUI();
  }
  
  updateUI() {
    // Update login/logout buttons
    const loginButtons = document.querySelectorAll('.login-btn');
    const userMenus = document.querySelectorAll('.user-menu');
    const userNames = document.querySelectorAll('.user-name');
    
    if (this.isLoggedIn) {
      // Hide login buttons, show user menu
      loginButtons.forEach(btn => btn.style.display = 'none');
      userMenus.forEach(menu => menu.style.display = 'flex');
      
      // Set user name
      userNames.forEach(el => {
        el.textContent = this.currentUser.name;
      });
      
      // Set user email in dropdown
      const userEmail = document.querySelector('.user-email');
      if (userEmail) {
        userEmail.textContent = this.currentUser.email;
      }
    } else {
      // Show login buttons, hide user menu
      loginButtons.forEach(btn => btn.style.display = 'inline-flex');
      userMenus.forEach(menu => menu.style.display = 'none');
    }
    
    // Update icons
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }
  
  showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 3000);
  }
  
  setLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (isLoading) {
      button.disabled = true;
      button.innerHTML = '<span class="loading-spinner"></span> Processing...';
    } else {
      button.disabled = false;
      button.innerHTML = buttonId === 'loginBtn' ? 'Log In' : 'Sign Up';
    }
  }
}

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.authSystem = new AuthSystem();
});