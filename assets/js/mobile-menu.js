document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;
  
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);
  
  // Toggle menu function
  function toggleMenu() {
    const isOpen = navLinks.classList.contains('active');
    
    if (isOpen) {
      // Close menu
      navLinks.classList.remove('active');
      menuBtn.classList.remove('active');
      overlay.classList.remove('active');
      body.classList.remove('menu-open');
      
      // Reset body scroll position
      body.style.overflow = '';
      body.style.position = '';
      body.style.top = '';
      window.scrollTo(0, parseInt(body.style.top || '0') * -1);
    } else {
      // Open menu
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.top = `-${window.scrollY}px`;
      
      navLinks.classList.add('active');
      menuBtn.classList.add('active');
      overlay.classList.add('active');
      body.classList.add('menu-open');
    }
  }
  
  // Toggle menu on button click
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on overlay
    overlay.addEventListener('click', function() {
      if (navLinks.classList.contains('active')) {
        toggleMenu();
      }
    });
    
    // Close menu when clicking on a nav link
    const navLinksItems = navLinks.querySelectorAll('a');
    navLinksItems.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          toggleMenu();
        }
      });
    });
  }
  
  // Close menu when window is resized to desktop view
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
        toggleMenu();
      }
    }, 250);
  });
});
