/* ========================================
   CART MANAGER MODULE
   Handles all cart operations and persistence
   ======================================== */

const CartManager = (() => {
    // Private methods
    const getCart = () => {
        const cart = getCookie('techhubCart');
        return cart ? JSON.parse(decodeURIComponent(cart)) : [];
    };

    const saveCart = (cart) => {
        setCookie('techhubCart', encodeURIComponent(JSON.stringify(cart)), 7);
        updateCartCount();
    };

    // Public API
    return {
        // Get all cart items
        getItems: () => getCart(),

        // Add item to cart
        addItem: (productName, price) => {
            let cart = getCart();
            
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
            return true;
        },

        // Remove item from cart
        removeItem: (itemId) => {
            let cart = getCart();
            cart = cart.filter(item => item.id !== itemId);
            saveCart(cart);
        },

        // Update item quantity
        updateQuantity: (itemId, quantity) => {
            let cart = getCart();
            const item = cart.find(item => item.id === itemId);
            
            if (item) {
                if (quantity <= 0) {
                    CartManager.removeItem(itemId);
                } else {
                    item.quantity = quantity;
                    saveCart(cart);
                }
                return true;
            }
            return false;
        },

        // Clear entire cart
        clear: () => {
            deleteCookie('techhubCart');
            updateCartCount();
        },

        // Get cart totals
        getTotals: () => {
            const cart = getCart();
            let subtotal = 0;
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
            });
            return {
                subtotal: subtotal,
                itemCount: cart.reduce((total, item) => total + item.quantity, 0),
                items: cart.length
            };
        },

        // Get total items count
        getItemCount: () => {
            const cart = getCart();
            return cart.reduce((total, item) => total + item.quantity, 0);
        }
    };
})();
