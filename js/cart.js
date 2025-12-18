/* ========================================
   CART PAGE JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    loadWishlist();
});

/**
 * Load and display wishlist items
 */
function loadWishlist() {
    try {
        const wishlistData = localStorage.getItem('techhub-wishlist');
        const wishlist = wishlistData ? JSON.parse(wishlistData) : [];
        
        if (wishlist.length === 0) {
            document.getElementById('wishlistEmpty').style.display = 'block';
            document.getElementById('wishlistItems').innerHTML = '';
            return;
        }
        
        // Fetch products and filter for wishlist items
        fetch('data/products.json')
            .then(res => res.json())
            .then(products => {
                const wishlistProducts = products.filter(p => wishlist.includes(p.id));
                
                let html = '';
                wishlistProducts.forEach(product => {
                    const stars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
                    html += `
                        <div style="border: 1px solid var(--border-color); border-radius: 6px; padding: 8px; text-align: center; background: white; font-size: 0.8rem;">
                            <img src="${product.image}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 4px; margin-bottom: 5px;" onerror="this.src='https://placehold.co/120x80?text=No+Image'">
                            <div style="font-weight: 600; font-size: 0.75rem; margin-bottom: 3px; line-height: 1.2;">${product.name.substring(0, 20)}</div>
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
        let cart = [];
        const stored = localStorage.getItem('techhubCart');
        if (stored) {
            cart = JSON.parse(stored);
        }
        
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity += 1;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }
        
        localStorage.setItem('techhubCart', JSON.stringify(cart));
        alert('Added to cart!');
        loadCartItems();
    } catch (e) {
        console.error('Error adding to cart:', e);
    }
}

/**
 * Remove product from wishlist (from cart page)
 */
function removeFromWishlistCart(productId) {
    try {
        let wishlist = [];
        const stored = localStorage.getItem('techhub-wishlist');
        if (stored) {
            wishlist = JSON.parse(stored);
        }
        
        wishlist = wishlist.filter(id => id !== productId);
        localStorage.setItem('techhub-wishlist', JSON.stringify(wishlist));
        loadWishlist();
    } catch (e) {
        console.error('Error removing from wishlist:', e);
    }
}
