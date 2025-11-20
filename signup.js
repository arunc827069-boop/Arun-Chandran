// Sign Up Page Logic

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (Auth.isAuthenticated()) {
        displayUserDetailsSignup();
        // Don't redirect, allow viewing plans even if logged in
    } else {
        // Hide user details if not logged in
        const userDetailsSignup = document.getElementById('userDetailsSignup');
        if (userDetailsSignup) {
            userDetailsSignup.style.display = 'none';
        }
    }

    // Display user details function
    function displayUserDetailsSignup() {
        const userDetailsSignup = document.getElementById('userDetailsSignup');
        const userNameSignup = document.getElementById('userNameSignup');
        const userPlanSignup = document.getElementById('userPlanSignup');
        const userAvatarSmallSignup = document.getElementById('userAvatarSmallSignup');
        
        if (Auth.isAuthenticated() && userDetailsSignup && userNameSignup && userPlanSignup && userAvatarSmallSignup) {
            userDetailsSignup.style.display = 'flex';
            
            const username = Auth.getCurrentUser();
            const userRole = localStorage.getItem('queen_ai_user_role');
            const userPlan = localStorage.getItem('queen_ai_user_plan') || 'trial';
            const subscriptionEnd = localStorage.getItem('queen_ai_subscription_end');
            
            // Set user name
            if (userRole === 'admin') {
                userNameSignup.textContent = 'Arun Chandran';
            } else {
                const users = JSON.parse(localStorage.getItem('queen_ai_users') || '{}');
                const user = users[username.toLowerCase()] || {};
                userNameSignup.textContent = user.fullname || username;
            }
            
            // Set user plan
            if (userRole === 'admin') {
                userPlanSignup.textContent = 'Admin';
            } else if (userPlan === 'lifetime') {
                userPlanSignup.textContent = 'Lifetime';
            } else if (subscriptionEnd) {
                const endDate = new Date(subscriptionEnd);
                const now = new Date();
                const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
                if (daysLeft > 0) {
                    userPlanSignup.textContent = `${userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} (${daysLeft}d)`;
                } else {
                    userPlanSignup.textContent = 'Expired';
                }
            } else {
                userPlanSignup.textContent = userPlan.charAt(0).toUpperCase() + userPlan.slice(1);
            }
            
            // Set avatar
            let initials = '';
            if (username.includes('@')) {
                initials = username.charAt(0).toUpperCase() + username.split('@')[1].charAt(0).toUpperCase();
            } else {
                initials = username.charAt(0).toUpperCase() + (username.charAt(1) || '').toUpperCase();
            }
            userAvatarSmallSignup.textContent = initials;
        }
    }

    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const selectedPlanInput = document.getElementById('selectedPlan');

    // Plan selection
    const planCards = document.querySelectorAll('.plan-card');
    const planSelectBtns = document.querySelectorAll('.plan-select-btn');

    planSelectBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const plan = this.dataset.plan;

            // Remove selected class from all cards
            planCards.forEach(card => card.classList.remove('selected'));

            // Add selected class to clicked card
            const card = this.closest('.plan-card');
            card.classList.add('selected');

            // Update hidden input
            selectedPlanInput.value = plan;
        });
    });

    // Set default plan (trial)
    const trialCard = document.querySelector('[data-plan="trial"]');
    if (trialCard) {
        trialCard.classList.add('selected');
    }

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Reset messages
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Get form values
        const fullname = document.getElementById('fullname').value.trim();
        const username = document.getElementById('signup-username').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const plan = selectedPlanInput.value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validation
        if (!agreeTerms) {
            errorMessage.textContent = 'Please agree to the Terms of Service and Privacy Policy.';
            errorMessage.style.display = 'block';
            return;
        }

        if (password.length < 6) {
            errorMessage.textContent = 'Password must be at least 6 characters long.';
            errorMessage.style.display = 'block';
            return;
        }

        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match.';
            errorMessage.style.display = 'block';
            return;
        }

        // Check if username already exists
        const users = JSON.parse(localStorage.getItem('queen_ai_users') || '{}');
        if (users[username.toLowerCase()]) {
            errorMessage.textContent = 'Username already exists. Please choose a different username.';
            errorMessage.style.display = 'block';
            return;
        }

        // Calculate subscription expiry
        const subscriptionData = calculateSubscriptionExpiry(plan);

        // Save user
        users[username.toLowerCase()] = {
            fullname: fullname,
            username: username,
            email: email,
            password: password,
            plan: plan,
            subscriptionStart: subscriptionData.startDate,
            subscriptionEnd: subscriptionData.endDate,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('queen_ai_users', JSON.stringify(users));

        // Auto login
        Auth.setUserSession(username, false);
        localStorage.setItem('queen_ai_user_plan', plan);
        localStorage.setItem('queen_ai_subscription_end', subscriptionData.endDate);

        // Show success message
        successMessage.textContent = 'Account created successfully! Redirecting to home...';
        successMessage.style.display = 'block';

        // Redirect to home page after signup
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
    });
});

// Calculate subscription expiry date
function calculateSubscriptionExpiry(plan) {
    const startDate = new Date();
    let endDate = new Date();

    switch (plan) {
        case 'trial':
            endDate.setDate(startDate.getDate() + 30); // 30 days free trial
            break;
        case 'monthly':
            endDate.setMonth(startDate.getMonth() + 1); // 1 month
            break;
        case 'yearly':
            endDate.setFullYear(startDate.getFullYear() + 1); // 1 year
            break;
        case 'lifetime':
            endDate.setFullYear(startDate.getFullYear() + 100); // Lifetime (100 years)
            break;
        default:
            endDate.setDate(startDate.getDate() + 30); // Default to trial
    }

    return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
    };
}
