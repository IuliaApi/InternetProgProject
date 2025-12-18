/* ========================================
   PROFILE PAGE JAVASCRIPT
   ======================================== */

function showTab(tabName, evt) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.profile-tab');
    tabs.forEach(tab => tab.style.display = 'none');
    
    // Remove active from all buttons
    const buttons = document.querySelectorAll('.profile-menu-item');
    buttons.forEach(btn => {
        btn.style.backgroundColor = '';
        btn.style.borderLeftColor = 'transparent';
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }
    
    // Highlight button
    if (evt && evt.target) {
        evt.target.style.backgroundColor = 'var(--primary-color)';
        evt.target.style.color = 'var(--white)';
        evt.target.style.borderLeftColor = 'var(--white)';
        evt.target.classList.add('active');
    }
}

async function loadProfileData() {
    const current = getCurrentUser();
    if (!current) {
        window.location.href = 'login.html';
        return;
    }
    
    // Fetch example user from Reqres
    let apiUser = null;
    try {
        const resp = await fetch('https://reqres.in/api/users/2');
        const data = await resp.json();
        if (resp.ok && data.data) {
            apiUser = {
                firstName: data.data.first_name,
                lastName: data.data.last_name,
                email: data.data.email,
                avatar: data.data.avatar,
                memberSince: 'January 2025'
            };
        }
    } catch (e) {
        // ignore network errors, we will fallback
    }
    
    // Cookie override
    const overridesRaw = typeof getCookie === 'function' ? getCookie('profileData') : null;
    let overrides = null;
    try { overrides = overridesRaw ? JSON.parse(overridesRaw) : null; } catch (e) {}
    
    const base = apiUser || {
        firstName: current.firstName || 'John',
        lastName: current.lastName || 'Doe',
        email: current.email || 'user@reqres.in',
        avatar: null,
        memberSince: 'January 2025'
    };
    const merged = {
        ...base,
        ...(overrides || {})
    };
    
    renderProfile(merged);
}

function renderProfile(profile) {
    const name = `${profile.firstName} ${profile.lastName}`.trim();
    document.getElementById('profileName').textContent = name || 'User';
    document.getElementById('profileEmail').textContent = profile.email || '';
    // Bind form fields
    const fn = document.getElementById('pfFirstName');
    const ln = document.getElementById('pfLastName');
    const em = document.getElementById('pfEmail');
    const ph = document.getElementById('pfPhone');
    if (fn) fn.value = profile.firstName || '';
    if (ln) ln.value = profile.lastName || '';
    if (em) em.value = profile.email || '';
    if (ph) ph.value = profile.phone || '';
}

function editProfile() {
    toggleFormEditable(true);
}

function saveProfile() {
    const fn = document.getElementById('pfFirstName').value.trim();
    const ln = document.getElementById('pfLastName').value.trim();
    const em = document.getElementById('pfEmail').value.trim();
    const ph = document.getElementById('pfPhone').value.trim();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fn || !ln) { showNotification('Please enter your full name', 'error'); return; }
    if (!emailRegex.test(em)) { showNotification('Please enter a valid email address', 'error'); return; }
    
    const payload = { firstName: fn, lastName: ln, email: em, phone: ph };
    if (typeof setCookie === 'function') setCookie('profileData', JSON.stringify(payload), 7);
    renderProfile(payload);
    showNotification('Profile updated');
    toggleFormEditable(false);
}

function cancelEdit() {
    // Reload from cookie or last render
    const overridesRaw = typeof getCookie === 'function' ? getCookie('profileData') : null;
    let overrides = null;
    try { overrides = overridesRaw ? JSON.parse(overridesRaw) : null; } catch (e) {}
    if (overrides) renderProfile(overrides);
    toggleFormEditable(false);
}

function toggleFormEditable(editable) {
    ['pfFirstName','pfLastName','pfEmail','pfPhone'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.disabled = !editable;
            input.style.backgroundColor = editable ? '#ffffff' : '#f8f9fa';
        }
    });
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    if (editBtn) editBtn.style.display = editable ? 'none' : 'inline-block';
    if (saveBtn) saveBtn.style.display = editable ? 'inline-block' : 'none';
    if (cancelBtn) cancelBtn.style.display = editable ? 'inline-block' : 'none';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!requireLogin()) return;
    showTab('profile');
    loadProfileData();
});
