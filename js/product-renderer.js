/* ========================================
   PRODUCT RENDERER MODULE
   Handles product display and formatting
   ======================================== */

const ProductRenderer = (() => {
    // Private helper: generate product card HTML
    const generateProductCard = (product, viewType = 'grid') => {
        const originalPriceHTML = product.originalPrice 
            ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` 
            : '';
        
        const starsHTML = generateStarsHTML(product.rating);
        
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" referrerpolicy="no-referrer" onerror="if(!this.dataset.f1){this.dataset.f1=1;this.src='https://picsum.photos/seed/${encodeURIComponent(product.name)}/400/400';}else{this.onerror=null;this.src='https://placehold.co/400x400?text=Image+Unavailable';}">
                    ${product.badge ? `<span class="badge ${product.badgeClass}">${product.badge}</span>` : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="category">${product.category}</p>
                    <div class="rating">
                        <span class="stars">${starsHTML}</span>
                        <span class="review-count">(${product.reviews} reviews)</span>
                    </div>
                    <div class="price-section">
                        <span class="price">$${product.price.toFixed(2)}</span>
                        ${originalPriceHTML}
                    </div>
                    <button class="btn btn-add-cart" onclick="CartManager.addItem('${product.name}', ${product.price}); showNotification('${product.name} added to cart!');">Add to Cart</button>
                    <a href="product-detail.html?id=${product.id}" class="btn btn-secondary">View Details</a>
                </div>
            </div>
        `;
    };

    // Private helper: generate star rating HTML
    const generateStarsHTML = (rating) => {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < Math.floor(rating)) {
                stars += '★';
            } else if (i < rating) {
                stars += '☆';
            } else {
                stars += '☆';
            }
        }
        return stars;
    };

    // Private helper: highlight search keywords
    const highlightKeywords = (text, keywords) => {
        if (!keywords || keywords.length === 0) return text;
        const terms = keywords.trim().split(/\s+/).filter(Boolean);
        if (terms.length === 0) return text;
        const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const regex = new RegExp('(' + escaped.join('|') + ')', 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    };

    // Public API
    return {
        // Render products grid
        renderGrid: (products, container, searchQuery = '') => {
            if (!container) return;
            
            if (products.length === 0) {
                container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found</p>';
                return;
            }
            
            container.className = 'products-grid';
            container.innerHTML = products.map(product => generateProductCard(product, 'grid')).join('');
        },

        // Render products list
        renderList: (products, container, searchQuery = '') => {
            if (!container) return;
            
            if (products.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 40px;">No products found</p>';
                return;
            }
            
            container.className = 'products-list';
            let html = '';
            products.forEach(product => {
                const starsHTML = generateStarsHTML(product.rating);
                const originalPriceHTML = product.originalPrice 
                    ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` 
                    : '';
                
                html += `
                    <div class="list-item">
                        <img src="${product.image}" alt="${product.name}" loading="lazy" referrerpolicy="no-referrer" onerror="if(!this.dataset.f1){this.dataset.f1=1;this.src='https://picsum.photos/seed/${encodeURIComponent(product.name)}/400/400';}else{this.onerror=null;this.src='https://placehold.co/400x400?text=Image+Unavailable';}">
                        <div class="list-info">
                            <h4>${product.name}</h4>
                            <p>${product.category} | <span class="stars">${starsHTML}</span> (${product.reviews})</p>
                        </div>
                        <div class="list-actions">
                            <div class="price-section">
                                <span class="price">$${product.price.toFixed(2)}</span>
                                ${originalPriceHTML}
                            </div>
                            <button class="btn btn-add-cart" onclick="CartManager.addItem('${product.name}', ${product.price}); showNotification('${product.name} added to cart!');">Add to Cart</button>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;
        },

        // Render featured products (homepage)
        renderFeatured: (products, container, count = 4) => {
            if (!container) return;
            
            const featured = products.slice(0, count);
            container.className = 'products-grid';
            container.innerHTML = featured.map(product => generateProductCard(product)).join('');
        },

        // Get stars HTML
        getStarsHTML: generateStarsHTML,

        // Highlight search text
        highlightSearch: highlightKeywords
    };
})();
