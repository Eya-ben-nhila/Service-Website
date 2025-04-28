// Constants
const API_URL = 'http://localhost:3000/api';

// Utility functions
const setToken = (token) => {
    localStorage.setItem('token', token);
};

const getToken = () => {
    return localStorage.getItem('token');
};

const removeToken = () => {
    localStorage.removeItem('token');
};

const redirectToDashboard = (userType) => {
    switch(userType) {
        case 'customer':
            window.location.href = 'customer-dashboard.html';
            break;
        case 'provider':
            window.location.href = 'provider-dashboard.html';
            break;
        case 'admin':
            window.location.href = 'admin-dashboard.html';
            break;
        default:
            window.location.href = 'customer-dashboard.html';
    }
};

// Form validation
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePassword = (password) => {
    return password.length >= 8;
};

const showError = (element, message) => {
    const formGroup = element.parentElement;
    const errorDiv = formGroup.querySelector('.error-message') || document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    element.classList.add('error');
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(errorDiv);
    }
};

const clearError = (element) => {
    const formGroup = element.parentElement;
    const errorDiv = formGroup.querySelector('.error-message');
    if (errorDiv) {
        formGroup.removeChild(errorDiv);
    }
    element.classList.remove('error');
};

// Login functionality
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const remember = document.getElementById('remember');
        
        // Clear previous errors
        clearError(email);
        clearError(password);
        
        // Validate inputs
        let hasError = false;
        
        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            hasError = true;
        }
        
        if (!validatePassword(password.value)) {
            showError(password, 'Password must be at least 8 characters long');
            hasError = true;
        }
        
        if (hasError) return;
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value,
                    remember: remember.checked
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setToken(data.token);
                redirectToDashboard(data.userType);
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            alert(error.message || 'An error occurred during login. Please try again.');
        }
    });
}

// Social login handlers
const handleGoogleLogin = async () => {
    try {
        // Initialize Google Sign-In
        const auth2 = await gapi.auth2.getAuthInstance();
        const googleUser = await auth2.signIn();
        
        // Get the ID token
        const idToken = googleUser.getAuthResponse().id_token;
        
        // Send to backend
        const response = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: idToken })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setToken(data.token);
            redirectToDashboard(data.userType);
        } else {
            throw new Error(data.message || 'Google login failed');
        }
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        alert('Google sign-in failed. Please try again.');
    }
};

const handleFacebookLogin = async () => {
    try {
        // Initialize Facebook Login
        const response = await new Promise((resolve, reject) => {
            FB.login((response) => {
                if (response.authResponse) {
                    resolve(response);
                } else {
                    reject(new Error('Facebook login cancelled'));
                }
            }, { scope: 'email,public_profile' });
        });
        
        // Send to backend
        const apiResponse = await fetch(`${API_URL}/auth/facebook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                accessToken: response.authResponse.accessToken
            })
        });
        
        const data = await apiResponse.json();
        
        if (apiResponse.ok) {
            setToken(data.token);
            redirectToDashboard(data.userType);
        } else {
            throw new Error(data.message || 'Facebook login failed');
        }
    } catch (error) {
        console.error('Facebook Login Error:', error);
        alert('Facebook login failed. Please try again.');
    }
};

// Add event listeners for social login buttons
document.querySelectorAll('.btn-social').forEach(button => {
    button.addEventListener('click', (e) => {
        const provider = e.currentTarget.textContent.toLowerCase().includes('google') ? 'google' : 'facebook';
        if (provider === 'google') {
            handleGoogleLogin();
        } else {
            handleFacebookLogin();
        }
    });
});

// Signup functionality
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const userType = document.getElementById('userType');
        const terms = document.getElementById('terms');
        
        // Clear previous errors
        [name, email, password, confirmPassword].forEach(clearError);
        
        // Validate inputs
        let hasError = false;
        
        if (name.value.trim().length < 2) {
            showError(name, 'Name must be at least 2 characters long');
            hasError = true;
        }
        
        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            hasError = true;
        }
        
        if (!validatePassword(password.value)) {
            showError(password, 'Password must be at least 8 characters long');
            hasError = true;
        }
        
        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match');
            hasError = true;
        }
        
        if (!terms.checked) {
            alert('Please accept the Terms of Service and Privacy Policy');
            hasError = true;
        }
        
        if (hasError) return;
        
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.value.trim(),
                    email: email.value,
                    password: password.value,
                    userType: userType.value
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setToken(data.token);
                redirectToDashboard(data.userType);
            } else {
                throw new Error(data.message || 'Signup failed');
            }
        } catch (error) {
            alert(error.message || 'An error occurred during signup. Please try again.');
        }
    });
}

// Password strength indicator
const passwordInput = document.getElementById('password');
if (passwordInput) {
    const createStrengthIndicator = () => {
        const strengthDiv = document.createElement('div');
        strengthDiv.className = 'password-strength';
        strengthDiv.innerHTML = `
            <div class="strength-bars">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>
            <span class="strength-text">Password strength: Too weak</span>
        `;
        passwordInput.parentElement.appendChild(strengthDiv);
        return strengthDiv;
    };

    const strengthIndicator = createStrengthIndicator();
    
    const checkPasswordStrength = (password) => {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        
        // Contains number
        if (/\d/.test(password)) strength++;
        
        // Contains letter
        if (/[a-zA-Z]/.test(password)) strength++;
        
        // Contains special character
        if (/[!@#$%^&*]/.test(password)) strength++;
        
        const bars = strengthIndicator.querySelectorAll('.bar');
        const strengthText = strengthIndicator.querySelector('.strength-text');
        
        bars.forEach((bar, index) => {
            if (index < strength) {
                bar.classList.add('active');
            } else {
                bar.classList.remove('active');
            }
        });
        
        const strengthLabels = ['Too weak', 'Weak', 'Medium', 'Strong'];
        strengthText.textContent = `Password strength: ${strengthLabels[strength - 1] || 'Too weak'}`;
        
        return strength;
    };
    
    passwordInput.addEventListener('input', (e) => {
        checkPasswordStrength(e.target.value);
    });
}

// Add password strength indicator styles
const style = document.createElement('style');
style.textContent = `
    .password-strength {
        margin-top: 0.5rem;
    }
    
    .strength-bars {
        display: flex;
        gap: 5px;
        margin-bottom: 0.25rem;
    }
    
    .bar {
        height: 4px;
        flex: 1;
        background: var(--border-color);
        border-radius: 2px;
        transition: background 0.3s ease;
    }
    
    .bar.active:nth-child(1) { background: #ff4444; }
    .bar.active:nth-child(2) { background: #ffbb33; }
    .bar.active:nth-child(3) { background: #00C851; }
    .bar.active:nth-child(4) { background: #007E33; }
    
    .strength-text {
        font-size: 0.8rem;
        color: var(--text-muted);
    }
`;
document.head.appendChild(style);

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = getToken();
    const publicPages = ['login.html', 'signup.html', 'index.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!token && !publicPages.includes(currentPage)) {
        window.location.href = 'login.html';
    } else if (token && publicPages.includes(currentPage)) {
        // Verify token and redirect to appropriate dashboard
        fetch(`${API_URL}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                redirectToDashboard(data.userType);
            } else {
                removeToken();
            }
        })
        .catch(() => {
            removeToken();
        });
    }
});