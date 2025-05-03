// Email validation regex pattern
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Indonesian phone number validation regex pattern
const phoneRegex = /^\+62[0-9]{9,12}$/;

// Regex to check if name contains numbers
const nameContainsNumberRegex = /\d/;

// Validator functions
const validator = {
    // Validate name
    validateName: (name) => {
        if (!name || name.trim() === '') {
            return 'Nama harus diisi';
        }

        if (name.length < 3) {
            return 'Nama minimal harus 3 karakter';
        }

        if (name.length > 50) {
            return 'Nama maksimal 50 karakter';
        }

        if (nameContainsNumberRegex.test(name)) {
            return 'Nama tidak boleh mengandung angka';
        }

        return null; // no error
    },

    // Validate email
    validateEmail: (email) => {
        if (!email || email.trim() === '') {
            return 'Email harus diisi';
        }

        if (!emailRegex.test(email)) {
            return 'Format email tidak valid';
        }

        return null; // no error
    },

    // Validate phone number
    validatePhone: (phone) => {
        if (!phone || phone.trim() === '') {
            return 'Nomor telepon harus diisi';
        }

        if (!phoneRegex.test(phone)) {
            return 'Format nomor telepon tidak valid (gunakan format +628xxxxxxxxxx)';
        }

        return null; // no error
    },

    // Validate entire customer form
    validateCustomerForm: (customerData) => {
        const { name, email, phone_number } = customerData;
        const errors = {};

        const nameError = validator.validateName(name);
        if (nameError) errors.name = nameError;

        const emailError = validator.validateEmail(email);
        if (emailError) errors.email = emailError;

        const phoneError = validator.validatePhone(phone_number);
        if (phoneError) errors.phone_number = phoneError;

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
};

export default validator;