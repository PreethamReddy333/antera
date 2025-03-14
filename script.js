document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const viewCartButton = document.getElementById('viewCart');
    const cartDropdown = document.getElementById('cartDropdown');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const dishCards = document.querySelectorAll('.dish-card');
    const addButton = document.querySelector('.add-button');
    const cartCount = document.getElementById('cartCount');
    
    // Select all cart count elements across pages
    const cartCountElements = document.querySelectorAll('.cart-count');
  
    // Initialize cart from localStorage or create empty cart
    let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];
  
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            dishCards.forEach(card => {
                const dishName = card.querySelector('h2').textContent.toLowerCase();
                if (dishName.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
  
    // View Cart functionality
    if (viewCartButton) {
        viewCartButton.addEventListener('click', function() {
            cartDropdown.style.display = cartDropdown.style.display === 'none' ? 'block' : 'none';
            updateCartDisplay();
        });
    }
  
    // Add to Cart functionality for menu pages
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent dish card click when clicking button
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            addToCart(name, price, this);
        });
    });

    // Add to Cart functionality for detail pages
    if (addButton) {
        // Get the name from data-name attribute if available, otherwise from title
        const name = addButton.getAttribute('data-name') || document.querySelector('.title').textContent;
        const priceText = addButton.getAttribute('data-price') || document.querySelector('.price').textContent;
        const price = parseFloat(priceText);
        
        // Update button text initially based on cart
        updateDetailPageButton(addButton, name);
        
        addButton.addEventListener('click', function() {
            addToCart(name, price, addButton);
            
            // Show feedback if not already in cart
            const item = cart.find(item => item.name === name);
            if (item && item.quantity === 1) {
                this.textContent = "Added to Cart";
                setTimeout(() => {
                    updateDetailPageButton(this, name);
                }, 1500);
            }
        });
    }
  
    function addToCart(name, price, button) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        
        // Save to localStorage
        localStorage.setItem('restaurantCart', JSON.stringify(cart));
        
        if (button) {
            updateButtonText(button);
        }
        updateCartDisplay();
    }
  
    function updateButtonText(button) {
        const name = button.getAttribute('data-name');
        const item = cart.find(item => item.name === name);
        if (item) {
            button.textContent = `${item.quantity}x in Cart`;
            button.classList.add('in-cart');
        } else {
            button.textContent = 'Add to Cart';
            button.classList.remove('in-cart');
        }
    }
    
    // New function to update detail page button
    function updateDetailPageButton(button, name) {
        const item = cart.find(item => item.name === name);
        if (item) {
            button.textContent = `${item.quantity}x in Cart`;
            button.classList.add('in-cart');
        } else {
            button.textContent = 'Add to Cart';
            button.classList.remove('in-cart');
        }
    }
  
    function updateCartDisplay() {
        if (cartItems) {
            cartItems.innerHTML = '';
            cart.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.name} x${item.quantity}`;
                cartItems.appendChild(li);
            });
            
            if (cartTotal) {
                cartTotal.textContent = cart.reduce((total, item) => total + item.quantity, 0);
            }
        }
        
        // Update all cart count badges across the site
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElements.forEach(countElement => {
            countElement.textContent = totalItems;
            countElement.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }
  
    // Close cart dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (cartDropdown && !cartDropdown.contains(event.target) && event.target !== viewCartButton) {
            cartDropdown.style.display = 'none';
        }
    });

    // Initialize cart display on page load
    updateCartDisplay();
    
    // Update all add to cart buttons to show current state
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            updateButtonText(button);
        });
    }
});
