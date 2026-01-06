// Products Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 79.99,
        category: "Electronics",
        image: "https://via.placeholder.com/300x250/667eea/ffffff?text=Headphones",
        rating: 4.5,
        description: "Premium wireless headphones with noise cancellation"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        category: "Electronics",
        image: "https://via.placeholder.com/300x250/764ba2/ffffff?text=Smart+Watch",
        rating: 4.8,
        description: "Advanced smartwatch with fitness tracking"
    },
    {
        id: 3,
        name: "Laptop Backpack",
        price: 49.99,
        category: "Accessories",
        image: "https://via.placeholder.com/300x250/f093fb/ffffff?text=Backpack",
        rating: 4.3,
        description: "Durable laptop backpack with multiple compartments"
    },
    {
        id: 4,
        name: "USB-C Hub",
        price: 34.99,
        category: "Electronics",
        image: "https://via.placeholder.com/300x250/4facfe/ffffff?text=USB+Hub",
        rating: 4.6,
        description: "Multi-port USB-C hub for all your devices"
    },
    {
        id: 5,
        name: "Mechanical Keyboard",
        price: 89.99,
        category: "Electronics",
        image: "https://via.placeholder.com/300x250/00f2fe/ffffff?text=Keyboard",
        rating: 4.7,
        description: "RGB mechanical keyboard with custom switches"
    },
    {
        id: 6,
        name: "Wireless Mouse",
        price: 29.99,
        category: "Electronics",
        image: "https://via.placeholder.com/300x250/43e97b/ffffff?text=Mouse",
        rating: 4.4,
        description: "Ergonomic wireless mouse with precision tracking"
    },
    {
        id: 7,
        name: "Portable Charger",
        price: 39.99,
        category: "Accessories",
        image: "https://via.placeholder.com/300x250/fa709a/ffffff?text=Charger",
        rating: 4.5,
        description: "20000mAh portable power bank"
    },
    {
        id: 8,
        name: "Phone Stand",
        price: 19.99,
        category: "Accessories",
        image: "https://via.placeholder.com/300x250/fee140/ffffff?text=Stand",
        rating: 4.2,
        description: "Adjustable phone and tablet stand"
    },
    {
        id: 9,
        name: "Bluetooth Speaker",
        price: 59.99,
        category: "Electronics",
        image: "https://via.placeholder.com/300x250/30cfd0/ffffff?text=Speaker",
        rating: 4.6,
        description: "Waterproof Bluetooth speaker with 360° sound"
    }
];

// Cart Management
let cart = [];

// Initialize cart from storage
function initCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartCount();
}

// Save cart to storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count badge
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const badges = document.querySelectorAll('#cartCount');
    badges.forEach(badge => {
        badge.textContent = cartCount;
    });
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification('Product added to cart!', 'success');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    if (typeof loadCartItems === 'function') {
        loadCartItems();
    }
    showNotification('Product removed from cart', 'info');
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        if (typeof loadCartItems === 'function') {
            loadCartItems();
        }
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '9999';
    notification.style.minWidth = '250px';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Load products on home page
function loadProducts() {
    const container = document.getElementById('productContainer');
    if (!container) return;

    container.innerHTML = '';
    
    products.forEach(product => {
        const stars = generateStars(product.rating);
        const productCard = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card product-card">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <div class="product-rating mb-2">
                            ${stars} <span class="text-muted">(${product.rating})</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="product-price">$${product.price.toFixed(2)}</span>
                            <button class="btn btn-primary" onclick="addToCart(${product.id})">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });
}

// Generate star rating HTML
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

// Load cart items on order page
function loadCartItems() {
    const container = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!container) return;

    if (cart.length === 0) {
        container.style.display = 'none';
        emptyCart.style.display = 'block';
        checkoutBtn.disabled = true;
        return;
    }

    container.style.display = 'block';
    emptyCart.style.display = 'none';
    checkoutBtn.disabled = false;
    container.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        const cartItemHTML = `
            <div class="cart-item">
                <div class="row align-items-center">
                    <div class="col-md-2 mb-3 mb-md-0">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    </div>
                    <div class="col-md-4 mb-3 mb-md-0">
                        <h5>${item.name}</h5>
                        <p class="text-muted mb-0">${item.description}</p>
                    </div>
                    <div class="col-md-2 mb-3 mb-md-0">
                        <strong>$${item.price.toFixed(2)}</strong>
                    </div>
                    <div class="col-md-2 mb-3 mb-md-0">
                        <div class="quantity-controls">
                            <button class="btn btn-sm btn-outline-primary" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="form-control form-control-sm" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, parseInt(this.value))">
                            <button class="btn btn-sm btn-outline-primary" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2 text-md-end">
                        <strong class="text-primary">$${itemTotal}</strong>
                        <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cartItemHTML;
    });

    updateOrderSummary();
}

// Update order summary
function updateOrderSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Handle contact form submission
function handleContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Simulate form submission
        const messageDiv = document.getElementById('formMessage');
        messageDiv.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i> Thank you for contacting us! We'll get back to you within 24 hours.
            </div>
        `;
        
        form.reset();
        
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 5000);
    });
}

// Handle newsletter subscription
function handleNewsletterForm() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            form.reset();
        });
    });
}

// Handle promo code
function handlePromoCode() {
    const applyBtn = document.getElementById('applyPromo');
    if (!applyBtn) return;

    applyBtn.addEventListener('click', function() {
        const promoCode = document.getElementById('promoCode').value.toUpperCase();
        
        if (promoCode === 'SAVE10') {
            showNotification('Promo code applied! 10% discount added.', 'success');
            // In a real app, you would apply the discount here
        } else if (promoCode === '') {
            showNotification('Please enter a promo code', 'warning');
        } else {
            showNotification('Invalid promo code', 'danger');
        }
    });
}

// Handle checkout
function handleCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
            modal.show();
        });
    }

    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            const checkoutForm = document.getElementById('checkoutForm');
            if (checkoutForm.checkValidity()) {
                // Generate order number
                const orderNumber = 'ORD' + Math.floor(Math.random() * 1000000);
                document.getElementById('orderNumber').textContent = orderNumber;
                
                // Hide checkout modal
                const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
                checkoutModal.hide();
                
                // Show success modal
                const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                successModal.show();
                
                // Clear cart
                cart = [];
                saveCart();
                
                // Redirect after success
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            } else {
                checkoutForm.reportValidity();
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    loadProducts();
    loadCartItems();
    handleContactForm();
    handleNewsletterForm();
    handlePromoCode();
    handleCheckout();
    
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});