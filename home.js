// Home Page Logic

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const basicModeBtn = document.getElementById('basicModeBtn');
    const advancedModeBtn = document.getElementById('advancedModeBtn');
    const projectsBtn = document.getElementById('projectsBtn');
    const subscriptionBtn = document.getElementById('subscriptionBtn');
    const aboutBtn = document.getElementById('aboutBtn');
    const contactBtn = document.getElementById('contactBtn');
    const adminInfo = document.getElementById('adminInfo');
    const adminName = document.getElementById('adminName');

    // Check if user is logged in and display user details
    function checkAuthStatus() {
        const userDetailsHeader = document.getElementById('userDetailsHeader');
        const userNameHeader = document.getElementById('userNameHeader');
        const userPlanHeader = document.getElementById('userPlanHeader');
        const userAvatarSmall = document.getElementById('userAvatarSmall');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (Auth.isAuthenticated()) {
            const username = Auth.getCurrentUser();
            const userRole = localStorage.getItem('queen_ai_user_role');
            const userPlan = localStorage.getItem('queen_ai_user_plan') || 'trial';
            const subscriptionEnd = localStorage.getItem('queen_ai_subscription_end');

            // Show user details in header
            if (userDetailsHeader && userNameHeader && userPlanHeader && userAvatarSmall) {
                userDetailsHeader.style.display = 'flex';
                
                // Set user name
                if (userRole === 'admin') {
                    userNameHeader.textContent = 'Arun Chandran';
                } else {
                    const users = JSON.parse(localStorage.getItem('queen_ai_users') || '{}');
                    const user = users[username.toLowerCase()] || {};
                    userNameHeader.textContent = user.fullname || username;
                }
                
                // Set user plan
                if (userRole === 'admin') {
                    userPlanHeader.textContent = 'Admin';
                } else if (userPlan === 'lifetime') {
                    userPlanHeader.textContent = 'Lifetime';
                } else if (subscriptionEnd) {
                    const endDate = new Date(subscriptionEnd);
                    const now = new Date();
                    const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
                    if (daysLeft > 0) {
                        userPlanHeader.textContent = `${userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} (${daysLeft}d)`;
                    } else {
                        userPlanHeader.textContent = 'Expired';
                    }
                } else {
                    userPlanHeader.textContent = userPlan.charAt(0).toUpperCase() + userPlan.slice(1);
                }
                
                // Set avatar initials
                let initials = '';
                if (username.includes('@')) {
                    initials = username.charAt(0).toUpperCase() + username.split('@')[1].charAt(0).toUpperCase();
                } else {
                    initials = username.charAt(0).toUpperCase() + (username.charAt(1) || '').toUpperCase();
                }
                userAvatarSmall.textContent = initials;
            }
            
            // Only show admin info badge if user is admin
            if (userRole === 'admin') {
                adminInfo.style.display = 'block';
                adminName.textContent = 'Arun Chandran';
            } else {
                adminInfo.style.display = 'none';
            }
            
            // Hide login/signup, show logout
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
        } else {
            // Not logged in
            adminInfo.style.display = 'none';
            if (userDetailsHeader) userDetailsHeader.style.display = 'none';
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (signupBtn) signupBtn.style.display = 'inline-block';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }

    // Check auth status on load
    checkAuthStatus();

    // Login button
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    // Signup button
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            window.location.href = 'signup.html';
        });
    }

    // Basic Mode button
    if (basicModeBtn) {
        basicModeBtn.addEventListener('click', function() {
            if (Auth.isAuthenticated()) {
                window.location.href = 'basic.html';
            } else {
                // Redirect to login, then back to basic after login
                sessionStorage.setItem('redirectAfterLogin', 'basic.html');
                alert('Please sign in to access Basic Mode.');
                window.location.href = 'index.html';
            }
        });
    }

    // Advanced Mode button
    if (advancedModeBtn) {
        advancedModeBtn.addEventListener('click', function() {
            if (Auth.isAuthenticated()) {
                // Go to Advanced Mode (designer.html)
                window.location.href = 'designer.html';
            } else {
                // Redirect to login, then back to home after login
                sessionStorage.setItem('redirectAfterLogin', 'designer.html');
                alert('Please sign in to access Advanced Mode.');
                window.location.href = 'index.html';
            }
        });
    }

    // Projects button
    if (projectsBtn) {
        projectsBtn.addEventListener('click', function() {
            if (Auth.isAuthenticated()) {
                window.location.href = 'projects.html';
            } else {
                sessionStorage.setItem('redirectAfterLogin', 'projects.html');
                alert('Please sign in to view your projects.');
                window.location.href = 'index.html';
            }
        });
    }

    // Subscription button
    if (subscriptionBtn) {
        subscriptionBtn.addEventListener('click', function() {
            if (Auth.isAuthenticated()) {
                window.location.href = 'subscription.html';
            } else {
                sessionStorage.setItem('redirectAfterLogin', 'subscription.html');
                alert('Please sign in to view subscription plans.');
                window.location.href = 'index.html';
            }
        });
    }

    // About button
    if (aboutBtn) {
        aboutBtn.addEventListener('click', function() {
            alert('The Queen AI - AI-Powered Website Builder\n\nCreate beautiful websites with the power of artificial intelligence. Transform your ideas into stunning websites with simple text descriptions or use our advanced drag-and-drop editor.\n\nContact: Arun Chandran\nEmail: arun.chandran@thequeenai.com');
        });
    }

    // Contact button
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            const contactInfo = 'Contact Information:\n\nArun Chandran\nEmail: arun.chandran@thequeenai.com\n\nThe Queen AI\n\nFor support, please email us at the address above.';
            alert(contactInfo);
        });
    }

    // Feature buttons
    const aiPoweredBtn = document.getElementById('aiPoweredBtn');
    const dragDropBtn = document.getElementById('dragDropBtn');
    const responsiveBtn = document.getElementById('responsiveBtn');
    const fastExportBtn = document.getElementById('fastExportBtn');

    // AI-Powered Design button
    if (aiPoweredBtn) {
        aiPoweredBtn.addEventListener('click', function() {
            if (Auth.isAuthenticated()) {
                // Go to Basic Mode for AI-powered design
                window.location.href = 'basic.html';
            } else {
                sessionStorage.setItem('redirectAfterLogin', 'basic.html');
                alert('Please sign in to use AI-Powered Design.');
                window.location.href = 'index.html';
            }
        });
    }

    // Drag & Drop Editor button
    if (dragDropBtn) {
        dragDropBtn.addEventListener('click', function() {
            if (Auth.isAuthenticated()) {
                // Go to Advanced Mode for drag & drop editor
                window.location.href = 'designer.html';
            } else {
                sessionStorage.setItem('redirectAfterLogin', 'designer.html');
                alert('Please sign in to use Drag & Drop Editor.');
                window.location.href = 'index.html';
            }
        });
    }

    // Responsive Design button
    if (responsiveBtn) {
        responsiveBtn.addEventListener('click', function() {
            alert('Responsive Design Feature:\n\nAll websites generated with The Queen AI are automatically responsive and work perfectly on:\n\n✓ Desktop computers\n✓ Tablets\n✓ Mobile phones\n✓ All screen sizes\n\nThe responsive design is built into every template and component!\n\nContact: Arun Chandran\nEmail: arun.chandran@thequeenai.com');
        });
    }

    // Fast Export button
    if (fastExportBtn) {
        fastExportBtn.addEventListener('click', function() {
            if (Auth.isAuthenticated()) {
                alert('Fast Export Feature:\n\nYou can export your websites in multiple ways:\n\n1. Download as HTML file\n2. Copy code to clipboard\n3. Auto-deploy (coming soon)\n\nGo to Basic Mode or Advanced Mode to export your website!\n\nContact: Arun Chandran\nEmail: arun.chandran@thequeenai.com');
                // Optionally redirect to basic mode
                const redirect = confirm('Would you like to go to Basic Mode to export a website?');
                if (redirect) {
                    window.location.href = 'basic.html';
                }
            } else {
                sessionStorage.setItem('redirectAfterLogin', 'basic.html');
                alert('Please sign in to use Fast Export feature.');
                window.location.href = 'index.html';
            }
        });
    }

    // Download feature guide (for future use if needed)
    function downloadFeatureGuide(feature) {
        const guides = {
            'ai-design': {
                title: 'AI-Powered Design Guide',
                content: `# AI-Powered Design Guide

## The Queen AI - AI-Powered Design Feature

### Overview
Generate beautiful websites from simple text descriptions using the power of artificial intelligence.

### How It Works
1. Enter a website description in plain English
2. Our AI analyzes your requirements
3. Website is automatically generated with:
   - Professional layouts
   - Responsive design
   - Modern UI components
   - Optimized structure

### Examples
- "Create a portfolio website for a photographer"
- "Build a landing page for a coffee shop"
- "Design a business website with contact form"

### Features
- ✓ Template-based generation
- ✓ Smart component selection
- ✓ Automatic styling
- ✓ SEO-friendly structure

### Tips for Best Results
- Be specific about your needs
- Mention key sections (header, footer, gallery, etc.)
- Include your business type or purpose

### Contact
For support: arun.chandran@thequeenai.com
The Queen AI © 2024`
            },
            'drag-drop': {
                title: 'Drag & Drop Editor Guide',
                content: `# Drag & Drop Editor Guide

## The Queen AI - Drag & Drop Editor Feature

### Overview
Build and customize websites visually using our intuitive drag-and-drop interface.

### How It Works
1. Start with a generated website or blank canvas
2. Drag components from the library
3. Drop them where you want
4. Customize properties in the sidebar
5. Preview in real-time

### Component Library
- Headers with navigation
- Hero sections
- Content cards
- Forms
- Galleries
- Footers

### Editing Features
- ✓ Visual component insertion
- ✓ Live preview
- ✓ Property panel editing
- ✓ Element reordering
- ✓ Duplicate and delete

### Keyboard Shortcuts
- Ctrl+Click: Select multiple elements
- Delete: Remove selected element
- Ctrl+D: Duplicate element

### Tips
- Use the component library for quick additions
- Customize properties in the right sidebar
- Save frequently to preserve your work

### Contact
For support: arun.chandran@thequeenai.com
The Queen AI © 2024`
            },
            'responsive': {
                title: 'Responsive Design Guide',
                content: `# Responsive Design Guide

## The Queen AI - Responsive Design Feature

### Overview
All generated websites are automatically responsive and work perfectly on all devices.

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Features
- ✓ Mobile-first approach
- ✓ Flexible grid layouts
- ✓ Adaptive images
- ✓ Touch-friendly navigation
- ✓ Optimized font sizes

### Mobile Optimization
- Stacked layouts on small screens
- Hamburger menus for navigation
- Touch-optimized buttons
- Readable text sizes

### Tablet Optimization
- Adjusted column widths
- Optimized spacing
- Better touch targets

### Desktop Features
- Multi-column layouts
- Hover effects
- Expanded navigation
- Full-width sections

### Testing
- Preview in different screen sizes
- Test on actual devices
- Check touch interactions

### Contact
For support: arun.chandran@thequeenai.com
The Queen AI © 2024`
            },
            'fast-export': {
                title: 'Fast Export Guide',
                content: `# Fast Export Guide

## The Queen AI - Fast Export Feature

### Overview
Export your website instantly in multiple formats for deployment or sharing.

### Export Options
1. **Download as HTML**
   - Single HTML file with embedded CSS
   - Ready to upload anywhere
   - No dependencies required

2. **Copy Code**
   - Copy HTML/CSS to clipboard
   - Paste into any editor
   - Quick sharing option

3. **Auto Deploy** (Coming Soon)
   - Direct deployment to hosting
   - One-click publishing
   - Automatic updates

### Export Formats
- Vanilla HTML/CSS/JS
- React/Next.js structure
- Vue.js structure

### What's Included
- ✓ Complete HTML structure
- ✓ All CSS styles embedded
- ✓ JavaScript functionality
- ✓ Responsive design
- ✓ Contact information footer

### Deployment Options
- GitHub Pages
- Netlify
- Vercel
- Traditional hosting
- Local hosting

### Tips
- Download HTML for quick deployment
- Copy code for custom editing
- Test exported files locally first

### Contact
For support: arun.chandran@thequeenai.com
The Queen AI © 2024`
            }
        };

        const guide = guides[feature];
        if (!guide) return;

        // Create and download file
        const blob = new Blob([guide.content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${guide.title.replace(/\s+/g, '-')}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert(`${guide.title} downloaded successfully!`);
    }
});
