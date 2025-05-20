document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const modal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close');

    // Toggle between sign up and sign in forms
    signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Check if user is already logged in
    checkLoggedIn();

    // Sign up form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const bankAccountName = document.getElementById('bankAccountName').value;
        
        // Save user data to localStorage
        const user = {
            username,
            email,
            password,
            bankAccountName,
            tasksCompleted: 0,
            earnings: 0
        };
        
        localStorage.setItem(username, JSON.stringify(user));
        
        // Save list of users
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(username);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success message
        document.getElementById('modalTitle').textContent = 'Success!';
        document.getElementById('modalMessage').textContent = 'Account created successfully. You can now login.';
        modal.style.display = 'block';
        
        // Reset form
        signupForm.reset();
        
        // Switch to login form
        container.classList.remove('right-panel-active');
    });

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        // Check if user exists
        const user = JSON.parse(localStorage.getItem(username));
        
        if (user && user.password === password) {
            // Save current user session
            localStorage.setItem('currentUser', username);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            document.getElementById('modalTitle').textContent = 'Error';
            document.getElementById('modalMessage').textContent = 'Invalid username or password. Please try again.';
            modal.style.display = 'block';
        }
    });

    // Check if user is already logged in
    function checkLoggedIn() {
        if (localStorage.getItem('currentUser')) {
            window.location.href = 'dashboard.html';
        }
    }
});

// Sample dashboard.html content would go here
// For completeness, you would create a dashboard.html file with tasks and earnings displa
