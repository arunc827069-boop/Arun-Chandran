// Login Page Logic

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (Auth.isAuthenticated()) {
        window.location.href = 'designer.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const signupLink = document.getElementById('signupLink');

    // Admin credentials (email-based, private - not available to regular users)
    const adminEmail = 'arunc827034@gmail.com';
    const adminPassword = 'Arunc23102005';

    // Demo users (in a real app, this would connect to a backend)
    const demoUsers = {
        'admin': 'admin123',
        'user': 'user123',
        'demo': 'demo123',
        'arun': 'arun123'
    };

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const usernameOrEmail = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Check admin credentials (email-based, private)
        // Only allow login with email, not username
        if (usernameOrEmail.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
            errorMessage.style.display = 'none';
            // Use email as username for admin
            Auth.setUserSession(adminEmail, rememberMe);
            localStorage.setItem('queen_ai_user_role', 'admin');
            localStorage.setItem('queen_ai_user_plan', 'admin');
            localStorage.setItem('queen_ai_admin_email', adminEmail);
            sessionStorage.setItem('fromLogin', 'true');
            
            // Check if redirect is needed
            const redirectTo = sessionStorage.getItem('redirectAfterLogin');
            if (redirectTo) {
                sessionStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectTo;
            } else {
                // Default: Admin goes to home page
                window.location.href = 'home.html';
            }
            return;
        }


        // Check demo users
        if (demoUsers[usernameOrEmail.toLowerCase()] && demoUsers[usernameOrEmail.toLowerCase()] === password) {
            errorMessage.style.display = 'none';
            Auth.setUserSession(usernameOrEmail, rememberMe);
            localStorage.setItem('queen_ai_user_plan', 'demo');
            sessionStorage.setItem('fromLogin', 'true');
            
            // Check if redirect is needed
            const redirectTo = sessionStorage.getItem('redirectAfterLogin');
            if (redirectTo) {
                sessionStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectTo;
            } else {
                // Default: All users go to home page after login
                window.location.href = 'home.html';
            }
            return;
        }

        // Check registered users from localStorage
        const users = JSON.parse(localStorage.getItem('queen_ai_users') || '{}');
        // Try username first
        let user = users[usernameOrEmail.toLowerCase()];
        
        // If not found, try by email
        if (!user) {
            for (const key in users) {
                if (users[key].email && users[key].email.toLowerCase() === usernameOrEmail.toLowerCase()) {
                    // Prevent using admin email for regular user accounts
                    if (users[key].email.toLowerCase() === adminEmail.toLowerCase()) {
                        errorMessage.textContent = 'Invalid credentials.';
                        errorMessage.style.display = 'block';
                        return;
                    }
                    user = users[key];
                    break;
                }
            }
        } else {
            // Prevent using admin email for regular user accounts
            if (user.email && user.email.toLowerCase() === adminEmail.toLowerCase()) {
                errorMessage.textContent = 'Invalid credentials.';
                errorMessage.style.display = 'block';
                return;
            }
        }

        if (user && user.password === password) {
            // Check subscription expiry
            const now = new Date();
            const expiryDate = new Date(user.subscriptionEnd);

            if (expiryDate > now || user.plan === 'lifetime') {
                errorMessage.style.display = 'none';
                Auth.setUserSession(usernameOrEmail, rememberMe);
                localStorage.setItem('queen_ai_user_plan', user.plan);
                localStorage.setItem('queen_ai_subscription_end', user.subscriptionEnd);
                sessionStorage.setItem('fromLogin', 'true');
                
                // Check if redirect is needed
                const redirectTo = sessionStorage.getItem('redirectAfterLogin');
                if (redirectTo) {
                    sessionStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirectTo;
                } else {
                    // Default: All users go to home page after login
                    window.location.href = 'home.html';
                }
                return;
            } else {
                errorMessage.textContent = 'Your subscription has expired. Please renew your plan.';
                errorMessage.style.display = 'block';
                return;
            }
        }

        // Invalid credentials
        errorMessage.textContent = 'Invalid username or password.';
        errorMessage.style.display = 'block';
    });


    // Allow Enter key to submit
    document.getElementById('username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('password').focus();
        }
    });

    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});
