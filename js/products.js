/* ========================================
   PRODUCTS PAGE - MINIMAL WORKING VERSION
   ======================================== */

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let currentView = 'grid';
let currentSort = 'popular';
const itemsPerPage = 12;

function highlightText(text, query) {
    if (!query) return text;
    const terms = query.trim().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return text;
    const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp('(' + escaped.join('|') + ')', 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function displayProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    currentPage = 1;
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found</p>';
        return;
    }
    
    container.className = currentView === 'grid' ? 'products-grid' : 'products-list';
    
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const toDisplay = filteredProducts.slice(start, start + itemsPerPage);
    
    let html = '';
    toDisplay.forEach(product => {
        const stars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
        const badge = product.originalPrice ? '<span class="badge sale">Sale</span>' : '<span class="badge">Popular</span>';
        
        // Check if product is in wishlist
        let wishlistData = [];
        try {
            const stored = localStorage.getItem('techhub-wishlist');
            wishlistData = stored ? JSON.parse(stored) : [];
        } catch (e) {
            wishlistData = [];
        }
        const inWishlist = wishlistData.includes(product.id);
        const wishlistClass = inWishlist ? 'active' : '';
        
        html += `<div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" referrerpolicy="no-referrer" onerror="if(!this.dataset.f1){this.dataset.f1=1;this.src='https://picsum.photos/seed/${encodeURIComponent(product.name)}/400/400';}else{this.src='https://placehold.co/400x400?text=No+Image';}">
                ${badge}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                <div class="rating">
                    <span class="stars">${stars}</span>
                    <span class="review-count">(${product.reviews} reviews)</span>
                </div>
                <div class="price-section">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="btn btn-add-cart" onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
                <a href="product-detail.html?id=${product.id}" class="btn btn-secondary">View Details</a>
                <button type="button" class="compare-btn" data-product-id="${product.id}" onclick="handleCompareClick(this)" title="Add to comparison">Add to Compare</button>
                <button type="button" class="wishlist-btn ${wishlistClass}" onclick="toggleWishlist(${product.id}, this)" title="Add to wishlist"><i class="fas fa-heart"></i></button>
            </div>
        </div>`;
    });
    
    container.innerHTML = html;
    
    // Add pagination controls
    let paginationContainer = document.getElementById('paginationControls');
    if (!paginationContainer) {
        const productsSection = document.querySelector('.products-section');
        if (productsSection) {
            paginationContainer = document.createElement('div');
            paginationContainer.id = 'paginationControls';
            paginationContainer.style.cssText = 'display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 40px;';
            productsSection.appendChild(paginationContainer);
        }
    }
    
    if (paginationContainer) {
        let paginationHTML = `<span style="font-weight: 600; color: var(--text-dark);">${currentPage} / ${totalPages}</span>`;
        
        if (currentPage < totalPages) {
            paginationHTML += `<button class="btn btn-primary" onclick="loadMoreProducts()">Show More</button>`;
        }
        
        paginationContainer.innerHTML = paginationHTML;
    }
}

function applyFilters() {
    filteredProducts = [...allProducts];
    
    const cats = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(el => el.value);
    if (cats.length > 0) {
        filteredProducts = filteredProducts.filter(p => cats.includes(p.category));
    }
    
    const priceSlider = document.querySelector('.price-range');
    if (priceSlider) {
        const maxPrice = parseInt(priceSlider.value);
        filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);
    }
    
    const ratings = Array.from(document.querySelectorAll('input[name="rating"]:checked')).map(el => parseInt(el.value));
    if (ratings.length > 0) {
        const minRating = Math.min(...ratings);
        filteredProducts = filteredProducts.filter(p => p.rating >= minRating);
    }
    
    applySort();
    currentPage = 1;
    displayProducts();
}

function applySort() {
    const sortVal = currentSort;
    
    switch(sortVal) {
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
            filteredProducts.sort((a, b) => (b.rating - a.rating) || (b.reviews - a.reviews));
            break;
        default:
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
    }
}

// ========================================
// COMPARISON BUTTON HANDLER - SIMPLE VERSION
// ========================================
function handleCompareClick(btn) {
    const productId = Number(btn.dataset.productId);
    
    // Get current list
    let list = [];
    try {
        const stored = localStorage.getItem('techhub-comparison');
        list = stored ? JSON.parse(stored) : [];
    } catch (e) {
        list = [];
    }
    
    // Toggle product
    const index = list.indexOf(productId);
    if (index > -1) {
        list.splice(index, 1);
        btn.textContent = 'Add to Compare';
        btn.classList.remove('in-comparison');
    } else {
        if (list.length < 4) {
            list.push(productId);
            btn.textContent = '✓ In Comparison';
            btn.classList.add('in-comparison');
        } else {
            alert('Maximum 4 products can be compared');
            return;
        }
    }
    
    // Save to localStorage
    localStorage.setItem('techhub-comparison', JSON.stringify(list));
    
    // Update badge
    updateComparisonBadge();
}

/**
 * Update comparison badge counter
 */
function updateComparisonBadge() {
    try {
        const stored = localStorage.getItem('techhub-comparison');
        const list = stored ? JSON.parse(stored) : [];
        const badge = document.getElementById('comparisonBadge');
        if (badge) {
            badge.textContent = list.length;
            badge.style.display = list.length > 0 ? 'flex' : 'none';
        }
    } catch (e) {
        console.error('Error updating badge:', e);
    }
}

// ========================================
// PAGE LOAD - INITIALIZE EVERYTHING
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Show skeleton loading while preparing products
    const container = document.getElementById('productsContainer');
    if (container) {
        container.innerHTML = `
            <style>
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                .skeleton-card {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite;
                    border-radius: 8px;
                    padding: 15px;
                }
                .skeleton-image {
                    width: 100%;
                    height: 200px;
                    background: #e0e0e0;
                    border-radius: 6px;
                    margin-bottom: 12px;
                }
                .skeleton-title {
                    height: 16px;
                    background: #e0e0e0;
                    border-radius: 4px;
                    margin-bottom: 8px;
                }
                .skeleton-text {
                    height: 12px;
                    background: #e0e0e0;
                    border-radius: 4px;
                    margin-bottom: 8px;
                }
            </style>
            ${Array(12).fill().map(() => `
                <div class="skeleton-card">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text" style="width: 70%;"></div>
                    <div class="skeleton-text" style="width: 50%;"></div>
                </div>
            `).join('')}
        `;
    }
    
    if (!window.allProductsData) {
        return;
    }
    
    allProducts = [...window.allProductsData];
    filteredProducts = [...allProducts];
    
    // Initialize comparison badge
    updateComparisonBadge();
    
    // Check URL for category parameter and auto-select it
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        const categoryCheckbox = document.querySelector(`input[name="category"][value="${categoryParam.toLowerCase()}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
        }
    }
    
    applyFilters();
    applySort();
    displayProducts();
    
    // Wire up all event listeners
    document.querySelectorAll('input[name="category"]').forEach(el => {
        el.addEventListener('change', applyFilters);
    });
    
    document.querySelectorAll('input[name="rating"]').forEach(el => {
        el.addEventListener('change', applyFilters);
    });
    
    const priceSlider = document.querySelector('.price-range');
    if (priceSlider) {
        priceSlider.addEventListener('input', e => {
            document.getElementById('priceValue').textContent = e.target.value;
        });
        priceSlider.addEventListener('change', applyFilters);
    }
    
    const sortDropdown = document.getElementById('sort');
    if (sortDropdown) {
        sortDropdown.addEventListener('change', e => {
            currentSort = e.target.value;
            applySort();
            displayProducts();
        });
    }
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            currentView = e.target.getAttribute('data-view') || 'grid';
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            displayProducts();
        });
    });
    
    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
            if (priceSlider) {
                priceSlider.value = 1000;
                document.getElementById('priceValue').textContent = '1000';
            }
            if (sortDropdown) sortDropdown.value = 'popular';
            currentSort = 'popular';
            filteredProducts = [...allProducts];
            applySort();
            displayProducts();
        });
    }
});

// Make functions globally accessible
window.applyFilters = applyFilters;
window.applySort = applySort;
window.displayProducts = displayProducts;

function loadMoreProducts() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        addMoreProducts();
    }
}

function addMoreProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    const start = (currentPage - 1) * itemsPerPage;
    const toDisplay = filteredProducts.slice(start, start + itemsPerPage);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    let html = '';
    toDisplay.forEach(product => {
        const stars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
        const badge = product.originalPrice ? '<span class="badge sale">Sale</span>' : '<span class="badge">Popular</span>';
        
        html += `<div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" referrerpolicy="no-referrer" onerror="if(!this.dataset.f1){this.dataset.f1=1;this.src='https://picsum.photos/seed/${encodeURIComponent(product.name)}/400/400';}else{this.src='https://placehold.co/400x400?text=No+Image';}">
                ${badge}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                <div class="rating">
                    <span class="stars">${stars}</span>
                    <span class="review-count">(${product.reviews} reviews)</span>
                </div>
                <div class="price-section">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="btn btn-add-cart" onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
                <a href="product-detail.html?id=${product.id}" class="btn btn-secondary">View Details</a>
            </div>
        </div>`;
    });
    
    container.innerHTML += html;
    
    // Update pagination controls
    const paginationContainer = document.getElementById('paginationControls');
    if (paginationContainer) {
        let paginationHTML = `<span style="font-weight: 600; color: var(--text-dark);">${currentPage} / ${totalPages}</span>`;
        
        if (currentPage < totalPages) {
            paginationHTML += `<button class="btn btn-primary" onclick="loadMoreProducts()">Show More</button>`;
        }
        
        paginationContainer.innerHTML = paginationHTML;
    }
}

/**
 * Toggle wishlist status
 */
function toggleWishlist(productId, btn) {
    try {
        let wishlist = [];
        const stored = localStorage.getItem('techhub-wishlist');
        if (stored) {
            wishlist = JSON.parse(stored);
        }
        
        const index = wishlist.indexOf(productId);
        if (index > -1) {
            wishlist.splice(index, 1);
            if (btn) btn.classList.remove('active');
        } else {
            wishlist.push(productId);
            if (btn) btn.classList.add('active');
        }
        
        localStorage.setItem('techhub-wishlist', JSON.stringify(wishlist));
        updateWishlistBadge();
    } catch (e) {
        console.error('Error toggling wishlist:', e);
    }
}

/**
 * Update wishlist badge
 */
function updateWishlistBadge() {
    try {
        const stored = localStorage.getItem('techhub-wishlist');
        const wishlist = stored ? JSON.parse(stored) : [];
        // Update badge if it exists
        const wishlistLink = document.querySelector('a[href="wishlist.html"]');
        if (wishlistLink) {
            const badge = wishlistLink.querySelector('.badge');
            if (badge) {
                badge.textContent = wishlist.length;
            }
        }
    } catch (e) {
        console.error('Error updating wishlist badge:', e);
    }
}

window.loadMoreProducts = loadMoreProducts;
