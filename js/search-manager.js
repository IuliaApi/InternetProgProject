/* ========================================
   SEARCH MANAGER MODULE
   Handles search functionality and suggestions
   ======================================== */

const SearchManager = (() => {
    let currentQuery = '';
    let searchCache = {};

    // Private helper: normalize search query
    const normalizeQuery = (query) => {
        return query.trim().toLowerCase();
    };

    // Private helper: get search suggestions
    const generateSuggestions = (query, products) => {
        if (query.length < 2) return [];

        const normalized = normalizeQuery(query);
        return products
            .filter(product =>
                product.name.toLowerCase().includes(normalized) ||
                product.category.toLowerCase().includes(normalized)
            )
            .slice(0, 5)
            .map(product => ({
                name: product.name,
                category: product.category,
                id: product.id
            }));
    };

    // Public API
    return {
        // Get current search query
        getCurrentQuery: () => currentQuery,

        // Set current search query
        setCurrentQuery: (query) => {
            currentQuery = normalizeQuery(query);
        },

        // Get search query from URL
        getQueryFromURL: () => {
            const params = new URLSearchParams(window.location.search);
            return params.get('search') || '';
        },

        // Search products
        search: (products, query) => {
            const normalized = normalizeQuery(query);
            if (!normalized) return products;

            return products.filter(product =>
                product.name.toLowerCase().includes(normalized) ||
                product.category.toLowerCase().includes(normalized)
            );
        },

        // Get suggestions
        getSuggestions: async (query, products = null) => {
            const normalized = normalizeQuery(query);

            // Check cache
            if (searchCache[normalized]) {
                return searchCache[normalized];
            }

            let suggestions = [];
            
            if (products) {
                suggestions = generateSuggestions(query, products);
            } else {
                // Fallback to predefined suggestions
                const sampleProducts = [
                    { name: 'Wireless Headphones', category: 'Audio' },
                    { name: 'Smart Watch Pro', category: 'Wearables' },
                    { name: '4K Webcam Ultra', category: 'Video' },
                    { name: 'Portable Charger 50K', category: 'Accessories' },
                    { name: 'USB-C Hub Pro', category: 'Accessories' },
                    { name: 'Mechanical Keyboard', category: 'Computing' },
                    { name: 'Wireless Mouse', category: 'Computing' },
                    { name: 'Monitor Light Bar', category: 'Video' },
                    { name: 'Bluetooth Speaker', category: 'Audio' },
                    { name: 'Fitness Tracker', category: 'Wearables' }
                ];
                suggestions = generateSuggestions(query, sampleProducts);
            }

            // Cache results
            searchCache[normalized] = suggestions;
            return suggestions;
        },

        // Render suggestions dropdown
        renderSuggestions: (suggestions, container) => {
            if (!container) return;

            if (!suggestions || suggestions.length === 0) {
                container.style.display = 'none';
                return;
            }

            let html = '';
            suggestions.forEach(suggestion => {
                html += `
                    <div class="suggestion-item" onclick="SearchManager.selectSuggestion('${suggestion.name}')">
                        <div class="suggestion-item-name">${suggestion.name}</div>
                        <div class="suggestion-item-category">${suggestion.category}</div>
                    </div>
                `;
            });

            container.innerHTML = html;
            container.style.display = 'block';
        },

        // Select suggestion and search
        selectSuggestion: (productName) => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = productName;
                SearchManager.performSearch(productName);
            }
        },

        // Perform search and redirect
        performSearch: (query) => {
            if (!query.trim()) {
                showNotification('Please enter a search term', 'error');
                return;
            }

            sessionStorage.setItem('searchQuery', query);
            window.location.href = 'products.html?search=' + encodeURIComponent(query);
        },

        // Highlight search keywords in text
        highlightKeywords: (text, query) => {
            if (!query) return text;
            const terms = normalizeQuery(query).split(/\s+/).filter(Boolean);
            if (terms.length === 0) return text;
            const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            const regex = new RegExp('(' + escaped.join('|') + ')', 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        },

        // Clear search cache
        clearCache: () => {
            searchCache = {};
        }
    };
})();
