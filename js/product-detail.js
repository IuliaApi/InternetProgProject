/* ========================================
   PRODUCT DETAIL PAGE JAVASCRIPT
   ======================================== */

// Sample product details database
const productDetails = {
    1: {
        id: 1,
        name: 'Wireless Headphones',
        category: 'audio',
        price: 149.99,
        originalPrice: 199.99,
        rating: 5,
        reviews: 124,
        sku: 'WH-PRO-001',
        stock: 25,
        image: 'https://via.placeholder.com/400x400?text=Wireless+Headphones',
        description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals alike.',
        features: [
            'Active Noise Cancellation (ANC)',
            '30-hour battery life',
            'Bluetooth 5.0 connectivity',
            'Premium comfort design',
            'Built-in microphone',
            'Foldable design'
        ]
    },
    2: {
        id: 2,
        name: 'Smart Watch Pro',
        category: 'wearables',
        price: 299.99,
        originalPrice: 399.99,
        rating: 4,
        reviews: 89,
        sku: 'SW-PRO-001',
        stock: 15,
        image: 'https://via.placeholder.com/400x400?text=Smart+Watch',
        description: 'Advanced smartwatch with health monitoring, fitness tracking, and seamless smartphone integration. Stay connected while tracking your wellness goals.',
        features: [
            'Heart rate monitor',
            'Sleep tracking',
            'GPS tracking',
            '7-day battery life',
            'Water resistant (50m)',
            'Multiple sport modes'
        ]
    },
    3: {
        id: 3,
        name: '4K Webcam Ultra',
        category: 'video',
        price: 199.99,
        rating: 5,
        reviews: 156,
        sku: 'WC-4K-001',
        stock: 30,
        image: 'https://via.placeholder.com/400x400?text=4K+Webcam',
        description: 'Crystal clear 4K resolution webcam with auto-focus and wide-angle lens. Ideal for streaming, video conferencing, and content creation.',
        features: [
            '4K Ultra HD resolution',
            'Auto-focus technology',
            '90-degree wide-angle lens',
            'Built-in stereo microphone',
            'USB plug-and-play',
            'Low-light correction'
        ]
    }
};

// Mock Reviews Database
const productReviews = {
    1: [
        {
            id: 1,
            author: 'John Smith',
            rating: 5,
            date: '2025-12-10',
            title: 'Excellent sound quality!',
            content: 'These headphones exceeded my expectations. The noise cancellation is incredible and the comfort is unmatched. Highly recommend!'
        },
        {
            id: 2,
            author: 'Sarah Johnson',
            rating: 5,
            date: '2025-12-08',
            title: 'Best purchase ever',
            content: 'Amazing product! The battery life is exactly as advertised. Works perfectly with all my devices. Great value for money.'
        },
        {
            id: 3,
            author: 'Mike Chen',
            rating: 4,
            date: '2025-12-05',
            title: 'Great overall',
            content: 'Very comfortable and sounds great. My only minor complaint is the charging case could be more durable.'
        },
        {
            id: 4,
            author: 'Emma Davis',
            rating: 5,
            date: '2025-12-01',
            title: 'Perfect for work',
            content: 'I use these for video calls all day. The microphone quality is crystal clear and the noise cancellation keeps me focused.'
        },
        {
            id: 5,
            author: 'Alex Wilson',
            rating: 5,
            date: '2025-11-28',
            title: 'Worth every penny',
            content: 'Premium quality at a reasonable price. Fast shipping and excellent customer service. Will definitely buy again!'
        }
    ],
    2: [
        {
            id: 1,
            author: 'Lisa Anderson',
            rating: 5,
            date: '2025-12-09',
            title: 'Great fitness tracker',
            content: 'Excellent smartwatch! Tracks my workouts accurately and the GPS is very precise. Love the design too!'
        },
        {
            id: 2,
            author: 'Tom Brown',
            rating: 4,
            date: '2025-12-06',
            title: 'Good value',
            content: 'Good smartwatch with lots of features. Battery life could be a bit longer but overall very satisfied.'
        },
        {
            id: 3,
            author: 'Rachel Green',
            rating: 4,
            date: '2025-12-03',
            title: 'Reliable device',
            content: 'Using it for 2 weeks now and loving it. Sleep tracking is very accurate. Highly recommended!'
        }
    ],
    3: [
        {
            id: 1,
            author: 'Kevin Lee',
            rating: 5,
            date: '2025-12-11',
            title: 'Fantastic for streaming',
            content: 'Crystal clear 4K quality! Perfect for my YouTube channel. Auto-focus works like a charm. Best investment ever!'
        },
        {
            id: 2,
            author: 'Nina Patel',
            rating: 5,
            date: '2025-12-07',
            title: 'Professional quality',
            content: 'Using this for video conferencing and streaming. The image quality is outstanding and setup was super easy.'
        },
        {
            id: 3,
            author: 'Chris Martinez',
            rating: 5,
            date: '2025-12-04',
            title: 'Incredible value',
            content: 'Amazing 4K webcam at this price point. The wide-angle lens is perfect and low-light performance is excellent.'
        }
    ]
};

let currentQuantity = 1;

function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id')) || 1;
}

async function loadProductDetails() {
    const productId = getProductIdFromURL();
    const catalog = await loadProducts();
    const detailed = productDetails[productId];
    const base = Array.isArray(catalog) ? catalog.find(p => p.id === productId) : null;
    let product = detailed || null;
    
    // Prefer catalog (AJAX) image and pricing for consistency; merge with detailed fields when available
    if (detailed && base) {
        product = {
            ...detailed,
            // Prefer catalog values for cross-page consistency
            image: base.image || detailed.image,
            price: typeof base.price === 'number' ? base.price : detailed.price,
            originalPrice: typeof base.originalPrice === 'number' ? base.originalPrice : detailed.originalPrice,
            rating: typeof detailed.rating === 'number' ? detailed.rating : (base.rating || 4),
            reviews: typeof detailed.reviews === 'number' ? detailed.reviews : (base.reviews || 0),
            category: detailed.category || base.category || 'misc'
        };
    }
    
    // If no detailed record, build from catalog base
    if (!product && base) {
        product = {
            id: base.id,
            name: base.name,
            category: base.category,
            price: base.price,
            originalPrice: base.originalPrice,
            rating: base.rating || 4,
            reviews: base.reviews || 0,
            sku: `${(base.category || 'item').toUpperCase()}-${String(base.id).padStart(3, '0')}`,
            stock: 20,
            image: base.image || 'https://via.placeholder.com/400x400?text=Product',
            description: 'High-quality product from TechHub. Detailed specifications coming soon.',
            features: [
                'Premium build quality',
                'Reliable performance',
                '1-year limited warranty',
                'Fast shipping'
            ]
        };
    }

    if (!product) {
        window.location.href = '404.html';
        return;
    }
    
    // Update page title
    document.title = product.name + ' - TechHub Store';
    
    // Update breadcrumb
    document.getElementById('breadcrumbProduct').textContent = product.name;
    
    // Update product name and prices
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = '$' + product.price.toFixed(2);
    
    if (product.originalPrice) {
        document.getElementById('originalPrice').style.display = 'inline';
        document.getElementById('originalPrice').textContent = '$' + product.originalPrice.toFixed(2);
    }
    
    // Update category
    document.getElementById('productCategory').innerHTML = 'Category: <strong>' + product.category + '</strong>';
    
    // Update rating
    const ratingStars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
    document.getElementById('productRating').textContent = ratingStars;
    document.getElementById('reviewCount').textContent = product.reviews;
    
    // Update description
    document.getElementById('productDescription').textContent = product.description;
    
    // Update features
    const featuresList = document.getElementById('productFeatures');
    featuresList.innerHTML = '';
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = '✓ ' + feature;
        li.style.padding = '8px 0';
        featuresList.appendChild(li);
    });
    
    // Update meta
    document.getElementById('sku').textContent = product.sku;
    document.getElementById('stock').textContent = product.stock > 0 ? 'In Stock (' + product.stock + ' available)' : 'Out of Stock';
    
    // Update main image with safe attrs and fallback
    const mainImg = document.getElementById('mainImage');
    if (mainImg) {
        mainImg.referrerPolicy = 'no-referrer';
        mainImg.loading = 'eager';
        mainImg.onerror = function() {
            if (!this.dataset.f1) {
                this.dataset.f1 = 1;
                this.src = 'https://picsum.photos/seed/' + encodeURIComponent(product.name) + '/400/400';
            } else {
                this.onerror = null;
                this.src = 'https://placehold.co/400x400?text=Image+Unavailable';
            }
        };
        mainImg.src = product.image;
    }
    
    // Update related products
    displayRelatedProducts(product.category, productId);

    // Update reviews section
    renderReviews(productId);
    updateReviewStats(productId);
}

async function displayRelatedProducts(category, excludeId) {
    const relatedContainer = document.getElementById('relatedProducts');
    const catalog = await loadProducts();
    const source = Array.isArray(catalog) && catalog.length > 0
        ? catalog
        : Object.values(productDetails);
    const related = source
        .filter(p => p.category === category && p.id !== excludeId)
        .slice(0, 4);
    
    let html = '';
    related.forEach(product => {
        const hasDiscount = product.originalPrice && product.originalPrice > product.price;
        const ratingStars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
        
        html += `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" referrerpolicy="no-referrer" onerror="if(!this.dataset.f1){this.dataset.f1=1;this.src='https://picsum.photos/seed/${encodeURIComponent(product.name)}/400/400';}else{this.onerror=null;this.src='https://placehold.co/400x400?text=Image+Unavailable';}">
                    ${hasDiscount ? '<span class="badge sale">Sale</span>' : '<span class="badge">Popular</span>'}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="category">${product.category}</p>
                    <div class="rating">
                        <span class="stars">${ratingStars}</span>
                        <span class="review-count">(${product.reviews})</span>
                    </div>
                    <div class="price-section">
                        <span class="price">$${product.price.toFixed(2)}</span>
                        ${hasDiscount ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button class="btn btn-add-cart" onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
                    <a href="product-detail.html?id=${product.id}" class="btn btn-secondary">View Details</a>
                </div>
            </div>
        `;
    });
    
    relatedContainer.innerHTML = html;
}

function increaseQuantity() {
    currentQuantity++;
    document.getElementById('quantity').value = currentQuantity;
}

function decreaseQuantity() {
    if (currentQuantity > 1) {
        currentQuantity--;
        document.getElementById('quantity').value = currentQuantity;
    }
}

function addProductToCart() {
    const productId = getProductIdFromURL();
    const product = productDetails[productId];
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (!product) return;
    
    // Add to cart
    for (let i = 0; i < quantity; i++) {
        addToCart(product.name, product.price);
    }
    
    // Highlight button
    const btn = document.getElementById('addToCartBtn');
    btn.textContent = '✓ Added to Cart!';
    btn.style.backgroundColor = 'var(--success-color)';
    
    setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.style.backgroundColor = '';
    }, 2000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetails();
});

// ========================================
// REVIEWS RENDERING
// ========================================

function renderReviews(productId) {
    const reviews = productReviews[productId] || [];
    const list = document.getElementById('reviewsList');
    if (!list) return;
    
    if (reviews.length === 0) {
        list.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
        return;
    }
    
    let html = '';
    reviews.forEach(r => {
        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        html += `
            <div class="review-card" style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong>${r.author}</strong>
                    <span style="color: var(--text-gray);">${new Date(r.date).toLocaleDateString()}</span>
                </div>
                <div class="stars" style="color: #f5a623; margin-bottom: 10px;">${stars}</div>
                <div style="font-weight: 600; margin-bottom: 8px;">${r.title}</div>
                <p style="margin: 0;">${r.content}</p>
            </div>
        `;
    });
    
    list.innerHTML = html;
}

function updateReviewStats(productId) {
    const reviews = productReviews[productId] || [];
    const total = reviews.length;
    const avg = total > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total) : 0;
    
    const avgRatingEl = document.getElementById('avgRating');
    const avgStarsEl = document.getElementById('avgStars');
    const totalReviewsEl = document.getElementById('totalReviews');
    
    if (avgRatingEl) avgRatingEl.textContent = avg.toFixed(1);
    if (avgStarsEl) avgStarsEl.textContent = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));
    if (totalReviewsEl) totalReviewsEl.textContent = total;
}
