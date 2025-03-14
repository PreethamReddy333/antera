document.addEventListener('DOMContentLoaded', function() {
  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];
  const cartList = document.getElementById('cart-list');
  const totalElement = document.getElementById('total');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Map for item images - add images for known items
  const itemImages = {
    "Crispy Royale Platter": "https://c.animaapp.com/dQoMBRt2/img/image-13@2x.png",
    "Grand Royale Burger": "https://c.animaapp.com/C4dgo1ug/img/image-13@2x.png",
    "Peperoni Pizza": "https://c.animaapp.com/C4dgo1ug/img/image-14@2x.png",
    "Chicken Biryani": "https://c.animaapp.com/C4dgo1ug/img/image-18@2x.png",
    "Thotakura Liver Fry": "https://c.animaapp.com/dQoMBRt2/img/image-12@2x.png",
    "Mokka Jonna Fry": "https://c.animaapp.com/dQoMBRt2/img/image-13@2x.png",
    "Creme Caramel Pudding": "https://c.animaapp.com/mHDFZhiy/img/image-17@2x.png",
    "Tres' Leches": "https://c.animaapp.com/mHDFZhiy/img/image-16@2x.png",
    "Tiramisu": "https://c.animaapp.com/mHDFZhiy/img/image-15@2x.png"
  };

  // Get default image or placeholder
  function getItemImage(itemName) {
    return itemImages[itemName] || "https://via.placeholder.com/80";
  }

  // Display cart items or empty cart message
  function displayCart() {
    if (cart.length === 0) {
      cartList.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Your cart is empty</p>
        </div>
      `;
    } else {
      cartList.innerHTML = '';
      
      cart.forEach((item, index) => {
        const itemImage = getItemImage(item.name);
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
          <img src="${itemImage}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            <p class="cart-item-price">₹${item.price}</p>
            <div class="cart-item-quantity">
              <button class="quantity-btn minus" data-index="${index}">-</button>
              <span class="quantity-value">${item.quantity}</span>
              <button class="quantity-btn plus" data-index="${index}">+</button>
            </div>
          </div>
          <button class="remove-btn" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        `;
        cartList.appendChild(itemElement);
      });
    }

    // Add event listeners to quantity buttons
    const plusButtons = document.querySelectorAll('.plus');
    const minusButtons = document.querySelectorAll('.minus');
    const removeButtons = document.querySelectorAll('.remove-btn');
    
    plusButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        cart[index].quantity += 1;
        saveCartAndRefresh();
      });
    });
    
    minusButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
          saveCartAndRefresh();
        }
      });
    });
    
    removeButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        cart.splice(index, 1);
        saveCartAndRefresh();
      });
    });
  }

  // Save cart to localStorage and refresh the display
  function saveCartAndRefresh() {
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
    displayCart();
  }

  // Handle checkout
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      if (cart.length > 0) {
        alert('Thank you for your order! Your food will be ready shortly.');
        // Clear cart after order
        localStorage.removeItem('restaurantCart');
        location.href = 'index1.html'; // Redirect to main page
      } else {
        alert('Your cart is empty. Add some items before checking out.');
      }
    });
  }

  // Initialize cart display
  displayCart();
});
