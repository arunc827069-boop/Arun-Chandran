// Authentication Logic

const Auth = {
    // Check if user is logged in
    isAuthenticated() {
        return localStorage.getItem('queen_ai_authenticated') === 'true';
    },

    // Set authentication status
    setAuthenticated(value) {
        localStorage.setItem('queen_ai_authenticated', value ? 'true' : 'false');
    },

    // Store user session
    setUserSession(username, rememberMe = false) {
        if (rememberMe) {
            localStorage.setItem('queen_ai_username', username);
            localStorage.setItem('queen_ai_remember', 'true');
        } else {
            sessionStorage.setItem('queen_ai_username', username);
            localStorage.removeItem('queen_ai_remember');
        }
        this.setAuthenticated(true);
    },

    // Get current user
    getCurrentUser() {
        return localStorage.getItem('queen_ai_username') || sessionStorage.getItem('queen_ai_username') || 'User';
    },

    // Logout
    logout() {
        this.setAuthenticated(false);
        localStorage.removeItem('queen_ai_username');
        localStorage.removeItem('queen_ai_remember');
        sessionStorage.removeItem('queen_ai_username');
        window.location.href = 'index.html';
    }
};
