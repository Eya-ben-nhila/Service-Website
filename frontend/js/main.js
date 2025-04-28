// Main JavaScript file for handling interactive features

// Toggle mobile navigation menu
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

// Form validation
function validateForm(formElement) {
    const emailInput = formElement.querySelector('input[type="email"]');
    const passwordInput = formElement.querySelector('input[type="password"]');
    let isValid = true;

    if (emailInput && !emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }

    if (passwordInput && passwordInput.value.length < 6) {
        showError(passwordInput, 'Password must be at least 6 characters long');
        isValid = false;
    }

    return isValid;
}

function showError(input, message) {
    const errorDiv = input.parentElement.querySelector('.error-message') || 
                    document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    if (!input.parentElement.querySelector('.error-message')) {
        input.parentElement.appendChild(errorDiv);
    }
}