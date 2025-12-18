/* ========================================
   FILTERS & SORTER MODULE
   Handles product filtering and sorting
   ======================================== */

const FiltersSorter = (() => {
    // Private helper: filter by category
    const filterByCategory = (products, categories) => {
        if (!categories || categories.length === 0) return products;
        return products.filter(product => 
            categories.map(c => c.toLowerCase()).includes(product.category.toLowerCase())
        );
    };

    // Private helper: filter by rating
    const filterByRating = (products, minRating) => {
        if (!minRating) return products;
        return products.filter(product => product.rating >= minRating);
    };

    // Private helper: filter by price range
    const filterByPrice = (products, minPrice, maxPrice) => {
        if (!minPrice && !maxPrice) return products;
        return products.filter(product => {
            if (minPrice && product.price < minPrice) return false;
            if (maxPrice && product.price > maxPrice) return false;
            return true;
        });
    };

    // Private helper: sort products
    const sortProducts = (products, sortType) => {
        const sorted = [...products];
        
        switch(sortType) {
            case 'price-low':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                sorted.sort((a, b) => b.id - a.id);
                break;
            case 'popular':
                sorted.sort((a, b) => b.reviews - a.reviews);
                break;
            default: // alphabetical
                sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        return sorted;
    };

    // Public API
    return {
        // Apply all filters
        applyFilters: (products, filters = {}) => {
            let filtered = [...products];
            
            if (filters.categories) {
                filtered = filterByCategory(filtered, filters.categories);
            }
            
            if (filters.minRating) {
                filtered = filterByRating(filtered, filters.minRating);
            }
            
            if (filters.minPrice || filters.maxPrice) {
                filtered = filterByPrice(filtered, filters.minPrice, filters.maxPrice);
            }
            
            if (filters.searchQuery) {
                filtered = filtered.filter(product =>
                    product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                    product.category.toLowerCase().includes(filters.searchQuery.toLowerCase())
                );
            }
            
            return filtered;
        },

        // Sort products
        sort: (products, sortType = 'popular') => {
            return sortProducts(products, sortType);
        },

        // Get unique categories from products
        getCategories: (products) => {
            const categories = new Set();
            products.forEach(p => categories.add(p.category));
            return Array.from(categories).sort();
        },

        // Get price range
        getPriceRange: (products) => {
            if (products.length === 0) return { min: 0, max: 0 };
            const prices = products.map(p => p.price);
            return {
                min: Math.min(...prices),
                max: Math.max(...prices)
            };
        },

        // Get rating options
        getRatingOptions: () => {
            return [
                { value: 5, label: '5 Stars' },
                { value: 4, label: '4+ Stars' },
                { value: 3, label: '3+ Stars' },
                { value: 2, label: '2+ Stars' },
                { value: 1, label: '1+ Star' }
            ];
        },

        // Get sort options
        getSortOptions: () => {
            return [
                { value: 'popular', label: 'Most Popular' },
                { value: 'newest', label: 'Newest' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
                { value: 'rating', label: 'Highest Rated' }
            ];
        }
    };
})();
