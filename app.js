// Main Application Logic

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!Auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // If admin, offer option to go to home
    const userRole = localStorage.getItem('queen_ai_user_role');
    if (userRole === 'admin') {
        // Add home button if not exists
        const topBarRight = document.querySelector('.top-bar-right');
        if (topBarRight && !document.getElementById('homeBtn')) {
            const homeBtn = document.createElement('button');
            homeBtn.id = 'homeBtn';
            homeBtn.className = 'btn btn-secondary';
            homeBtn.textContent = 'Home';
            homeBtn.style.marginLeft = '0.5rem';
            homeBtn.addEventListener('click', () => {
                window.location.href = 'home.html';
            });
            topBarRight.insertBefore(homeBtn, topBarRight.firstChild);
        }
    }

    // Display user info
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        const username = Auth.getCurrentUser();
        const userRole = localStorage.getItem('queen_ai_user_role') || 'user';
        const userPlan = localStorage.getItem('queen_ai_user_plan') || 'trial';
        const subscriptionEnd = localStorage.getItem('queen_ai_subscription_end');
        
        let planDisplay = '';
        if (userRole === 'admin') {
            planDisplay = ' | Admin';
        } else if (userPlan === 'lifetime') {
            planDisplay = ' | Lifetime';
        } else if (subscriptionEnd) {
            const endDate = new Date(subscriptionEnd);
            const now = new Date();
            const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
            
            if (daysLeft > 0) {
                planDisplay = ` | ${userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} (${daysLeft} days left)`;
            } else {
                planDisplay = ' | Expired';
            }
        }
        
        userInfo.textContent = `Welcome, ${username}${planDisplay}`;
        userInfo.style.color = 'white';
        userInfo.style.marginRight = '1rem';
        userInfo.style.fontSize = '0.9rem';
    }

    // User profile button
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userDetailsDropdown = document.getElementById('userDetailsDropdown');
    let dropdownOpen = false;

    function updateUserProfile() {
        const username = Auth.getCurrentUser();
        const userRole = localStorage.getItem('queen_ai_user_role');
        const userPlan = localStorage.getItem('queen_ai_user_plan') || 'trial';
        const subscriptionEnd = localStorage.getItem('queen_ai_subscription_end');
        
        // Check if admin
        let user = {};
        let displayName = username;
        let displayEmail = username;
        
        if (userRole === 'admin') {
            // Admin uses email
            displayEmail = username; // username is email for admin
            displayName = 'Arun Chandran'; // Admin name
        } else {
            // Regular user
            const users = JSON.parse(localStorage.getItem('queen_ai_users') || '{}');
            user = users[username.toLowerCase()] || {};
            displayName = user.fullname || username;
            displayEmail = user.email || username;
        }

        // Set user initials (use email if it's an email)
        let initials = '';
        if (username.includes('@')) {
            // It's an email, use first letter of email and first letter after @
            initials = username.charAt(0).toUpperCase() + username.split('@')[1].charAt(0).toUpperCase();
        } else {
            initials = username.charAt(0).toUpperCase() + (username.charAt(1) || '').toUpperCase();
        }
        document.getElementById('userInitials').textContent = initials;
        document.getElementById('userAvatarLarge').textContent = initials;

        // Set user details
        document.getElementById('userFullName').textContent = displayName;
        document.getElementById('userEmail').textContent = displayEmail;
        document.getElementById('userDetailUsername').textContent = username;
        
        // Plan display
        let planText = '';
        let expiryText = '';
        
        if (userRole === 'admin') {
            planText = 'Admin Account';
            expiryText = 'Never expires';
        } else {
            const planNames = {
                trial: 'Free Trial',
                monthly: 'Monthly Plan',
                yearly: 'Yearly Plan',
                lifetime: 'Lifetime Plan'
            };
            planText = planNames[userPlan] || 'Free Trial';
            
            if (userPlan === 'lifetime') {
                expiryText = 'Never expires';
            } else if (subscriptionEnd) {
                const endDate = new Date(subscriptionEnd);
                const now = new Date();
                const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
                
                if (daysLeft > 0) {
                    expiryText = `${endDate.toLocaleDateString()} (${daysLeft} days left)`;
                } else {
                    expiryText = 'Expired';
                }
            } else {
                expiryText = 'Not set';
            }
        }
        
        document.getElementById('userPlanDisplay').textContent = planText;
        document.getElementById('userDetailRole').textContent = userRole === 'admin' ? 'Admin' : 'User';
        document.getElementById('userDetailSubscription').textContent = planText;
        document.getElementById('userDetailExpiry').textContent = expiryText;
    }

    if (userProfileBtn && userDetailsDropdown) {
        userProfileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownOpen = !dropdownOpen;
            userDetailsDropdown.style.display = dropdownOpen ? 'block' : 'none';
            updateUserProfile();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userProfileBtn.contains(e.target) && !userDetailsDropdown.contains(e.target)) {
                dropdownOpen = false;
                userDetailsDropdown.style.display = 'none';
            }
        });
    }

    // Basic mode button
    const basicModeBtn = document.getElementById('basicModeBtn');
    if (basicModeBtn) {
        basicModeBtn.addEventListener('click', () => {
            window.location.href = 'basic.html';
        });
    }

    // Projects button
    const projectsBtn = document.getElementById('projectsBtn');
    if (projectsBtn) {
        projectsBtn.addEventListener('click', () => {
            window.location.href = 'projects.html';
        });
    }

    // Subscription button
    const subscriptionBtn = document.getElementById('subscriptionBtn');
    if (subscriptionBtn) {
        subscriptionBtn.addEventListener('click', () => {
            window.location.href = 'subscription.html';
        });
    }

    // Initialize user profile
    updateUserProfile();

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                Auth.logout();
            }
        });
    }

    // Initialize editor
    Editor.init();

    // Generate button
    const generateBtn = document.getElementById('generateBtn');
    const textInput = document.getElementById('textInput');

    generateBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (text) {
            Editor.generateWebsite(text);
        } else {
            alert('Please enter a website description');
        }
    });

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    exportBtn.addEventListener('click', () => {
        const elements = document.querySelectorAll('#canvas .canvas-element');
        if (elements.length === 0) {
            alert('Canvas is empty. Please generate or add components first.');
            return;
        }
        Export.exportWebsite();
    });

    // Save button
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', () => {
        Storage.saveProject();
    });

    // Load button
    const loadBtn = document.getElementById('loadBtn');
    loadBtn.addEventListener('click', () => {
        Storage.loadProject();
    });

    // Enter key to generate
    textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            generateBtn.click();
        }
    });
});

// Storage functionality for save/load
const Storage = {
    saveProject() {
        const canvas = document.getElementById('canvas');
        const elements = canvas.querySelectorAll('.canvas-element');
        
        if (elements.length === 0) {
            alert('Canvas is empty. Nothing to save.');
            return;
        }

        // Ask for project name
        const projectName = prompt('Enter project name:', 'My Website Project');
        if (!projectName || !projectName.trim()) {
            return; // User cancelled or entered empty name
        }

        const project = {
            name: projectName.trim(),
            elements: [],
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };

        elements.forEach(element => {
            const componentKey = element.dataset.component;
            const html = element.innerHTML;
            
            // Remove controls from saved HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const controls = tempDiv.querySelector('.element-controls');
            if (controls) {
                controls.remove();
            }

            project.elements.push({
                component: componentKey,
                html: tempDiv.innerHTML
            });
        });

        // Save to user's project list
        const username = Auth.getCurrentUser().toLowerCase();
        const projects = JSON.parse(localStorage.getItem('queen_ai_projects') || '{}');
        if (!projects[username]) {
            projects[username] = [];
        }

        // Check if project with same name exists, update it
        const existingIndex = projects[username].findIndex(p => p.name === project.name);
        if (existingIndex !== -1) {
            // Update existing project
            project.created = projects[username][existingIndex].created; // Keep original creation date
            projects[username][existingIndex] = project;
        } else {
            // Add new project
            projects[username].push(project);
        }

        localStorage.setItem('queen_ai_projects', JSON.stringify(projects));

        // Also save to old format for compatibility
        localStorage.setItem('websiteDesigner_project', JSON.stringify(project));
        
        // Also save text input if exists
        const textInput = document.getElementById('textInput');
        if (textInput && textInput.value.trim()) {
            localStorage.setItem('websiteDesigner_textInput', textInput.value);
        }

        alert(`Project "${project.name}" saved successfully!`);
    },

    loadProject() {
        // Load from projects list or old format
        const username = Auth.getCurrentUser().toLowerCase();
        const projects = JSON.parse(localStorage.getItem('queen_ai_projects') || '{}');
        const userProjects = projects[username] || [];

        if (userProjects.length === 0) {
            // Try old format
            const projectData = localStorage.getItem('websiteDesigner_project');
            if (!projectData) {
                alert('No saved projects found. Go to Projects page to manage your projects.');
                return;
            }
            // Load old format
            try {
                const project = JSON.parse(projectData);
                this.loadProjectFromData(project);
                return;
            } catch (error) {
                alert('Error loading project: ' + error.message);
                return;
            }
        }

        // Show project selection dialog
        const projectNames = userProjects.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
        const choice = prompt(`Available projects:\n\n${projectNames}\n\nEnter project number to load (or cancel to go to Projects page):`);
        
        if (!choice) {
            window.location.href = 'projects.html';
            return;
        }

        const index = parseInt(choice) - 1;
        if (index >= 0 && index < userProjects.length) {
            if (!confirm(`Load project "${userProjects[index].name}"? This will replace current canvas.`)) {
                return;
            }
            this.loadProjectFromData(userProjects[index]);
        } else {
            alert('Invalid project number.');
        }
    },

    loadProjectFromData(project) {
        const canvas = document.getElementById('canvas');

        // Clear canvas
        Editor.clearCanvas();

        // Restore elements
        if (project.elements && project.elements.length > 0) {
            project.elements.forEach(item => {
                const element = document.createElement('div');
                element.className = 'canvas-element';
                element.dataset.component = item.component;
                element.innerHTML = item.html;

                // Add controls back
                const controls = document.createElement('div');
                controls.className = 'element-controls';
                controls.innerHTML = `
                    <button class="element-control-btn delete" title="Delete">×</button>
                    <button class="element-control-btn duplicate" title="Duplicate">⧉</button>
                    <button class="element-control-btn move-up" title="Move Up">↑</button>
                    <button class="element-control-btn move-down" title="Move Down">↓</button>
                `;
                element.appendChild(controls);

                Editor.setupElementEvents(element);
                canvas.appendChild(element);
            });
        }

        // Remove placeholder
        const placeholder = canvas.querySelector('.canvas-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        // Restore text input if available
        const textInput = document.getElementById('textInput');
        const savedText = localStorage.getItem('websiteDesigner_textInput');
        if (textInput && savedText) {
            textInput.value = savedText;
        }

        alert(`Project "${project.name || 'Untitled'}" loaded successfully!`);
    },

    clearProject() {
        if (confirm('Clear all saved projects?')) {
            localStorage.removeItem('websiteDesigner_project');
            localStorage.removeItem('websiteDesigner_textInput');
            alert('Projects cleared.');
        }
    }
};
