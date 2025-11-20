// Subscription Page Logic

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!Auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // Display user details
    displayUserDetails();

    const currentPlanDisplay = document.getElementById('currentPlanDisplay');
    const paymentSection = document.getElementById('paymentSection');
    const planSelectBtns = document.querySelectorAll('.plan-select-btn');
    const cancelPaymentBtn = document.getElementById('cancelPayment');
    const confirmPaymentBtn = document.getElementById('confirmPayment');

    // Plan prices
    const planPrices = {
        trial: 0,
        monthly: 30,
        yearly: 300,
        lifetime: 1000
    };

    // Plan names
    const planNames = {
        trial: 'Free Trial',
        monthly: 'Monthly Plan',
        yearly: 'Yearly Plan',
        lifetime: 'Lifetime Plan'
    };

    // UPI Number
    const UPI_NUMBER = '9360218198';

    // Display current plan
    function displayCurrentPlan() {
        const userRole = localStorage.getItem('queen_ai_user_role');
        const userPlan = localStorage.getItem('queen_ai_user_plan') || 'trial';
        const subscriptionEnd = localStorage.getItem('queen_ai_subscription_end');
        const username = Auth.getCurrentUser();

        if (userRole === 'admin') {
            currentPlanDisplay.innerHTML = `
                <h4>Current Plan: Admin Account</h4>
                <p>Full access with admin privileges</p>
            `;
            currentPlanDisplay.className = 'current-plan active';
        } else {
            let planInfo = `<h4>Current Plan: ${planNames[userPlan] || 'Free Trial'}</h4>`;

            if (userPlan === 'lifetime') {
                planInfo += '<p>✓ Lifetime access - Never expires</p>';
            } else if (subscriptionEnd) {
                const endDate = new Date(subscriptionEnd);
                const now = new Date();
                const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

                if (daysLeft > 0) {
                    planInfo += `<p>Expires in: ${daysLeft} days (${endDate.toLocaleDateString()})</p>`;
                } else {
                    planInfo += `<p style="color: #e74c3c;">⚠️ Subscription Expired</p>`;
                }
            }

            currentPlanDisplay.innerHTML = planInfo;
            currentPlanDisplay.className = 'current-plan';
        }
    }

    // Generate UPI QR Code
    function generateUPIQR(amount) {
        // UPI payment URL format: upi://pay?pa=<UPI_ID>&pn=<Name>&am=<Amount>&cu=INR
        const upiId = `${UPI_NUMBER}@paytm`;
        const payeeName = 'The Queen AI';
        const transactionNote = 'Subscription Payment';
        
        // Create UPI payment string
        const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
        
        // Use QR code API to generate QR code
        // Using qr-server.com API for QR code generation
        const qrSize = 300;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(upiString)}`;
        
        return qrUrl;
    }

    // Show payment section
    function showPaymentSection(plan) {
        const amount = planPrices[plan];
        const planName = planNames[plan];

        // Update payment details
        document.getElementById('selectedPlanName').textContent = planName;
        document.getElementById('paymentAmount').textContent = amount;
        document.getElementById('upiAmount').textContent = amount;
        document.getElementById('manualAmount').textContent = amount;

        // Generate and display QR code
        const qrUrl = generateUPIQR(amount);
        const qrCodeDiv = document.getElementById('qrCode');
        qrCodeDiv.innerHTML = `<img src="${qrUrl}" alt="UPI QR Code" />`;

        // Show payment section
        paymentSection.style.display = 'block';
        paymentSection.scrollIntoView({ behavior: 'smooth' });

        // Store selected plan
        paymentSection.dataset.selectedPlan = plan;
    }

    // Plan selection
    planSelectBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const plan = this.dataset.plan;
            const currentPlan = localStorage.getItem('queen_ai_user_plan') || 'trial';

            // Don't show payment for free trial or if selecting current plan
            if (plan === 'trial' && currentPlan !== 'trial') {
                if (confirm('Switch to Free Trial? This will downgrade your current plan.')) {
                    updateSubscription(plan);
                }
                return;
            }

            if (plan === currentPlan && localStorage.getItem('queen_ai_user_role') !== 'admin') {
                alert('This is your current plan.');
                return;
            }

            // Show payment section for paid plans
            if (planPrices[plan] > 0) {
                showPaymentSection(plan);
            } else {
                updateSubscription(plan);
            }
        });
    });

    // Cancel payment
    if (cancelPaymentBtn) {
        cancelPaymentBtn.addEventListener('click', function() {
            paymentSection.style.display = 'none';
            paymentSection.dataset.selectedPlan = '';
        });
    }

    // Confirm payment
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', function() {
            const selectedPlan = paymentSection.dataset.selectedPlan;
            if (!selectedPlan) {
                alert('Please select a plan first.');
                return;
            }

            if (confirm('Have you completed the payment? Please ensure you have transferred the exact amount to the UPI number shown above.')) {
                updateSubscription(selectedPlan);
            }
        });
    }

    // Update subscription
    function updateSubscription(plan) {
        const username = Auth.getCurrentUser().toLowerCase();
        const users = JSON.parse(localStorage.getItem('queen_ai_users') || '{}');
        const user = users[username];

        // Calculate subscription expiry
        const subscriptionData = calculateSubscriptionExpiry(plan);

        if (user) {
            // Update existing user
            user.plan = plan;
            user.subscriptionStart = subscriptionData.startDate;
            user.subscriptionEnd = subscriptionData.endDate;
            user.updatedAt = new Date().toISOString();

            users[username] = user;
            localStorage.setItem('queen_ai_users', JSON.stringify(users));
        } else {
            // Create new subscription entry
            localStorage.setItem('queen_ai_user_plan', plan);
            localStorage.setItem('queen_ai_subscription_end', subscriptionData.endDate);
        }

        // Update localStorage
        localStorage.setItem('queen_ai_user_plan', plan);
        localStorage.setItem('queen_ai_subscription_end', subscriptionData.endDate);

        // Hide payment section
        paymentSection.style.display = 'none';

        // Refresh current plan display
        displayCurrentPlan();

        // Show success message
        alert(`Subscription updated to ${planNames[plan]}! Redirecting to designer...`);
        
        // Redirect after 1 second
        setTimeout(() => {
            window.location.href = 'designer.html';
        }, 1000);
    }

    // Calculate subscription expiry date
    function calculateSubscriptionExpiry(plan) {
        const startDate = new Date();
        let endDate = new Date();

        switch (plan) {
            case 'trial':
                endDate.setDate(startDate.getDate() + 30);
                break;
            case 'monthly':
                endDate.setMonth(startDate.getMonth() + 1);
                break;
            case 'yearly':
                endDate.setFullYear(startDate.getFullYear() + 1);
                break;
            case 'lifetime':
                endDate.setFullYear(startDate.getFullYear() + 100);
                break;
            default:
                endDate.setDate(startDate.getDate() + 30);
        }

        return {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        };
    }

    // Display user details
    function displayUserDetails() {
        const userDetailsSubscription = document.getElementById('userDetailsSubscription');
        const userNameSubscription = document.getElementById('userNameSubscription');
        const userPlanSubscription = document.getElementById('userPlanSubscription');
        const userAvatarSmallSubscription = document.getElementById('userAvatarSmallSubscription');
        const logoutBtnSubscription = document.getElementById('logoutBtnSubscription');
        
        if (Auth.isAuthenticated()) {
            const username = Auth.getCurrentUser();
            const userRole = localStorage.getItem('queen_ai_user_role');
            const userPlan = localStorage.getItem('queen_ai_user_plan') || 'trial';
            const subscriptionEnd = localStorage.getItem('queen_ai_subscription_end');

            if (userDetailsSubscription && userNameSubscription && userPlanSubscription && userAvatarSmallSubscription) {
                userDetailsSubscription.style.display = 'flex';
                
                // Set user name
                if (userRole === 'admin') {
                    userNameSubscription.textContent = 'Arun Chandran';
                } else {
                    const users = JSON.parse(localStorage.getItem('queen_ai_users') || '{}');
                    const user = users[username.toLowerCase()] || {};
                    userNameSubscription.textContent = user.fullname || username;
                }
                
                // Set user plan
                if (userRole === 'admin') {
                    userPlanSubscription.textContent = 'Admin';
                } else if (userPlan === 'lifetime') {
                    userPlanSubscription.textContent = 'Lifetime';
                } else if (subscriptionEnd) {
                    const endDate = new Date(subscriptionEnd);
                    const now = new Date();
                    const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
                    if (daysLeft > 0) {
                        userPlanSubscription.textContent = `${userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} (${daysLeft}d)`;
                    } else {
                        userPlanSubscription.textContent = 'Expired';
                    }
                } else {
                    userPlanSubscription.textContent = userPlan.charAt(0).toUpperCase() + userPlan.slice(1);
                }
                
                // Set avatar
                let initials = '';
                if (username.includes('@')) {
                    initials = username.charAt(0).toUpperCase() + username.split('@')[1].charAt(0).toUpperCase();
                } else {
                    initials = username.charAt(0).toUpperCase() + (username.charAt(1) || '').toUpperCase();
                }
                userAvatarSmallSubscription.textContent = initials;
            }

            // Logout button
            if (logoutBtnSubscription) {
                logoutBtnSubscription.style.display = 'inline-block';
                logoutBtnSubscription.addEventListener('click', function() {
                    if (confirm('Are you sure you want to logout?')) {
                        Auth.logout();
                    }
                });
            }
        }
    }

    // Initialize
    displayCurrentPlan();
});
