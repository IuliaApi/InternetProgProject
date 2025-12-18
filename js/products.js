/* ========================================
   PRODUCTS PAGE JAVASCRIPT
   ======================================== */

// Embedded products array - directly available
const allProductsData = [
    {"id": 1, "name": "Wireless Headphones", "category": "audio", "price": 149.99, "originalPrice": 199.99, "rating": 5, "reviews": 124, "image": "https://www.krazykileys.ca/files/image/attachment/51970/ATH-S300BTBK.png"},
    {"id": 2, "name": "Smart Watch Pro", "category": "wearables", "price": 299.99, "originalPrice": 399.99, "rating": 4, "reviews": 89, "image": "https://cdn11.bigcommerce.com/s-zkx2f01ivr/images/stencil/1280x1280/products/855/7190/Smart_Watch_Pro1_Sil__08483.1713990534.jpg?c=3"},
    {"id": 3, "name": "4K Webcam Ultra", "category": "video", "price": 199.99, "rating": 5, "reviews": 156, "image": "https://m.media-amazon.com/images/I/61TowBOapYL._AC_SL1500_.jpg"},
    {"id": 4, "name": "Portable Charger 50K", "category": "accessories", "price": 79.99, "rating": 5, "reviews": 203, "image": "https://m.media-amazon.com/images/I/61HC2TLZOEL._AC_SL1500_.jpg"},
    {"id": 5, "name": "USB-C Hub Pro", "category": "accessories", "price": 49.99, "originalPrice": 69.99, "rating": 4, "reviews": 87, "image": "https://m.media-amazon.com/images/I/71VG2JDOngL._AC_SL1500_.jpg"},
    {"id": 6, "name": "Mechanical Keyboard", "category": "computing", "price": 129.99, "rating": 5, "reviews": 142, "image": "https://m.media-amazon.com/images/I/81yd9W+0doL._AC_SL1500_.jpg"},
    {"id": 7, "name": "Wireless Mouse", "category": "computing", "price": 39.99, "originalPrice": 59.99, "rating": 4, "reviews": 98, "image": "https://webobjects2.cdw.com/is/image/CDW/3952293?wid=1037&hei=743&resMode=bilin&fit=fit,1"},
    {"id": 8, "name": "Monitor Light Bar", "category": "video", "price": 89.99, "rating": 5, "reviews": 76, "image": "https://image.benq.com/is/image/benqco/no-windows-home-office-lighting-advice%2001?$ResponsivePreset$&fmt=png-alpha"},
    {"id": 9, "name": "Bluetooth Speaker", "category": "audio", "price": 69.99, "originalPrice": 99.99, "rating": 4, "reviews": 134, "image": "https://www.sencor.com/getmedia/53d54418-3de4-4fe8-a503-5edb74cac646/35059173.jpg.aspx?width=2100&height=2100&ext=.jpg"},
    {"id": 10, "name": "Fitness Tracker", "category": "wearables", "price": 99.99, "rating": 4, "reviews": 112, "image": "https://m.media-amazon.com/images/I/61dV494jBgL._AC_SL1500_.jpg"},
    {"id": 11, "name": "USB-C Cable 3-Pack", "category": "accessories", "price": 19.99, "rating": 5, "reviews": 567, "image": "https://m.media-amazon.com/images/I/81DwfrTrQ-L._SL1500_.jpg"},
    {"id": 12, "name": "Laptop Stand Aluminum", "category": "computing", "price": 39.99, "rating": 5, "reviews": 289, "image": "https://www.nativeunion.com/cdn/shop/files/DeskStand_Black.webp?v=1756296476&width=800"},
    {"id": 13, "name": "Microphone Condenser", "category": "audio", "price": 129.99, "originalPrice": 179.99, "rating": 5, "reviews": 156, "image": "https://sontronics.com/cdn/shop/files/STC-20_Pack_Portrait_1024x1024@2x.png?v=1729072048"},
    {"id": 14, "name": "Phone Stand Adjustable", "category": "accessories", "price": 14.99, "rating": 4, "reviews": 432, "image": "https://m.media-amazon.com/images/I/51v1hI3DpdL._AC_SL1500_.jpg"},
    {"id": 15, "name": "Wireless Charger Pad", "category": "accessories", "price": 29.99, "originalPrice": 49.99, "rating": 5, "reviews": 234, "image": "https://m.media-amazon.com/images/I/51zByFvQOoL._AC_SL1500_.jpg"},
    {"id": 16, "name": "4K Monitor 27\"", "category": "video", "price": 399.99, "originalPrice": 499.99, "rating": 5, "reviews": 98, "image": "https://ccimg.canadacomputers.com/Products/800x800/297/749/261899/49757.jpg"},
    {"id": 17, "name": "Gaming Headset RGB", "category": "audio", "price": 89.99, "originalPrice": 129.99, "rating": 4, "reviews": 145, "image": "https://xrocker.co.uk/cdn/shop/files/x-rocker-panther-rgb-gaming-headset-1_1000x1000_crop_center.jpg?v=1753873720"},
    {"id": 18, "name": "Smart Ring", "category": "wearables", "price": 349.99, "rating": 5, "reviews": 76, "image": "https://media.jaycar.com.au/product/images/QC3160_smart-ring-with-charging-case-large-black_157822.jpg?format=webp&width=1000"},
    {"id": 19, "name": "Camera Tripod Pro", "category": "video", "price": 59.99, "originalPrice": 89.99, "rating": 5, "reviews": 198, "image": "https://m.media-amazon.com/images/I/71eTlbLR4tL._AC_SL1500_.jpg"},
    {"id": 20, "name": "LED Ring Light", "category": "video", "price": 49.99, "rating": 4, "reviews": 267, "image": "https://cdn.mysagestore.com/2707f79fe28ea3c39ee938e00fa80a09/contents/SEMIERL18LEAC/SEMIERL18LEAC@3.jpg"},
    {"id": 21, "name": "Action Camera Pro", "category": "video", "price": 399.99, "originalPrice": 499.99, "rating": 5, "reviews": 176, "image": "https://media.cameracanada.com/productimage2020/GoPro/GPCHDHF131AT_GOPRO_HERO.jpg"},
    {"id": 22, "name": "Smart Speaker Mini", "category": "audio", "price": 89.99, "originalPrice": 129.99, "rating": 4, "reviews": 345, "image": "https://source.unsplash.com/400x400/?smart,speaker,home"},
    {"id": 23, "name": "Wireless Gaming Mouse", "category": "computing", "price": 79.99, "originalPrice": 119.99, "rating": 5, "reviews": 234, "image": "https://www.canex.ca/media/catalog/product/8/4/840272902981-1.jpg?quality=80&bg-color=255,255,255&fit=bounds&height=&width="},
    {"id": 24, "name": "VR Headset", "category": "wearables", "price": 499.99, "rating": 4, "reviews": 89, "image": "https://m.media-amazon.com/images/I/61GhF+JUXGL._AC_SL1500_.jpg"},
    {"id": 25, "name": "Docking Station USB-C", "category": "accessories", "price": 99.99, "originalPrice": 149.99, "rating": 5, "reviews": 156, "image": "https://www.belkin.com/dw/image/v2/BGBH_PRD/on/demandware.static/-/Sites-master-product-catalog-blk/default/dw6204f0e0/images/hi-res/7/7c3b18a421422876_INC004btSGY_USB-C_11in1_MultiportAdapter_Hero_Web_1.jpg?sw=700&sh=700&sm=fit&sfrm=png"}
];

// Pagination variables
let currentPage = 1;
const itemsPerPage = 12;

let currentView = 'grid';
let currentSort = 'popular';
let filteredProducts = [...allProductsData];
let currentSearchQuery = '';
let allProducts = [...allProductsData];

// Highlight matched search keywords in text
function highlightText(text, query) {
    if (!query) return text;
    const terms = query.trim().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return text;
    const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp('(' + escaped.join('|') + ')', 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Get search query from URL
function getSearchQueryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') || '';
}

// ========================================
// DISPLAY PRODUCTS WITH PAGINATION
// ========================================

function displayProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    // Reset to first page when filters change
    currentPage = 1;
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found</p>';
        removePaginationControls();
        return;
    }
    
    if (currentView === 'grid') {
        container.className = 'products-grid';
    } else {
        container.className = 'products-list';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '15px';
    }
    
    let html = '';
    
    productsToDisplay.forEach(product => {
        const hasDiscount = product.originalPrice && product.originalPrice > product.price;
        const ratingStars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
        
        if (currentView === 'grid') {
            html += `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy" referrerpolicy="no-referrer" onerror="if(!this.dataset.f1){this.dataset.f1=1;this.src='https://picsum.photos/seed/${encodeURIComponent(product.name)}/400/400';}else{this.onerror=null;this.src='https://placehold.co/400x400?text=Image+Unavailable';}">
                        ${hasDiscount ? '<span class="badge sale">Sale</span>' : '<span class="badge">Popular</span>'}
                    </div>
                    <div class="product-info">
                        <h3>${highlightText(product.name, currentSearchQuery)}</h3>
                        <p class="category">${highlightText(product.category, currentSearchQuery)}</p>
                        <div class="rating">
                            <span class="stars">${ratingStars}</span>
                            <span class="review-count">(${product.reviews} reviews)</span>
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
        } else {
            // List view
            html += `
                <div class="product-card" style="display: grid; grid-template-columns: 150px 1fr auto auto; gap: 20px; align-items: center; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
                    <img src="${product.image}" alt="${product.name}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 5px;" loading="lazy" referrerpolicy="no-referrer" onerror="if(!this.dataset.f1){this.dataset.f1=1;this.src='https://picsum.photos/seed/${encodeURIComponent(product.name)}/400/400';}else{this.onerror=null;this.src='https://placehold.co/400x400?text=Image+Unavailable';}">
                    <div>
                        <h3 style="margin: 0 0 10px 0;">${highlightText(product.name, currentSearchQuery)}</h3>
                        <p class="category" style="margin: 5px 0;">${highlightText(product.category, currentSearchQuery)}</p>
                        <div class="rating">
                            <span class="stars">${ratingStars}</span>
                            <span class="review-count">(${product.reviews} reviews)</span>
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <div class="price-section" style="flex-direction: column; gap: 5px;">
                            <span class="price">$${product.price.toFixed(2)}</span>
                            ${hasDiscount ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; flex-direction: column;">
                        <button class="btn btn-add-cart" onclick="addToCart('${product.name}', ${product.price})" style="width: 150px;">Add to Cart</button>
                        <a href="product-detail.html?id=${product.id}" class="btn btn-secondary" style="width: 150px; text-align: center;">View Details</a>
                    </div>
                </div>
            `;
        }
    });
    
    container.innerHTML = html;
    
    // Display pagination
    displayPagination(totalPages);
}

// ========================================
// PAGINATION CONTROLS
// ========================================

function displayPagination(totalPages) {
    let paginationContainer = document.getElementById('paginationControls');
    
    if (!paginationContainer) {
        // Create pagination container if it doesn't exist
        const productsSection = document.querySelector('.products-section');
        if (productsSection) {
            paginationContainer = document.createElement('div');
            paginationContainer.id = 'paginationControls';
            paginationContainer.style.cssText = 'display: flex; justify-content: center; gap: 10px; margin-top: 40px; flex-wrap: wrap;';
            productsSection.appendChild(paginationContainer);
        } else {
            return;
        }
    }
    
    let html = '';
    
    // Previous button
    if (currentPage > 1) {
        html += `<button class="pagination-btn" onclick="goToPage(${currentPage - 1})">← Previous</button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            html += `<button class="pagination-btn active" onclick="goToPage(${i})">${i}</button>`;
        } else if (
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            html += `<button class="pagination-btn" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span class="pagination-dots">...</span>`;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        html += `<button class="pagination-btn" onclick="goToPage(${currentPage + 1})">Next →</button>`;
    }
    
    paginationContainer.innerHTML = html;
}

function removePaginationControls() {
    const paginationContainer = document.getElementById('paginationControls');
    if (paginationContainer) {
        paginationContainer.innerHTML = '';
    }
}

function goToPage(pageNumber) {
    currentPage = pageNumber;
    
    // Scroll to top of products
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    displayProducts();
}

// ========================================
// FILTER PRODUCTS
// ========================================

function filterProducts() {
    filteredProducts = [...allProducts];
    
    // Apply search filter first
    if (currentSearchQuery) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(currentSearchQuery.toLowerCase())
        );
    }
    
    // Category filter
    const categoryFilters = document.querySelectorAll('input[name="category"]:checked');
    const selectedCategories = Array.from(categoryFilters).map(el => el.value);
    
    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedCategories.includes(product.category)
        );
    }
    
    // Price filter
    const priceRange = document.querySelector('.price-range');
    if (priceRange) {
        const maxPrice = parseInt(priceRange.value);
        filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    }
    
    // Rating filter
    const ratingFilters = document.querySelectorAll('input[name="rating"]:checked');
    if (ratingFilters.length > 0) {
        const minRatings = Array.from(ratingFilters).map(el => parseInt(el.value));
        const minRating = Math.min(...minRatings);
        filteredProducts = filteredProducts.filter(product => product.rating >= minRating);
    }
    
    // Re-apply sort
    sortProducts();
    displayProducts();
}

// ========================================
// SORT PRODUCTS
// ========================================

function sortProducts() {
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        currentSort = sortSelect.value;
    }
    
    switch(currentSort) {
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
            break;
        case 'popular':
        default:
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
    }
    
    displayProducts();
}

// ========================================
// VIEW TOGGLE
// ========================================

function setView(viewType) {
    currentView = viewType;
    
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (viewType === 'grid') {
        document.querySelector('.grid-view').classList.add('active');
    } else {
        document.querySelector('.list-view').classList.add('active');
    }
    
    displayProducts();
}

// ========================================
// RESET FILTERS
// ========================================

function resetFilters() {
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(el => {
        el.checked = false;
    });
    
    // Reset price range
    const priceRange = document.querySelector('.price-range');
    if (priceRange) {
        priceRange.value = 1000;
        document.getElementById('priceValue').textContent = '1000';
    }
    
    // Reset sort
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        sortSelect.value = 'popular';
    }
    
    filteredProducts = [...allProducts];
    sortProducts();
    displayProducts();
}

// ========================================
// PAGE LOAD WITH AJAX
// ========================================

let allProducts = []; 

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('productsContainer');
    
    // Direct simple render test
    if (container && allProductsData && allProductsData.length > 0) {
        let html = '';
        allProductsData.forEach(product => {
            html += `
                <div class="product-card" style="border:1px solid #ddd;padding:15px;border-radius:8px;">
                    <img src="${product.image}" alt="${product.name}" style="width:100%;height:200px;object-fit:cover;margin-bottom:10px;" referrerpolicy="no-referrer" onerror="this.src='https://placehold.co/400x400?text=${encodeURIComponent(product.name)}'">
                    <h3 style="font-size:16px;margin:10px 0;">${product.name}</h3>
                    <p style="color:#666;margin:5px 0;">${product.category}</p>
                    <p style="font-size:20px;color:#007bff;font-weight:bold;margin:10px 0;">$${product.price}</p>
                    <button onclick="addToCart('${product.name}',${product.price})" style="background:#007bff;color:white;border:none;padding:10px 20px;border-radius:5px;cursor:pointer;width:100%;">Add to Cart</button>
                </div>
            `;
        });
        container.innerHTML = html;
        container.className = 'products-grid';
        return;
    }
    
    if (container) {
        allProducts = [...allProductsData];
        filteredProducts = [...allProducts];
        
        const currentSearchQuery = getSearchQueryFromURL();
        
        if (currentSearchQuery) {
            filteredProducts = allProducts.filter(product => 
                product.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(currentSearchQuery.toLowerCase())
            );
            const heading = document.querySelector('h2');
            if (heading) {
                heading.textContent = `Search Results for "${currentSearchQuery}"`;
            }
        }
        
        sortProducts();
        displayProducts();
        
        document.querySelectorAll('input[name="category"], input[name="rating"]').forEach(el => {
            el.addEventListener('change', filterProducts);
        });
        
        document.getElementById('sort')?.addEventListener('change', sortProducts);
    }
});
