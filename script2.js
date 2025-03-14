document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart from localStorage or create empty cart
  let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const cartItems = document.getElementById('cartItems');
  const addDrinkButtons = document.querySelectorAll('.add-drink-btn');
  const sections = document.querySelectorAll('.menu-section');
  
  // Section toggle functionality
  sections.forEach(section => {
    const header = section.querySelector('.section-header');
    const content = section.querySelector('.section-content');
    
    // Set initial state - default all to closed
    content.style.display = 'none';
    
    header.addEventListener('click', function(e) {
      // Toggle section active state
      section.classList.toggle('active');
      
      // Toggle content visibility
      if (section.classList.contains('active')) {
        content.style.display = 'block';
        content.style.maxHeight = 'none'; // Remove max-height restriction
      } else {
        content.style.display = 'none';
      }
    });
  });
  
  // Add to cart functionality
  addDrinkButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Always stop propagation to prevent header click
      e.stopPropagation();
      
      const name = this.getAttribute('data-name');
      const price = parseFloat(this.getAttribute('data-price'));
      
      // Add item to cart
      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
        showToast(`Added another ${name}`);
      } else {
        cart.push({ name, price, quantity: 1 });
        showToast(`Added ${name} to cart`);
      }
      
      // Save to localStorage
      localStorage.setItem('restaurantCart', JSON.stringify(cart));
      
      // Update cart count
      updateCartDisplay();
    });
  });
  
  // Display a toast notification
  function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      document.body.appendChild(toast);
      
      // Add toast styles
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.backgroundColor = '#4b572e';
      toast.style.color = 'white';
      toast.style.padding = '10px 20px';
      toast.style.borderRadius = '5px';
      toast.style.zIndex = '1000';
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.style.opacity = '1';
    
    // Hide toast after 2 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
    }, 2000);
  }
  
  // Update cart display
  function updateCartDisplay() {
    // Update cart count and total
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) {
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    if (cartTotal) {
      cartTotal.textContent = totalItems;
    }
    
    // Update cart items list
    if (cartItems) {
      cartItems.innerHTML = '';
      cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} x${item.quantity}`;
        cartItems.appendChild(li);
      });
    }
  }
  
  // Initialize cart display on page load
  updateCartDisplay();
  
  // Open the first section by default
  if (sections.length > 0) {
    sections[0].classList.add('active');
    const content = sections[0].querySelector('.section-content');
    content.style.display = 'block';
    content.style.maxHeight = 'none';
  }
});
