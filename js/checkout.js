/* ========================================
   CHECKOUT PAGE JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initCheckoutSummary();
    
    // Format card number input
    const cardNumberInput = document.querySelector('input[name="cardNumber"]');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = formattedValue;
        });
    }
    
    // Format expiry input
    const expiryInput = document.querySelector('input[name="expiry"]');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // Shipping method change handler
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', initCheckoutSummary);
    });
});
