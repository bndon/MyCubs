// Booking System
class BookingSystem {
  constructor() {
    this.currentStep = 1;
    this.bookingData = {};
    this.init();
  }
  
  init() {
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize date inputs with today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').min = today;
    if (document.getElementById('startDate')) {
      document.getElementById('startDate').min = today;
    }
    
    // Show/hide conditional fields based on service type
    this.toggleConditionalFields('hourly');
  }
  
  setupEventListeners() {
    // Book buttons click
    const bookButtons = document.querySelectorAll('.book-visit-btn, .book-now-btn');
    bookButtons.forEach(btn => {
      btn.addEventListener('click', () => this.showBookingModal());
    });
    
    // Close modal buttons
    document.querySelectorAll('.close-modal, .close-booking').forEach(btn => {
      btn.addEventListener('click', () => this.hideModal());
    });
    
    // Next step buttons
    document.querySelectorAll('.next-step').forEach(btn => {
      btn.addEventListener('click', () => this.nextStep());
    });
    
    // Previous step buttons
    document.querySelectorAll('.prev-step').forEach(btn => {
      btn.addEventListener('click', () => this.prevStep());
    });
    
    // Service type change
    const serviceRadios = document.querySelectorAll('input[name="serviceType"]');
    serviceRadios.forEach(radio => {
      radio.addEventListener('change', (e) => this.toggleConditionalFields(e.target.value));
    });
    
    // Form submission
    document.getElementById('bookingForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleBookingSubmit();
    });
    
    // Booking overlay click to close
    document.getElementById('bookingOverlay').addEventListener('click', () => this.hideModal());
    
    // Prevent modal close when clicking inside the modal
    document.querySelector('.booking-modal-content').addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Input validation on blur
    const requiredInputs = document.querySelectorAll('#bookingForm input[required], #bookingForm textarea[required]');
    requiredInputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
    });

    // Email validation
    const emailInput = document.getElementById('parentEmail');
    emailInput.addEventListener('blur', () => this.validateEmail(emailInput));

    // Phone validation
    const phoneInput = document.getElementById('parentPhone');
    phoneInput.addEventListener('blur', () => this.validatePhone(phoneInput));
  }
  
  showBookingModal() {
    const modal = document.getElementById('bookingModal');
    const overlay = document.getElementById('bookingOverlay');
  
    modal.classList.add('active');
    overlay.classList.add('active');
  
    this.goToStep(1);
  
    if (window.authSystem && window.authSystem.isLoggedIn) {
      const emailInput = document.getElementById('parentEmail');
      const nameInput = document.getElementById('parentName');
  
      if (emailInput && window.authSystem.currentUser.email) {
        emailInput.value = window.authSystem.currentUser.email;
      }
  
      if (nameInput && window.authSystem.currentUser.name) {
        nameInput.value = window.authSystem.currentUser.name;
      }
    }
  }
  
  
  hideModal() {
    document.getElementById('bookingModal').classList.remove('active');
    document.getElementById('bookingOverlay').classList.remove('active');
    
    // Reset form after a delay
    setTimeout(() => {
      document.getElementById('bookingForm').reset();
      document.getElementById('bookingSuccess').style.display = 'none';
      document.getElementById('bookingForm').style.display = 'block';
      document.querySelectorAll('.booking-step-content').forEach(step => {
        step.classList.remove('active');
      });
      document.querySelector('.booking-step-content[data-step="1"]').classList.add('active');
      
      // Reset steps
      document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'completed');
      });
      document.querySelector('.step[data-step="1"]').classList.add('active');
      
      // Clear error messages
      document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
        error.classList.remove('active');
      });
      
      // Remove invalid class from inputs
      document.querySelectorAll('.invalid').forEach(input => {
        input.classList.remove('invalid');
      });
      
      // Reset current step
      this.currentStep = 1;
    }, 300);
  }
  
  nextStep() {
    if (this.validateCurrentStep()) {
      this.goToStep(this.currentStep + 1);
      
      // If moving to step 3, update summary
      if (this.currentStep === 3) {
        this.updateSummary();
      }
    }
  }
  
  prevStep() {
    this.goToStep(this.currentStep - 1);
  }
  
  goToStep(stepNumber) {
    const steps = document.querySelectorAll('.booking-step-content');
    steps.forEach(step => step.classList.remove('active'));
  
    const targetStep = document.querySelector(`.booking-step-content[data-step="${stepNumber}"]`);
    targetStep.classList.add('active');
  
    document.querySelectorAll('.step').forEach(step => {
      const stepNum = parseInt(step.getAttribute('data-step'));
      step.classList.remove('active', 'completed');
  
      if (stepNum === stepNumber) {
        step.classList.add('active');
      } else if (stepNum < stepNumber) {
        step.classList.add('completed');
      }
    });
  
    this.currentStep = stepNumber;
  }
  
  
  validateField(field) {
    const errorElement = document.getElementById(`${field.id}Error`);
    
    if (!field.value.trim()) {
      field.classList.add('invalid');
      errorElement.textContent = 'This field is required';
      errorElement.classList.add('active');
      return false;
    } else {
      field.classList.remove('invalid');
      errorElement.textContent = '';
      errorElement.classList.remove('active');
      return true;
    }
  }
  
  validateEmail(field) {
    const errorElement = document.getElementById(`${field.id}Error`);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!field.value.trim()) {
      field.classList.add('invalid');
      errorElement.textContent = 'Email is required';
      errorElement.classList.add('active');
      return false;
    } else if (!emailRegex.test(field.value)) {
      field.classList.add('invalid');
      errorElement.textContent = 'Please enter a valid email address';
      errorElement.classList.add('active');
      return false;
    } else {
      field.classList.remove('invalid');
      errorElement.textContent = '';
      errorElement.classList.remove('active');
      return true;
    }
  }
  
  validatePhone(field) {
    const errorElement = document.getElementById(`${field.id}Error`);
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    
    if (!field.value.trim()) {
      field.classList.add('invalid');
      errorElement.textContent = 'Phone number is required';
      errorElement.classList.add('active');
      return false;
    } else if (!phoneRegex.test(field.value)) {
      field.classList.add('invalid');
      errorElement.textContent = 'Please enter a valid phone number';
      errorElement.classList.add('active');
      return false;
    } else {
      field.classList.remove('invalid');
      errorElement.textContent = '';
      errorElement.classList.remove('active');
      return true;
    }
  }
  
  validateCurrentStep() {
    if (this.currentStep === 1) {
      // Service selection validation
      return true; // Always valid as we have radio buttons with defaults
    } else if (this.currentStep === 2) {
      // Details validation
      const requiredFields = [
        'parentName',
        'parentPhone',
        'parentEmail',
        'childName',
        'childAge',
        'bookingDate',
        'bookingTime'
      ];
      
      // Add conditional required fields based on service type
      const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
      if (serviceType === 'hourly') {
        requiredFields.push('hoursDuration');
      } else if (serviceType === 'monthly') {
        requiredFields.push('startDate');
      }
      
      let isValid = true;
      
      // Validate each required field
      requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
          if (fieldId === 'parentEmail') {
            isValid = this.validateEmail(field) && isValid;
          } else if (fieldId === 'parentPhone') {
            isValid = this.validatePhone(field) && isValid;
          } else {
            isValid = this.validateField(field) && isValid;
          }
        }
      });
      
      return isValid;
    } else if (this.currentStep === 3) {
      // Terms agreement validation
      const termsCheckbox = document.getElementById('termsAgree');
      const errorElement = document.getElementById('termsAgreeError');
      
      if (!termsCheckbox.checked) {
        errorElement.textContent = 'You must agree to the terms and conditions';
        errorElement.classList.add('active');
        return false;
      } else {
        errorElement.textContent = '';
        errorElement.classList.remove('active');
        return true;
      }
    }
    
    return true;
  }
  
  toggleConditionalFields(serviceType) {
    // Hide all conditional fields
    document.querySelectorAll('.conditional-field').forEach(field => {
      field.style.display = 'none';
    });
    
    // Show relevant fields based on service type
    if (serviceType === 'hourly') {
      document.getElementById('hourlyOptions').style.display = 'block';
    } else if (serviceType === 'monthly') {
      document.getElementById('monthlyOptions').style.display = 'block';
    }
  }
  
  updateSummary() {
    // Get form data
    const formData = new FormData(document.getElementById('bookingForm'));
    const serviceType = formData.get('serviceType');
    
    // Update service summary
    let serviceName, servicePrice;
    switch (serviceType) {
      case 'hourly':
        serviceName = 'Hourly Care';
        servicePrice = 'Rp 75K/hour';
        break;
      case 'daily':
        serviceName = 'Daily Care';
        servicePrice = 'Rp 450K/day';
        break;
      case 'monthly':
        serviceName = 'Monthly Care';
        servicePrice = 'Rp 8M/month';
        break;
      case 'visit':
        serviceName = 'Facility Visit';
        servicePrice = 'Free';
        break;
    }
    
    document.getElementById('summaryService').textContent = `${serviceName} - ${servicePrice}`;
    
    // Update parent info
    document.getElementById('summaryParent').textContent = `Name: ${formData.get('parentName')}`;
    document.getElementById('summaryContact').textContent = `Phone: ${formData.get('parentPhone')} | Email: ${formData.get('parentEmail')}`;
    
    // Update child info
    document.getElementById('summaryChild').textContent = `Name: ${formData.get('childName')} | Age: ${formData.get('childAge')} months`;
    document.getElementById('summaryNotes').textContent = `Notes: ${formData.get('childNotes') || 'None provided'}`;
    
    // Update schedule
    const bookingDate = new Date(formData.get('bookingDate'));
    const formattedDate = bookingDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const bookingTime = formData.get('bookingTime');
    const [hours, minutes] = bookingTime.split(':');
    const formattedTime = new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    document.getElementById('summarySchedule').textContent = `Date: ${formattedDate} | Time: ${formattedTime}`;
    
    // Update duration/total based on service type
    let totalPrice = 0;
    
    if (serviceType === 'hourly') {
      const hours = parseInt(formData.get('hoursDuration'));
      document.getElementById('summaryDuration').textContent = `Duration: ${hours} hours`;
      totalPrice = 75000 * hours;
    } else if (serviceType === 'daily') {
      document.getElementById('summaryDuration').textContent = 'Duration: Full day (8 hours)';
      totalPrice = 450000;
    } else if (serviceType === 'monthly') {
      const startDate = new Date(formData.get('startDate'));
      const formattedStartDate = startDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      document.getElementById('summaryDuration').textContent = `Start Date: ${formattedStartDate} | Duration: 1 month`;
      totalPrice = 8000000;
    } else {
      document.getElementById('summaryDuration').textContent = 'Duration: Approximately 1 hour';
      totalPrice = 0;
    }
    
    // Format total price
    const formattedTotal = totalPrice === 0 ? 
      'Free' : 
      `Rp ${totalPrice.toLocaleString('id-ID')}`;
    
    document.getElementById('summaryTotal').textContent = formattedTotal;
  }
  
  handleBookingSubmit() {
    if (!this.validateCurrentStep()) {
      return;
    }
  
    const confirmBtn = document.getElementById('confirmBookingBtn');
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
  
    setTimeout(() => {
      const bookingRef = 'FBD-' + Math.floor(10000 + Math.random() * 90000);
      document.getElementById('bookingReference').textContent = bookingRef;
  
      document.getElementById('bookingForm').style.display = 'none';
  
      const successEl = document.getElementById('bookingSuccess');
      successEl.style.display = 'block';
  
      // Trigger fade-in animation
      setTimeout(() => {
        successEl.classList.add('show');
      }, 10);
  
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Confirm Booking';
    }, 2000);
  }
  
  
  showError(message) {
    const errorElement = document.getElementById('bookingError');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 3000);
  }
}

// Initialize booking system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.bookingSystem = new BookingSystem();
});