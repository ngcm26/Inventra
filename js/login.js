document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Hide any existing messages
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
    
    // Simple validation
    if (!email || !password) {
        showError('Please fill in all fields.');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return;
    }
    
    // Simulate login process
    simulateLogin(email, password);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}

function simulateLogin(email, password) {
    // Show loading state
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.textContent;
    loginBtn.innerHTML = '<span class="loading-spinner"></span>Signing in...';
    loginBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // For demo purposes, accept any valid email format
        if (isValidEmail(email) && password.length >= 6) {
            // Immediately redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            showError('Invalid email or password. Please try again.');
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
        }
    }, 1500);
}

function forgotPassword() {
    alert('Password reset functionality would be implemented here.');
} 