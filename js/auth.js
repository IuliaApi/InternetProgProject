/* ========================================
   AUTHENTICATION SYSTEM
   ======================================== */

// ========================================
// USER MANAGEMENT
// ========================================

// Cookie helpers
function setCookie(name, value, days) {
    const expires = days ? "; expires=" + new Date(Date.now() + days*24*60*60*1000).toUTCString() : "";
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

// Get current user from session or cookie token
function getCurrentUser() {
    const user = sessionStorage.getItem('currentUser');
    if (user) return JSON.parse(user);
    const token = getCookie('authToken');
    const email = sessionStorage.getItem('currentEmail');
    return token ? { email: email || 'user@reqres.in', token } : null;
}

// Get all users from storage
function getAllUsers() {
    const users = localStorage.getItem('techhubUsers');
    return users ? JSON.parse(users) : [];
}

// Save user to storage
function saveUserToStorage(user) {
    let users = getAllUsers();
    const existingIndex = users.findIndex(u => u.email === user.email);
    
    if (existingIndex > -1) {
        users[existingIndex] = user;
    } else {
        users.push(user);
    }
    
    localStorage.setItem('techhubUsers', JSON.stringify(users));
}

// Initialize default demo user
function initializeDemoUser() {
    const users = getAllUsers();
    const demoExists = users.some(u => u.email === 'demo@example.com');
    
    if (!demoExists) {
        const demoUser = {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'demo@example.com',
            password: 'password123', // In real app, this would be hashed
            phone: '+1 (555) 123-4567',
            createdAt: new Date().toISOString()
        };
        saveUserToStorage(demoUser);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDemoUser();
    updateAuthUI();
});

// ========================================
// LOGIN FUNCTIONALITY
// ========================================

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember')?.checked;
    
    // Front-end validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    if (!password || password.length < 4) {
        showNotification('Please enter your password', 'error');
        return;
    }
    
    // Try Reqres API login
    try {
        const resp = await fetch('https://reqres.in/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await resp.json();
        if (resp.ok && data.token) {
            // Save token to cookie
            setCookie('authToken', data.token, remember ? 7 : undefined);
            sessionStorage.setItem('currentEmail', email);
            
            // Minimal currentUser session for UI
            sessionStorage.setItem('currentUser', JSON.stringify({ email, token: data.token }));
            
            showNotification('Login successful!');
            setTimeout(() => { window.location.href = 'index.html'; }, 800);
            return;
        }
    } catch (e) {
        // Network or other error; fall through to local login
    }
    
    // Fallback: local demo user support
    const users = getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        const sessionUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone
        };
        sessionStorage.setItem('currentUser', JSON.stringify(sessionUser));
        showNotification('Welcome back, ' + user.firstName + '!');
        setTimeout(() => { window.location.href = 'index.html'; }, 800);
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

// ========================================
// REGISTER FUNCTIONALITY
// ========================================

async function handleRegister(event) {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.getElementById('terms')?.checked;
    
    // JS validation
    if (!firstName || !lastName) {
        showNotification('Please enter your full name', 'error');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    if (!termsAccepted) {
        showNotification('Please accept the terms & conditions', 'error');
        return;
    }
    
    // Call Reqres register API
    try {
        const resp = await fetch('https://reqres.in/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await resp.json();
        if (resp.ok && data.token) {
            // Optionally store basic user for local fallback
            const users = getAllUsers();
            const newUser = {
                id: data.id || (users.length + 1),
                firstName,
                lastName,
                email,
                password,
                phone: '',
                createdAt: new Date().toISOString()
            };
            saveUserToStorage(newUser);
            
            showNotification('Registration successful! Redirecting to login...');
            setTimeout(() => { window.location.href = 'login.html'; }, 1200);
            return;
        } else {
            const errMsg = data.error || 'Registration failed. Please try again.';
            showNotification(errMsg, 'error');
        }
    } catch (e) {
        showNotification('Network error. Please try again.', 'error');
    }
}

// ========================================
// LOGOUT FUNCTIONALITY
// ========================================

function logout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentEmail');
    deleteCookie('authToken');
    localStorage.removeItem('techhubCart');
    showNotification('Logged out successfully');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// ========================================
// AUTH UI UPDATES
// ========================================

function updateAuthUI() {
    const user = getCurrentUser();
    
    // Update navbar auth items
    const cartNavItem = document.getElementById('cartNavItem');
    const loginNavItem = document.getElementById('loginNavItem');
    
    if (cartNavItem && loginNavItem) {
        if (user) {
            // User is logged in
            cartNavItem.style.display = 'block';
            const nameLabel = user.firstName ? user.firstName : (user.email || 'Account');
            loginNavItem.innerHTML = `<a href="profile.html">👤 ${nameLabel}</a>`;
            
            // Update cart count
            updateCartCount();
        } else {
            // User is not logged in
            cartNavItem.style.display = 'none';
            loginNavItem.innerHTML = '<a href="login.html">Login</a>';
        }
    }
}

// ========================================
// PROTECTED PAGES
// ========================================

function requireLogin() {
    const user = getCurrentUser();
    const token = getCookie('authToken');
    if (!user && !token) {
        // Redirect to login
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

function checkLoginOnPageLoad() {
    const currentPage = window.location.pathname;
    const protectedPages = ['cart.html', 'checkout.html', 'order-confirmation.html', 'profile.html'];
    
    const isProtectedPage = protectedPages.some(page => currentPage.includes(page));
    
    if (isProtectedPage && !getCurrentUser()) {
        window.location.href = 'login.html';
    }
}

// Check on page load
document.addEventListener('DOMContentLoaded', function() {
    checkLoginOnPageLoad();
});

// ========================================
// ERROR NOTIFICATION
// ========================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    const bgColor = type === 'error' ? '#dc3545' : '#28a745';
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: ${bgColor};
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
    }, 3000);
}

// Export functions for other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentUser,
        logout,
        requireLogin,
        handleLogin,
        handleRegister
    };
}
