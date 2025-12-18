/* ========================================
   ORDER CONFIRMATION PAGE JAVASCRIPT
   ======================================== */

function loadOrderConfirmation() {
    const persisted = (() => { try { return JSON.parse(sessionStorage.getItem('techhubLastOrder')); } catch (e) { return null; } })();
    const items = persisted?.items && Array.isArray(persisted.items) ? persisted.items : getCart();

    // Generate order number
    const orderNumber = 'TH-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    document.getElementById('orderNumber').textContent = orderNumber;

    // Set order date
    const dateRef = persisted?.orderDateISO ? new Date(persisted.orderDateISO) : new Date();
    const dateStr = dateRef.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('orderDate').textContent = dateStr;

    // Estimated delivery based on shipping method
    const method = persisted?.shippingMethod || 'standard';
    let etaDays = 5;
    let etaLabel = 'Around ';
    if (method === 'express') { etaDays = 2; }
    if (method === 'overnight') { etaDays = 1; etaLabel = ''; }
    const deliveryDate = new Date(dateRef.getTime() + (etaDays * 24 * 60 * 60 * 1000));
    const deliveryStr = deliveryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('estimatedDelivery').textContent = (method === 'standard' ? 'Around ' : (method === 'express' ? 'Around ' : '')) + deliveryStr;

    // Populate order items
    let orderItemsHTML = '';
    items.forEach(item => {
        orderItemsHTML += `
            <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 15px; padding: 15px 0; border-bottom: 1px solid var(--border-color); align-items: center;">
                <div>
                    <p style="font-weight: 600; margin-bottom: 5px;">${item.name}</p>
                    <p style="color: var(--text-light); font-size: 0.9rem;">Quantity: ${item.quantity}</p>
                </div>
                <p style="color: var(--primary-color); font-weight: 600;">$${item.price.toFixed(2)}</p>
                <p style="font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        `;
    });
    document.getElementById('orderItems').innerHTML = orderItemsHTML;

    // Totals
    const subtotal = typeof persisted?.subtotal === 'number' ? persisted.subtotal : items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = typeof persisted?.shippingCost === 'number' ? persisted.shippingCost : (subtotal > 50 ? 0 : 10);
    const tax = typeof persisted?.tax === 'number' ? persisted.tax : subtotal * 0.1;
    const total = typeof persisted?.total === 'number' ? persisted.total : subtotal + shipping + tax;

    document.getElementById('confirmSubtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('confirmShipping').textContent = '$' + shipping.toFixed(2);
    document.getElementById('confirmTax').textContent = '$' + tax.toFixed(2);
    document.getElementById('confirmTotal').textContent = '$' + total.toFixed(2);

    // Populate summary items
    let summaryHTML = '';
    items.forEach(item => {
        summaryHTML += `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color); font-size: 0.9rem;">
                <span>${item.name} x${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    document.getElementById('summaryItems').innerHTML = summaryHTML;
}

function printOrder() {
    window.print();
}

function downloadOrder() {
    // Simple download simulation
    const content = `
    TechHub Store - Order Receipt
    
    Order Number: ${document.getElementById('orderNumber').textContent}
    Order Date: ${document.getElementById('orderDate').textContent}
    
    Items:
    ${document.getElementById('orderItems').innerText}
    
    Subtotal: ${document.getElementById('confirmSubtotal').textContent}
    Shipping: ${document.getElementById('confirmShipping').textContent}
    Tax: ${document.getElementById('confirmTax').textContent}
    Total: ${document.getElementById('confirmTotal').textContent}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'order-receipt.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Load on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!requireLogin()) return;
    loadOrderConfirmation();
});
