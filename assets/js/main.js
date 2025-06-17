// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu elements
  let menuBtn = document.querySelector('.menu-btn');
  let navLinks = document.querySelector('.nav-links');
  let navItems = document.querySelectorAll('.nav-links li a');
  const html = document.documentElement;
  const body = document.body;
  let isMenuOpen = false;
  
  // Function to check if we're on mobile
  function isMobile() {
    return window.innerWidth <= 768;
  }
  
  // Function to update menu state
  function updateMenuState() {
    if (!isMobile()) {
      // On desktop, ensure menu is always visible
      if (navLinks) {
        navLinks.classList.remove('active');
        body.style.overflow = '';
        isMenuOpen = false;
      }
      return false;
    }
    return true;
  }

  // Toggle mobile menu
  function toggleMenu(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    if (!navLinks || !menuBtn) return;
    
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
      // Open menu
      navLinks.classList.add('active');
      menuBtn.classList.add('active');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Close menu');
      body.style.overflow = 'hidden';
    } else {
      // Close menu
      navLinks.classList.remove('active');
      menuBtn.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
      body.style.overflow = '';
    }
  }

  // Initialize menu button and navigation
  function initMobileMenu() {
    // Get fresh references to elements
    menuBtn = document.querySelector('.menu-btn');
    navLinks = document.querySelector('.nav-links');
    navItems = document.querySelectorAll('.nav-links li a');
    
    if (!menuBtn || !navLinks) return;
    
    // Set initial state
    updateMenuState();
    
    // Set initial attributes
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    menuBtn.setAttribute('aria-controls', 'main-navigation');
    
    // Remove existing event listeners
    const newMenuBtn = menuBtn.cloneNode(true);
    menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);
    menuBtn = newMenuBtn;
    
    // Add click event to menu button
    menuBtn.addEventListener('click', toggleMenu, false);
    
    // Add click events to nav items
    navItems = document.querySelectorAll('.nav-links li a');
    navItems.forEach(item => {
      item.removeEventListener('click', closeMenu);
      item.addEventListener('click', closeMenu, false);
    });
    
    // Handle clicks outside the menu
    document.removeEventListener('click', handleOutsideClick);
    document.addEventListener('click', handleOutsideClick, false);
  }
  
  // Handle clicks outside the menu
  function handleOutsideClick(e) {
    if (!isMenuOpen) return;
    
    const target = e.target;
    const isClickInsideNav = navLinks && (navLinks === target || navLinks.contains(target));
    const isClickOnMenuBtn = menuBtn && (menuBtn === target || menuBtn.contains(target));
    
    if (!isClickInsideNav && !isClickOnMenuBtn) {
      closeMenu();
    }
  }
  
  // Close menu function
  function closeMenu() {
    if (!isMenuOpen) return;
    toggleMenu();
  }
  
  // Initialize the mobile menu and navigation
  initMobileMenu();
  setupNavigation();
  
  // Set up active page highlighting
  setupActivePage();
  
  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      const wasMenuOpen = isMenuOpen;
      if (updateMenuState() && wasMenuOpen) {
        // If we're on mobile and menu was open, reinitialize
        initMobileMenu();
        setupNavigation();
      }
    }, 100);
  }, false);
  
  // Initialize animations on scroll
  window.addEventListener('load', animateOnScroll);
  window.addEventListener('scroll', animateOnScroll);

  // Handle navigation item clicks
  function setupNavigation() {
    navItems = document.querySelectorAll('.nav-links li a');
    
    navItems.forEach(item => {
      // Remove any existing event listeners
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);
      
      // Add new event listener
      newItem.addEventListener('click', function(e) {
        // Only prevent default for anchor links that don't point to other pages
        if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            // Close menu if open
            closeMenu();
            
            // Smooth scroll to target
            setTimeout(() => {
              targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }, 100);
            
            // Update URL without jumping
            history.pushState(null, null, targetId);
          }
        } else {
          // For regular navigation links, just close the menu
          closeMenu();
        }
      }, false);
    });
  }

  // Set up active page highlighting
  function setupActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksAll = document.querySelectorAll('.nav-links a');

    navLinksAll.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === currentPage || 
          (currentPage === '' && linkHref === 'index.html') ||
          (currentPage === 'index.html' && linkHref === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile menu if open
        closeMenu();
        
        // Smooth scroll to target
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Add/remove scrolled class based on scroll position
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Hide/show navbar on scroll
  if (currentScroll <= 0) {
    navbar.classList.remove('scroll-up');
    return;
  }
  
  if (currentScroll > lastScroll && !navLinks.classList.contains('active')) {
    // Scrolling down
    navbar.classList.remove('scroll-down');
    navbar.classList.add('scroll-up');
  } else if (currentScroll < lastScroll && !navLinks.classList.contains('active')) {
    // Scrolling up
    navbar.classList.remove('scroll-up');
    navbar.classList.add('scroll-down');
  }
  
  lastScroll = currentScroll;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Account for fixed header
        behavior: 'smooth'
      });
    }
  });
});

// Add animation to elements when they come into view
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementTop < windowHeight - 100) {
      element.classList.add('animated');
    }
  });
};

// Animation on scroll function
function animateOnScroll() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (elementPosition < screenPosition) {
      element.classList.add('animated');
    }
  });
}
