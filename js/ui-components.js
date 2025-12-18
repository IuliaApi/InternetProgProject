/* ========================================
   UI COMPONENTS MODULE
   Handles modals, menus, sliders, and UI interactions
   ======================================== */

const UIComponents = (() => {
    // Private: active modals tracker
    const activeModals = new Set();

    // Private: create modal HTML
    const createModalHTML = (id, title, content, actions = []) => {
        let actionsHTML = '';
        actions.forEach(action => {
            actionsHTML += `<button class="btn btn-${action.type}" onclick="${action.onclick}">${action.label}</button>`;
        });

        return `
            <div id="${id}" class="modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="modal-close" onclick="UIComponents.closeModal('${id}')">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        ${actionsHTML}
                    </div>
                </div>
            </div>
        `;
    };

    // Public API
    return {
        // Open modal with fade-in animation
        openModal: (modalId) => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                modal.style.animation = 'fadeIn 0.3s ease-in';
                activeModals.add(modalId);
            }
        },

        // Close modal with fade-out animation
        closeModal: (modalId) => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    modal.style.display = 'none';
                    activeModals.delete(modalId);
                }, 300);
            }
        },

        // Close all open modals
        closeAllModals: () => {
            activeModals.forEach(modalId => {
                UIComponents.closeModal(modalId);
            });
        },

        // Create and show modal
        showModal: (options = {}) => {
            const {
                id = 'modal-' + Date.now(),
                title = 'Modal',
                content = '',
                actions = [
                    { label: 'Close', type: 'secondary', onclick: `UIComponents.closeModal('${id}')` }
                ]
            } = options;

            // Check if modal already exists
            let modal = document.getElementById(id);
            if (!modal) {
                const modalHTML = createModalHTML(id, title, content, actions);
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                modal = document.getElementById(id);
            }

            UIComponents.openModal(id);
            return id;
        },

        // Toggle menu visibility
        toggleMenu: (menuClass) => {
            const menu = document.querySelector(`.${menuClass}`);
            if (menu) {
                menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
            }
        },

        // Toggle hamburger menu
        toggleHamburger: () => {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            if (hamburger && navMenu) {
                navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
                hamburger.classList.toggle('active');
            }
        },

        // Show notification/toast
        showNotification: (message, type = 'success') => {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.className = `notification notification-${type}`;
            notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#ffc107'};
                color: white;
                padding: 15px 25px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        },

        // Render carousel
        renderCarousel: (containerId, slides = [], autoRotate = true) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            let currentIndex = 0;

            const show = (index) => {
                const items = container.querySelectorAll('.carousel-item');
                const dots = container.querySelectorAll('.dot');

                items.forEach(item => item.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));

                items[index].classList.add('active');
                if (dots[index]) dots[index].classList.add('active');
            };

            return {
                next: () => {
                    currentIndex = (currentIndex + 1) % slides.length;
                    show(currentIndex);
                },
                prev: () => {
                    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                    show(currentIndex);
                },
                goto: (index) => {
                    currentIndex = index % slides.length;
                    show(currentIndex);
                },
                currentIndex: () => currentIndex
            };
        },

        // Render pagination
        renderPagination: (totalItems, itemsPerPage, currentPage, onPageChange) => {
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const container = document.querySelector('.pagination');
            
            if (!container) return;

            let html = '';
            
            // Previous button
            if (currentPage > 1) {
                html += `<button class="pagination-btn" onclick="if(typeof onPageChange==='function') onPageChange(${currentPage - 1})">← Previous</button>`;
            }

            // Page numbers
            for (let i = 1; i <= totalPages; i++) {
                if (i === currentPage) {
                    html += `<button class="pagination-btn active">${i}</button>`;
                } else {
                    html += `<button class="pagination-btn" onclick="if(typeof onPageChange==='function') onPageChange(${i})">${i}</button>`;
                }
            }

            // Next button
            if (currentPage < totalPages) {
                html += `<button class="pagination-btn" onclick="if(typeof onPageChange==='function') onPageChange(${currentPage + 1})">Next →</button>`;
            }

            container.innerHTML = html;
        },

        // Toggle element visibility
        toggleElement: (elementId) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.style.display = element.style.display === 'none' ? 'block' : 'none';
            }
        },

        // Scroll to element
        scrollToElement: (elementId, smooth = true) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
            }
        },

        // Show loading spinner
        showSpinner: (containerId) => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    </div>
                `;
            }
        },

        // Get active modals
        getActiveModals: () => Array.from(activeModals)
    };
})();
