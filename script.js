// Initialize Feather Icons
document.addEventListener('DOMContentLoaded', function() {
  // Initialize icons
  feather.replace();
  
  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  
  mobileMenuBtn.addEventListener('click', function() {
    mobileNav.classList.toggle('active');
    
    // Change icon based on menu state
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileNav.classList.contains('active')) {
      icon.setAttribute('data-feather', 'x');
    } else {
      icon.setAttribute('data-feather', 'menu');
    }
    feather.replace();
  });
  
  // FAQ Accordion
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Close all accordions
      accordionTriggers.forEach(t => {
        t.setAttribute('aria-expanded', 'false');
        t.nextElementSibling.classList.remove('active');
      });
      
      // Toggle current accordion
      if (!isExpanded) {
        this.setAttribute('aria-expanded', 'true');
        this.nextElementSibling.classList.add('active');
      }
    });
  });
  
  // Contact form submission
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      };
      
      // In a real application, you would send this data to a server
      console.log('Form submitted:', formData);
      
      // Show success message (in a real app, this would happen after successful submission)
      alert('Thank you for your message! We\'ll get back to you soon.');
      
      // Reset form
      contactForm.reset();
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close mobile menu if open
      if (mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        mobileMenuBtn.querySelector('i').setAttribute('data-feather', 'menu');
        feather.replace();
      }
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Function to update icons after DOM changes
  function updateIcons() {
    feather.replace();
  }
});