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
        
        // Convert comparison list to numbers for matching
        const comparisonIds = comparisonList.map(id => Number(id));
        
        // Get only the products in comparison
        const productsToShow = allProducts.filter(p => comparisonIds.includes(p.id));
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
    html += '<thead><tr><th class="attribute-label">Product</th>';
    products.forEach((p, i) => {
        html += `<th class="product-column">${escapeHtml(p.name)}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Image row
    html += '<tr><td class="attribute-label"><strong>Image</strong></td>';
    products.forEach(p => {
        const img = p.image && !p.image.includes('http') ? 'assets/images/' + p.image : (p.image || 'https://via.placeholder.com/150x100?text=No+Image');
        html += `<td class="product-column"><img src="${escapeHtml(img)}" class="product-image" onerror="this.src='https://via.placeholder.com/150x100?text=No+Image'"></td>`;
    });
    html += '</tr>';
    
    // Price row
    html += '<tr><td class="attribute-label"><strong>Price</strong></td>';
    products.forEach(p => {
        html += `<td class="product-column"><div class="product-price">$${p.price.toFixed(2)}</div></td>`;
    });
    html += '</tr>';
    
    // Rating row
    html += '<tr><td class="attribute-label"><strong>Rating</strong></td>';
    products.forEach(p => {
        const rating = p.rating || 0;
        const reviewCount = p.reviews || 0;
        html += `<td class="product-column"><div class="rating-stars">⭐ ${rating.toFixed(1)}/5 <br><small>(${reviewCount} reviews)</small></div></td>`;
    });
    html += '</tr>';
    
    // Stock row
    html += '<tr><td class="attribute-label"><strong>Stock</strong></td>';
    products.forEach(p => {
        const stock = p.stock || 0;
        let stockClass = 'in-stock';
        let stockText = `In Stock (${stock})`;
        
        if (stock === 0) {
            stockClass = 'out-of-stock';
            stockText = 'Out of Stock';
        } else if (stock < 5) {
            stockClass = 'low-stock';
            stockText = `Low Stock (${stock})`;
        }
        
        html += `<td class="product-column"><span class="stock-status ${stockClass}">${stockText}</span></td>`;
    });
    html += '</tr>';
    
    // Category row
    html += '<tr><td class="attribute-label"><strong>Category</strong></td>';
    products.forEach(p => {
        html += `<td class="product-column">${escapeHtml(p.category || 'N/A')}</td>`;
    });
    html += '</tr>';
    
    // Description row
    html += '<tr><td class="attribute-label"><strong>Description</strong></td>';
    products.forEach(p => {
        const desc = p.description || 'No description available';
        html += `<td class="product-column"><small>${escapeHtml(desc)}</small></td>`;
    });
    html += '</tr>';
    
    // Remove buttons
    html += '<tr><td class="attribute-label"><strong>Actions</strong></td>';
    products.forEach(p => {
        html += `<td class="product-column"><button onclick="removeProduct(${p.id})" class="product-remove">Remove from Compare</button></td>`;
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
    list = list.filter(id => id !== Number(productId));
    localStorage.setItem('techhub-comparison', JSON.stringify(list));
    location.reload();
}

/**
 * Clear all comparisons
 */
function clearComparison() {
    showConfirmModal('Clear All Comparisons?', 'Are you sure you want to clear all products from comparison?', () => {
        clearComparisonStorage();
        // Use a small delay to ensure storage is cleared, then reload
        setTimeout(() => {
            location.reload();
        }, 100);
    });
}

function showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('confirmBtn');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Set up confirm button with callback that closes modal first
    confirmBtn.onclick = () => {
        closeModal();
        if (onConfirm) onConfirm();
    };
    
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'none';
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
