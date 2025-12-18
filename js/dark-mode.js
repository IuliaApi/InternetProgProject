// ========================================
// DARK MODE TOGGLE
// ========================================

class DarkModeManager {
    constructor() {
        this.storageKey = 'techhub-theme';
        this.darkModeClass = 'dark-mode';
        this.init();
    }

    init() {
        // Check localStorage for saved preference
        const savedTheme = localStorage.getItem(this.storageKey);
        
        // Check system preference if no saved preference
        if (savedTheme) {
            this.setTheme(savedTheme === 'dark');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.setTheme(true);
        }

        // Setup event listeners
        this.setupToggleButton();
        this.setupSystemPreferenceListener();
    }

    setupToggleButton() {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggle());
        }
    }

    setupSystemPreferenceListener() {
        // Listen for system theme preference changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(this.storageKey)) {
                    this.setTheme(e.matches);
                }
            });
        }
    }

    toggle() {
        const isDark = document.documentElement.classList.contains(this.darkModeClass);
        this.setTheme(!isDark);
    }

    setTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add(this.darkModeClass);
            localStorage.setItem(this.storageKey, 'dark');
            this.updateToggleIcon(true);
        } else {
            document.documentElement.classList.remove(this.darkModeClass);
            localStorage.setItem(this.storageKey, 'light');
            this.updateToggleIcon(false);
        }
    }

    updateToggleIcon(isDark) {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.textContent = isDark ? '☀️' : '🌙';
            toggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        }
    }
}

// Initialize dark mode when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DarkModeManager();
    });
} else {
    new DarkModeManager();
}
