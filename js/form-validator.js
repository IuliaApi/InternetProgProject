/* ========================================
   FORM VALIDATOR MODULE
   Handles form validation for various forms
   ======================================== */

const FormValidator = (() => {
    // Validation rules
    const validators = {
        email: (value) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(value.trim());
        },

        phone: (value) => {
            const digits = value.replace(/\D/g, '');
            return digits.length >= 10 && digits.length <= 15;
        },

        text: (value, minLength = 1) => {
            return value.trim().length >= minLength;
        },

        cardNumber: (value) => {
            const digits = value.replace(/\s/g, '');
            return digits.length === 16 && /^\d+$/.test(digits);
        },

        expiry: (value) => {
            return /^\d{2}\/\d{2}$/.test(value);
        },

        cvv: (value) => {
            return /^\d{3,4}$/.test(value);
        },

        password: (value) => {
            // At least 6 characters
            return value.length >= 6;
        },

        passwordMatch: (pwd1, pwd2) => {
            return pwd1 === pwd2;
        },

        url: (value) => {
            try {
                new URL(value);
                return true;
            } catch (e) {
                return false;
            }
        },

        number: (value) => {
            return !isNaN(value) && value !== '';
        },

        zipCode: (value) => {
            return /^\d{5}(-\d{4})?$/.test(value);
        }
    };

    // Public API
    return {
        // Validate single field
        validateField: (value, type, options = {}) => {
            if (!validators[type]) {
                console.warn(`Unknown validator type: ${type}`);
                return true;
            }

            if (type === 'passwordMatch') {
                return validators[type](value, options.compareValue);
            }

            if (options.minLength !== undefined && type === 'text') {
                return validators[type](value, options.minLength);
            }

            return validators[type](value);
        },

        // Validate checkout form
        validateCheckoutForm: (formData) => {
            const errors = {};

            // Address fields
            if (!formData.firstName?.trim()) errors.firstName = 'First name required';
            if (!formData.lastName?.trim()) errors.lastName = 'Last name required';
            if (!formData.address?.trim()) errors.address = 'Address required';
            if (!formData.city?.trim()) errors.city = 'City required';
            if (!formData.state?.trim()) errors.state = 'State required';
            if (!formData.zip?.trim()) errors.zip = 'ZIP code required';
            else if (!validators.zipCode(formData.zip?.trim())) errors.zip = 'Invalid ZIP code';

            // Email
            if (!formData.email?.trim()) errors.email = 'Email required';
            else if (!validators.email(formData.email)) errors.email = 'Invalid email address';

            // Phone
            if (!formData.phone?.trim()) errors.phone = 'Phone required';
            else if (!validators.phone(formData.phone)) errors.phone = 'Invalid phone number';

            // Card details
            if (!formData.cardNumber?.trim()) errors.cardNumber = 'Card number required';
            else if (!validators.cardNumber(formData.cardNumber)) errors.cardNumber = 'Invalid card number';

            if (!formData.expiry?.trim()) errors.expiry = 'Expiry required';
            else if (!validators.expiry(formData.expiry)) errors.expiry = 'Use MM/YY format';

            if (!formData.cvv?.trim()) errors.cvv = 'CVV required';
            else if (!validators.cvv(formData.cvv)) errors.cvv = 'Invalid CVV';

            // Terms
            if (!formData.terms) errors.terms = 'Please accept terms';

            return {
                isValid: Object.keys(errors).length === 0,
                errors: errors
            };
        },

        // Validate login form
        validateLoginForm: (email, password) => {
            const errors = {};

            if (!email?.trim()) errors.email = 'Email required';
            else if (!validators.email(email)) errors.email = 'Invalid email';

            if (!password?.trim()) errors.password = 'Password required';

            return {
                isValid: Object.keys(errors).length === 0,
                errors: errors
            };
        },

        // Validate registration form
        validateRegisterForm: (formData) => {
            const errors = {};

            if (!formData.firstName?.trim()) errors.firstName = 'First name required';
            if (!formData.lastName?.trim()) errors.lastName = 'Last name required';

            if (!formData.email?.trim()) errors.email = 'Email required';
            else if (!validators.email(formData.email)) errors.email = 'Invalid email';

            if (!formData.password?.trim()) errors.password = 'Password required';
            else if (!validators.password(formData.password)) errors.password = 'At least 6 characters';

            if (!formData.confirmPassword?.trim()) errors.confirmPassword = 'Confirm password';
            else if (!validators.passwordMatch(formData.password, formData.confirmPassword)) {
                errors.confirmPassword = 'Passwords do not match';
            }

            return {
                isValid: Object.keys(errors).length === 0,
                errors: errors
            };
        },

        // Validate contact form
        validateContactForm: (formData) => {
            const errors = {};

            if (!formData.name?.trim()) errors.name = 'Name required';
            if (!formData.email?.trim()) errors.email = 'Email required';
            else if (!validators.email(formData.email)) errors.email = 'Invalid email';

            if (!formData.subject?.trim()) errors.subject = 'Subject required';
            if (!formData.message?.trim()) errors.message = 'Message required';

            return {
                isValid: Object.keys(errors).length === 0,
                errors: errors
            };
        }
    };
})();
