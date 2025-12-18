/**
 * Comparison Page - Displays product comparison table
 */

// Direct inline function to manage comparison - no dependencies
function getComparisonList() {
    try {
        const data = localStorage.getItem('techhub-comparison');
        if (!data) return [];
        const list = JSON.parse(data);
        return Array.isArray(list) ? list : [];
    } catch (e) {
        return [];
    }
}

function clearComparisonStorage() {
    localStorage.removeItem('techhub-comparison');
}

// Load and display immediately when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const comparisonList = getComparisonList();
    console.log('Comparison list from storage:', comparisonList);
    
    if (!comparisonList || comparisonList.length === 0) {
        showEmptyState();
        return;
    }
    
    // Fetch products and render
    try {
        const response = await fetch('data/products.json');
        const allProducts = await response.json();
        console.log('All products fetched:', allProducts.length);
        
        // Get only the products in comparison
        const productsToShow = allProducts.filter(p => comparisonList.includes(p.id));
        console.log('Products to show:', productsToShow.length, productsToShow.map(p => p.name));
        
        if (productsToShow.length === 0) {
            showEmptyState();
        } else {
            renderComparisonTable(productsToShow);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        showEmptyState();
    }
});

function showEmptyState() {
    const container = document.getElementById('comparisonContent');
    if (container) {
        container.innerHTML = `
            <div class="comparison-empty">
                <i class="fas fa-balance-scale"></i>
                <h2>No Products to Compare</h2>
                <p>Add products from the shop to compare them.</p>
                <a href="products.html" class="btn btn-primary" style="display: inline-block; margin-top: 20px;">Start Shopping</a>
            </div>
        `;
    }
}

/**
 * Render comparison table with products
 */
function renderComparisonTable(products) {
    const container = document.getElementById('comparisonContent');
    
    if (!container) {
        console.error('comparisonContent container not found');
        return;
    }
    const attributes = getComparisonAttributes(products);
    const html = buildComparisonTableHTML(products, attributes);
    container.innerHTML = html;
}

/**
 * Build simple comparison table
 */
function buildComparisonTableHTML(products) {
    if (!products || products.length === 0) {
        return `
            <div class="comparison-empty">
                <i class="fas fa-balance-scale"></i>
                <h2>No Products to Compare</h2>
                <p>Add products from the shop to compare them.</p>
                <a href="products.html" class="btn btn-primary" style="display: inline-block; margin-top: 20px;">Start Shopping</a>
            </div>
        `;
    }
    
    let html = '<div class="comparison-table"><table>';
    
    // Header
    html += '<thead><tr><th style="width: 200px;">Product</th>';
    products.forEach((p, i) => {
        html += `<th style="width: 200px;">${p.name}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Image row
    html += '<tr><td style="font-weight: bold;">Image</td>';
    products.forEach(p => {
        const img = p.image && !p.image.includes('http') ? 'assets/images/' + p.image : p.image;
        html += `<td><img src="${img}" style="width: 150px; height: 100px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/150x100?text=No+Image'"></td>`;
    });
    html += '</tr>';
    
    // Price row
    html += '<tr><td style="font-weight: bold;">Price</td>';
    products.forEach(p => {
        html += `<td style="color: var(--primary-color); font-weight: bold; font-size: 1.2em;">$${p.price}</td>`;
    });
    html += '</tr>';
    
    // Rating row
    html += '<tr><td style="font-weight: bold;">Rating</td>';
    products.forEach(p => {
        const rating = p.rating || 0;
        html += `<td>⭐ ${rating}/5 (${p.reviews} reviews)</td>`;
    });
    html += '</tr>';
    
    // Stock row
    html += '<tr><td style="font-weight: bold;">Stock</td>';
    products.forEach(p => {
        const inStock = p.stock > 0 ? `<span style="color: green;">In Stock (${p.stock})</span>` : '<span style="color: red;">Out of Stock</span>';
        html += `<td>${inStock}</td>`;
    });
    html += '</tr>';
    
    // Category row
    html += '<tr><td style="font-weight: bold;">Category</td>';
    products.forEach(p => {
        html += `<td>${p.category}</td>`;
    });
    html += '</tr>';
    
    // Description row
    html += '<tr><td style="font-weight: bold;">Description</td>';
    products.forEach(p => {
        html += `<td style="font-size: 0.9em;"><small>${p.description || 'N/A'}</small></td>`;
    });
    html += '</tr>';
    
    // Remove buttons
    html += '<tr><td style="font-weight: bold;">Actions</td>';
    products.forEach(p => {
        html += `<td><button onclick="removeProduct(${p.id})" class="btn btn-danger" style="width: 100%;">Remove</button></td>`;
    });
    html += '</tr>';
    
    html += '</tbody></table></div>';
    
    return html;
}

/**
 * Get attributes (unused in new version but keep for compatibility)
 */
function getComparisonAttributes(products) {
    return { basic: [], specs: [] };
}

/**
 * Remove product from comparison
 */
function removeProduct(productId) {
    let list = getComparisonList();
    list = list.filter(id => id !== productId);
    localStorage.setItem('techhub-comparison', JSON.stringify(list));
    location.reload();
}

/**
 * Clear all comparisons
 */
function clearComparison() {
    if (confirm('Clear all comparisons?')) {
        clearComparisonStorage();
        location.reload();
    }
}
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}
