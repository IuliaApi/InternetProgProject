// ========================================
// API SIMULATION WITH AJAX
// ========================================

// Cache for loaded data
let dataCache = {
    products: null,
    categories: null,
    reviews: null,
    loading: {}
};

// AJAX loader function
function loadJSONFile(filePath) {
    return new Promise((resolve, reject) => {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => resolve(data))
            .catch(error => {
                console.error('Error loading file:', filePath, error);
                reject(error);
            });
    });
}

// Load products via AJAX
async function loadProducts() {
    if (dataCache.products) {
        return dataCache.products;
    }
    
    try {
        dataCache.products = await loadJSONFile('data/products.json');
        return dataCache.products;
    } catch (error) {
        console.error('Failed to load products:', error);
        return [];
    }
}

// Load categories via AJAX
async function loadCategories() {
    if (dataCache.categories) {
        return dataCache.categories;
    }
    
    try {
        dataCache.categories = await loadJSONFile('data/categories.json');
        return dataCache.categories;
    } catch (error) {
        console.error('Failed to load categories:', error);
        return [];
    }
}

// Load reviews via AJAX
async function loadReviews() {
    if (dataCache.reviews) {
        return dataCache.reviews;
    }
    
    try {
        dataCache.reviews = await loadJSONFile('data/reviews.json');
        return dataCache.reviews;
    } catch (error) {
        console.error('Failed to load reviews:', error);
        return [];
    }
}

// Show skeleton loading screen
function showSkeletonLoading(container, type = 'product', count = 6) {
    if (!container) return;
    
    let skeletonHTML = '';
    
    if (type === 'product') {
        for (let i = 0; i < count; i++) {
            skeletonHTML += `
                <div class="skeleton-card">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-content">
                        <div class="skeleton-title" style="width: 90%;"></div>
                        <div class="skeleton-text" style="width: 70%;"></div>
                        <div class="skeleton-text" style="width: 60%;"></div>
                        <div class="skeleton-button"></div>
                    </div>
                </div>
            `;
        }
        container.innerHTML = `<div class="skeleton-products-grid">${skeletonHTML}</div>`;
    } else if (type === 'category') {
        for (let i = 0; i < count; i++) {
            skeletonHTML += `
                <div class="skeleton-category-card">
                    <div class="skeleton-icon"></div>
                    <div class="skeleton-title" style="width: 80%; margin: 0 auto 10px;"></div>
                    <div class="skeleton-text" style="width: 70%; margin: 0 auto;"></div>
                </div>
            `;
        }
        container.innerHTML = `<div class="skeleton-categories-grid">${skeletonHTML}</div>`;
    }
}

// Hide skeleton loading screen
function hideSkeletonLoading(container) {
    if (container && container.querySelector('.skeleton-card, .skeleton-category-card')) {
        container.innerHTML = '';
    }
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================

// Store search query
let currentSearchQuery = '';

function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById('searchInput').value.trim();
    
    if (query.length === 0) {
        showNotification('Please enter a search term', 'error');
        return;
    }
    
    // Store search query and redirect
    sessionStorage.setItem('searchQuery', query);
    window.location.href = 'products.html?search=' + encodeURIComponent(query);
}

function performSearch(query) {
    if (!query || query.length === 0) return;
    
    // This will be handled in products.js
    currentSearchQuery = query;
}

function showSearchSuggestions(query) {
    if (query.length < 2) {
        document.getElementById('searchSuggestions').style.display = 'none';
        return;
    }
    
    // Get products from products.js (if available) or use sample data
    const sampleProducts = [
        { name: 'Wireless Headphones', category: 'Audio' },
        { name: 'Smart Watch Pro', category: 'Wearables' },
        { name: '4K Webcam Ultra', category: 'Video' },
        { name: 'Portable Charger 50K', category: 'Accessories' },
        { name: 'USB-C Hub Pro', category: 'Accessories' },
        { name: 'Mechanical Keyboard', category: 'Computing' },
        { name: 'Wireless Mouse', category: 'Computing' },
        { name: 'Monitor Light Bar', category: 'Video' },
        { name: 'Bluetooth Speaker', category: 'Audio' },
        { name: 'Fitness Tracker', category: 'Wearables' }
    ];
    
    const suggestions = sampleProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (suggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    let html = '';
    suggestions.forEach(product => {
        html += `
            <div class="suggestion-item" onclick="selectSuggestion('${product.name}')">
                <div class="suggestion-item-name">${product.name}</div>
                <div class="suggestion-item-category">${product.category}</div>
            </div>
        `;
    });
    
    suggestionsContainer.innerHTML = html;
    suggestionsContainer.style.display = 'block';
}

function selectSuggestion(productName) {
    document.getElementById('searchInput').value = productName;
    document.getElementById('searchSuggestions').style.display = 'none';
    handleSearch(new Event('submit'));
}

// Add search input listener
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            showSearchSuggestions(e.target.value);
        });
        
        // Close suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-bar')) {
                document.getElementById('searchSuggestions').style.display = 'none';
            }
        });
    }

    // Auto-rotate carousel on homepage
    if (document.querySelector('.carousel-item')) {
        startCarouselAutoRotate();
    }
});

// ========================================
// CAROUSEL FUNCTIONALITY
// ========================================

let currentCarouselIndex = 0;
let carouselAutoRotateTimer = null;

function showCarouselSlide(index) {
    const items = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    
    if (items.length === 0) return;
    
    // Wrap around
    if (index >= items.length) {
        currentCarouselIndex = 0;
    } else if (index < 0) {
        currentCarouselIndex = items.length - 1;
    } else {
        currentCarouselIndex = index;
    }
    
    // Remove active class from all items and dots
    items.forEach(item => item.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current item and dot
    items[currentCarouselIndex].classList.add('active');
    if (dots[currentCarouselIndex]) {
        dots[currentCarouselIndex].classList.add('active');
    }
    
    // Reset auto-rotate timer
    resetCarouselAutoRotate();
}

function nextSlide() {
    showCarouselSlide(currentCarouselIndex + 1);
}

function previousSlide() {
    showCarouselSlide(currentCarouselIndex - 1);
}

function currentSlide(index) {
    showCarouselSlide(index);
}

function startCarouselAutoRotate() {
    // Auto-rotate every 6 seconds
    carouselAutoRotateTimer = setInterval(() => {
        nextSlide();
    }, 6000);
}

function resetCarouselAutoRotate() {
    clearInterval(carouselAutoRotateTimer);
    startCarouselAutoRotate();
}

// ========================================
// CATEGORY NAVIGATION
// ========================================

function navigateToCategory(category) {
    // Navigate to products page filtered by category
    window.location.href = 'products.html?category=' + encodeURIComponent(category);
}

// ========================================
// CART MANAGEMENT
// ========================================

// Get cart from cookies or initialize empty
function getCart() {
    const cart = getCookie('techhubCart');
    return cart ? JSON.parse(decodeURIComponent(cart)) : [];
}

// Save cart to cookies (7 day expiration)
function saveCart(cart) {
    setCookie('techhubCart', encodeURIComponent(JSON.stringify(cart)), 7);
    updateCartCount();
}

// Add item to cart (stored in cookies)
function addToCart(productName, price) {
    let cart = getCart();
    
    // Check if product already exists
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1,
            id: Date.now()
        });
    }
    
    saveCart(cart);
    showNotification(`${productName} added to cart!`);
}

// Remove item from cart
function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
    loadCartItems();
}

// Update item quantity
function updateQuantity(itemId, quantity) {
    let cart = getCart();
    const item = cart.find(item => item.id === itemId);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
            loadCartItems();
        }
    }
}

// Update cart count in navigation
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(el => el.textContent = count);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ========================================
// NAVIGATION
// ========================================

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            hamburger.classList.toggle('active');
        });
    }
    
    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) navMenu.style.display = 'none';
            if (hamburger) hamburger.classList.remove('active');
        });
    });
    
    // Update cart count on page load
    updateCartCount();
});

// ========================================
// LOAD CART ITEMS PAGE
// ========================================

function loadCartItems() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="products.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        updateCartSummary();
        return;
    }
    
    let html = '';
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <img src="https://via.placeholder.com/100?text=${encodeURIComponent(item.name)}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="quantity-control">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, parseInt(this.value))">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: 600; margin-bottom: 8px;">$${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
    });
    
    cartContainer.innerHTML = html;
    updateCartSummary();
}

// ========================================
// CART SUMMARY
// ========================================

function updateCartSummary() {
    const cart = getCart();
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    
    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    }
    if (document.getElementById('shipping')) {
        document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    }
    if (document.getElementById('tax')) {
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    }
    if (document.getElementById('total')) {
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }
}

// ========================================
// NEWSLETTER
// ========================================

function handleNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    showNotification(`Thank you for subscribing with ${email}!`);
    event.target.reset();
}

// ========================================
// CONTACT FORM
// ========================================

function handleContactForm(event) {
    event.preventDefault();
    showNotification('Thank you for your message! We will contact you soon.');
    event.target.reset();
}

// ========================================
// PROMO CODE
// ========================================

function applyPromo() {
    const promoCode = document.getElementById('promoCode').value.trim().toUpperCase();
    
    // Sample promo codes
    const promoCodes = {
        'SAVE10': 0.10,
        'SAVE20': 0.20,
        'WELCOME': 0.15
    };
    
    if (promoCodes[promoCode]) {
        const cart = getCart();
        let subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discount = subtotal * promoCodes[promoCode];
        
        showNotification(`Promo code applied! You saved $${discount.toFixed(2)}`);
        document.getElementById('promoCode').value = '';
    } else {
        showNotification('Invalid promo code');
    }
}

// ========================================
// CHECKOUT
// ========================================

function proceedCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    window.location.href = 'checkout.html';
}

// ========================================
// FORM VALIDATION
// ========================================

function submitOrder(event) {
    event.preventDefault();
    
    // Basic validation
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate required text fields beyond HTML5 constraints
    const firstName = (formData.get('firstName') || '').trim();
    const lastName = (formData.get('lastName') || '').trim();
    const address = (formData.get('address') || '').trim();
    const city = (formData.get('city') || '').trim();
    const state = (formData.get('state') || '').trim();
    const zip = (formData.get('zip') || '').trim();
    
    if (!firstName || !lastName || !address || !city || !state || !zip) {
        showNotification('Please complete all address fields.');
        return;
    }
    
    // Validate email format (simple regex)
    const email = (formData.get('email') || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.');
        return;
    }
    
    // Validate phone number (digits, 10-15 length)
    const phoneRaw = (formData.get('phone') || '').trim();
    const phoneDigits = phoneRaw.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        showNotification('Please enter a valid phone number.');
        return;
    }
    
    // Validate card number (simple check)
    const cardNumber = formData.get('cardNumber').replace(/\s/g, '');
    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
        showNotification('Invalid card number');
        return;
    }
    
    // Validate expiry date
    const expiry = formData.get('expiry');
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        showNotification('Invalid expiry date (use MM/YY)');
        return;
    }
    
    // Validate CVV
    const cvv = formData.get('cvv');
    if (!/^\d{3,4}$/.test(cvv)) {
        showNotification('Invalid CVV');
        return;
    }
    
    // Validate terms acceptance
    const termsAccepted = form.querySelector('input[name="terms"]')?.checked;
    if (!termsAccepted) {
        showNotification('Please accept the terms and conditions.');
        return;
    }
    
    // Prepare order summary data to persist for confirmation page
    const cart = getCart();
    let subtotal = 0;
    cart.forEach(item => { subtotal += item.price * item.quantity; });
    const methodRadio = form.querySelector('input[name="shipping"]:checked');
    const shippingMethod = methodRadio ? methodRadio.value : 'standard';
    let shippingCost = 0;
    if (shippingMethod === 'express') shippingCost = 15;
    else if (shippingMethod === 'overnight') shippingCost = 30;
    else shippingCost = 0;
    const tax = subtotal * 0.1;
    const total = subtotal + shippingCost + tax;
    const orderData = {
        items: cart,
        subtotal,
        shippingCost,
        tax,
        total,
        shippingMethod,
        orderDateISO: new Date().toISOString()
    };
    try { sessionStorage.setItem('techhubLastOrder', JSON.stringify(orderData)); } catch (e) {}
    
    // If all valid, show success
    showNotification('Order placed successfully! Thank you for your purchase.');
    
    // Clear cart (stored in cookies)
    deleteCookie('techhubCart');
    updateCartCount();
    
    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = 'order-confirmation.html';
    }, 2000);
}

// ========================================
// PAGE INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Load cart items if on cart page
    if (document.getElementById('cartItems')) {
        loadCartItems();
    }
    
    // Initialize checkout summary if on checkout page
    if (document.getElementById('checkoutSummary')) {
        initCheckoutSummary();
    }
    
    // Initialize product page if on products page
    if (document.getElementById('productsContainer')) {
        initProductsPage();
    }
});

// ========================================
// PRODUCT PAGE INITIALIZATION
// ========================================

function initProductsPage() {
    const priceRange = document.querySelector('.price-range');
    const priceValue = document.getElementById('priceValue');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            priceValue.textContent = this.value;
            filterProducts();
        });
    }
    
    displayProducts();
}

// ========================================
// CHECKOUT SUMMARY
// ========================================

function initCheckoutSummary() {
    const cart = getCart();
    let subtotal = 0;
    let html = '<div class="cart-items" style="max-height: 300px; overflow-y: auto; margin-bottom: 20px;">';
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        html += `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #dee2e6;">
                <span>${item.name} x${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Determine shipping cost from selected method on checkout page
    let shipping = 0;
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    if (selectedShipping) {
        const method = selectedShipping.value;
        if (method === 'express') shipping = 15;
        else if (method === 'overnight') shipping = 30;
        else shipping = 0; // standard
    }
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    
    html += `
        <div class="summary-item">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Shipping:</span>
            <span>$${shipping.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Tax:</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <hr>
        <div class="summary-item total">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
    
    document.getElementById('checkoutSummary').innerHTML = html;
    
    // Populate order review
    const reviewHtml = `
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; max-height: 200px; overflow-y: auto;">
            ${cart.map(item => `
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #dee2e6;">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    const reviewContainer = document.getElementById('orderReview');
    if (reviewContainer) {
        reviewContainer.innerHTML = reviewHtml;
    }
}

// ========================================
// ANIMATIONS
// ========================================

// Add fade-out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);
