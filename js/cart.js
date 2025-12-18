/* ========================================
   CART PAGE JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
    loadWishlist();
});

/**
 * Load and display wishlist items
 */
function loadWishlist() {
    try {
        const wishlistData = localStorage.getItem('techhub-wishlist');
        const wishlist = wishlistData ? JSON.parse(wishlistData) : [];
        
        console.log('Wishlist from localStorage:', wishlist);
        
        if (wishlist.length === 0) {
            document.getElementById('wishlistEmpty').style.display = 'block';
            document.getElementById('wishlistItems').innerHTML = '';
            return;
        }
        
        // Fetch products and filter for wishlist items
        fetch('data/products.json')
            .then(res => res.json())
            .then(products => {
                console.log('Products loaded:', products.length);
                console.log('Wishlist IDs:', wishlist);
                
                // Ensure wishlist IDs are numbers for comparison
                const wishlistIds = wishlist.map(id => Number(id));
                const wishlistProducts = products.filter(p => wishlistIds.includes(Number(p.id)));
                
                console.log('Wishlist products found:', wishlistProducts.length);
                
                if (wishlistProducts.length === 0) {
                    document.getElementById('wishlistEmpty').style.display = 'block';
                    document.getElementById('wishlistItems').innerHTML = '';
                    return;
                }
                
                let html = '';
                wishlistProducts.forEach(product => {
                    const stars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
                    html += `
                        <div style="border: 1px solid var(--border-color); border-radius: 6px; padding: 8px; text-align: center; background: white; font-size: 0.8rem;">
                            <img src="${product.image}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 4px; margin-bottom: 5px;" onerror="this.src='https://placehold.co/120x80?text=No+Image'">
                            <div class="wishlist-product-title" style="font-weight: 600; font-size: 0.75rem; margin-bottom: 3px; line-height: 1.2;">${product.name.substring(0, 20)}</div>
                            <div style="color: var(--primary-color); font-weight: bold; margin-bottom: 5px; font-size: 0.85rem;">$${product.price}</div>
                            <div style="display: flex; gap: 4px;">
                                <button onclick="addWishlistToCart(${product.id})" class="btn btn-primary" style="flex: 1; padding: 4px; font-size: 0.7rem;">Add</button>
                                <button onclick="removeFromWishlistCart(${product.id})" class="btn btn-danger" style="flex: 1; padding: 4px; font-size: 0.7rem;">✕</button>
                            </div>
                        </div>
                    `;
                });
                
                document.getElementById('wishlistEmpty').style.display = 'none';
                document.getElementById('wishlistItems').innerHTML = html;
            })
            .catch(err => console.error('Error loading wishlist:', err));
    } catch (e) {
        console.error('Error in loadWishlist:', e);
    }
}

/**
 * Add product from wishlist to cart
 */
function addWishlistToCart(productId) {
    try {
        // Fetch the product details
        fetch('data/products.json')
            .then(res => res.json())
            .then(allProducts => {
                const product = allProducts.find(p => p.id === productId);
                if (!product) {
                    console.error('Product not found:', productId);
                    return;
                }
                
                // Get cart from cookies
                let cart = getCart();
                
                // Check if product already exists
                const existingItem = cart.find(item => item.name === product.name);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        id: Date.now()
                    });
                }
                
                // Save cart to cookies (this calls updateCartCount automatically)
                saveCart(cart);
                console.log('Cart updated:', cart);
                
                // Reload cart items display
                displayCartItems();
                updateCartSummary();
                loadWishlist();
            })
            .catch(err => console.error('Error adding wishlist item to cart:', err));
    } catch (e) {
        console.error('Error adding to cart:', e);
    }
}

/**
 * Display cart items from cookies
 */
function displayCartItems() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) {
        console.error('cartItems container not found');
        return;
    }
    
    let cart = getCart();
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="products.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    // Load products to get images
    fetch('data/products.json')
        .then(res => res.json())
        .then(products => {
            let html = '';
            cart.forEach(item => {
                const product = products.find(p => p.name === item.name);
                const imageUrl = product ? product.image : 'https://via.placeholder.com/100?text=Product';
                
                html += `
                    <div class="cart-item">
                        <img src="${imageUrl}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/100?text=Product';">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p class="cart-item-price">$${parseFloat(item.price).toFixed(2)}</p>
                        </div>
                        <div class="quantity-control">
                            <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                            <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, parseInt(this.value))">
                            <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <div style="text-align: right;">
                            <p style="font-weight: 600; margin-bottom: 8px;">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                        </div>
                    </div>
                `;
            });
            
            cartContainer.innerHTML = html;
        })
        .catch(err => console.error('Error loading products:', err));
}

/**
 * Remove product from wishlist (from cart page)
 */
function removeFromWishlistCart(productId) {
    try {
        productId = Number(productId);
        let wishlist = [];
        const stored = localStorage.getItem('techhub-wishlist');
        if (stored) {
            wishlist = JSON.parse(stored);
        }
        
        wishlist = wishlist.filter(id => Number(id) !== productId);
        localStorage.setItem('techhub-wishlist', JSON.stringify(wishlist));
        loadWishlist();
    } catch (e) {
        console.error('Error removing from wishlist:', e);
    }
}

/**
 * Override removeFromCart to use displayCartItems
 */
const originalRemoveFromCart = removeFromCart;
removeFromCart = function(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
    displayCartItems();
    updateCartSummary();
};

/**
 * Override updateQuantity to use displayCartItems
 */
const originalUpdateQuantity = updateQuantity;
updateQuantity = function(itemId, quantity) {
    if (quantity < 1) {
        removeFromCart(itemId);
        return;
    }
    
    let cart = getCart();
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity = quantity;
        saveCart(cart);
    }
    
    displayCartItems();
    updateCartSummary();
};
