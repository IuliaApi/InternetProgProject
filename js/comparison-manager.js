/**
 * Comparison Manager - Handles product comparison functionality
 * Stores up to 4 products for side-by-side comparison
 */

console.log('Comparison manager script initializing...');

class ComparisonManager {
    constructor() {
        this.storageKey = 'techhub-comparison';
        this.maxProducts = 4;
        this.comparisonList = this.loadComparison();
        this.init();
    }

    /**
     * Initialize comparison manager
     */
    init() {
        console.log('Initializing comparison manager, current list:', this.comparisonList);
        this.updateComparisonBadge();
        this.setupEventListeners();
        console.log('Comparison manager initialized');
    }

    /**
     * Load comparison from localStorage
     */
    loadComparison() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading comparison:', error);
            return [];
        }
    }

    /**
     * Save comparison to localStorage
     */
    saveComparison() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.comparisonList));
            this.updateComparisonBadge();
        } catch (error) {
            console.error('Error saving comparison:', error);
        }
    }

    /**
     * Add product to comparison
     */
    addProduct(productId) {
        // Convert to number to ensure consistency
        productId = Number(productId);
        if (this.comparisonList.find(p => p === productId)) {
            return false; // Already in comparison
        }

        if (this.comparisonList.length >= this.maxProducts) {
            alert(`You can compare up to ${this.maxProducts} products. Please remove one first.`);
            return false;
        }

        this.comparisonList.push(productId);
        this.saveComparison();
        return true;
    }

    /**
     * Remove product from comparison
     */
    removeProduct(productId) {
        // Convert to number to ensure consistency
        productId = Number(productId);
        this.comparisonList = this.comparisonList.filter(id => id !== productId);
        this.saveComparison();
    }

    /**
     * Check if product is in comparison
     */
    isInComparison(productId) {
        // Convert to number to ensure consistency
        productId = Number(productId);
        return this.comparisonList.includes(productId);
    }

    /**
     * Get comparison list count
     */
    getCount() {
        return this.comparisonList.length;
    }

    /**
     * Clear all comparisons
     */
    clearComparison() {
        this.comparisonList = [];
        this.saveComparison();
    }

    /**
     * Update comparison badge display
     */
    updateComparisonBadge() {
        const badges = document.querySelectorAll('.comparison-badge');
        const count = this.getCount();
        
        badges.forEach(badge => {
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });

        // Update comparison button state
        const compareButtons = document.querySelectorAll('.compare-btn');
        compareButtons.forEach(btn => {
            const productId = btn.dataset.productId;
            if (this.isInComparison(productId)) {
                btn.classList.add('active');
                btn.innerHTML = '✓ In Comparison';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = 'Add to Compare';
            }
        });
    }

    /**
     * Setup event listeners for comparison buttons
     */
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('compare-btn')) {
                const productId = e.target.dataset.productId;
                console.log('Compare button clicked for product:', productId);
                
                if (this.isInComparison(productId)) {
                    console.log('Product already in comparison, removing');
                    this.removeProduct(productId);
                } else {
                    console.log('Adding product to comparison');
                    this.addProduct(productId);
                }
                
                console.log('Updated comparison list:', this.comparisonList);
                this.updateComparisonBadge();
            }

            if (e.target.classList.contains('clear-comparison-btn')) {
                if (confirm('Clear all comparisons?')) {
                    this.clearComparison();
                    this.updateComparisonBadge();
                }
            }
        });
    }

    /**
     * Get products data for comparison
     */
    async getComparisonProducts() {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) throw new Error('Failed to fetch products');
            
            const products = await response.json();
            return products.filter(p => this.comparisonList.includes(p.id));
        } catch (error) {
            console.error('Error fetching comparison products:', error);
            return [];
        }
    }

    /**
     * Navigate to comparison page
     */
    navigateToComparison() {
        if (this.getCount() === 0) {
            alert('Please add products to compare.');
            return;
        }
        window.location.href = 'comparison.html';
    }
}

// Initialize comparison manager immediately (don't wait for DOMContentLoaded)
console.log('Comparison manager script loading');
window.comparisonManager = new ComparisonManager();
console.log('ComparisonManager instance created and attached to window:', window.comparisonManager);

// Also setup event delegation as backup
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded fired, comparisonManager ready');
    });
}
