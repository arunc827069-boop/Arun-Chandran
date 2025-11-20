// Projects Page Logic

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!Auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // Display user details
    displayUserDetails();

    const projectsList = document.getElementById('projectsList');
    const emptyState = document.getElementById('emptyState');
    const projectsCount = document.getElementById('projectsCount');
    const createNewBtn = document.getElementById('createNewBtn');
    const projectModal = document.getElementById('projectModal');
    const modalClose = document.querySelector('.modal-close');
    let currentProjectId = null;

    // Load projects
    function loadProjects() {
        const username = Auth.getCurrentUser().toLowerCase();
        const projects = JSON.parse(localStorage.getItem('queen_ai_projects') || '{}');
        const userProjects = projects[username] || [];

        projectsCount.textContent = userProjects.length;

        if (userProjects.length === 0) {
            projectsList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        projectsList.style.display = 'grid';
        emptyState.style.display = 'none';
        projectsList.innerHTML = '';

        // Sort projects by last modified (newest first)
        const sortedProjects = userProjects.sort((a, b) => {
            return new Date(b.lastModified) - new Date(a.lastModified);
        });

        sortedProjects.forEach((project, index) => {
            const projectCard = createProjectCard(project, index);
            projectsList.appendChild(projectCard);
        });
    }

    // Create project card
    function createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.projectId = index;

        const createdDate = new Date(project.created).toLocaleDateString();
        const modifiedDate = new Date(project.lastModified).toLocaleDateString();
        const componentCount = project.elements ? project.elements.length : 0;

        card.innerHTML = `
            <div class="project-card-header">
                <h3 class="project-card-name">${project.name || 'Untitled Project'}</h3>
                <div class="project-card-actions">
                    <button class="project-card-btn open" title="Open Project" onclick="event.stopPropagation(); openProject(${index})">→</button>
                    <button class="project-card-btn delete" title="Delete Project" onclick="event.stopPropagation(); deleteProject(${index})">×</button>
                </div>
            </div>
            <div class="project-card-info">
                <p>Components: ${componentCount}</p>
                <p class="project-card-date">
                    Created: ${createdDate}<br>
                    Modified: ${modifiedDate}
                </p>
            </div>
        `;

        card.addEventListener('click', function(e) {
            if (!e.target.closest('.project-card-actions')) {
                showProjectModal(index);
            }
        });

        return card;
    }

    // Show project modal
    function showProjectModal(index) {
        const username = Auth.getCurrentUser().toLowerCase();
        const projects = JSON.parse(localStorage.getItem('queen_ai_projects') || '{}');
        const userProjects = projects[username] || [];
        const project = userProjects[index];

        if (!project) return;

        currentProjectId = index;

        document.getElementById('modalProjectName').textContent = project.name || 'Untitled Project';
        document.getElementById('modalProjectCreated').textContent = new Date(project.created).toLocaleString();
        document.getElementById('modalProjectModified').textContent = new Date(project.lastModified).toLocaleString();
        document.getElementById('modalProjectComponents').textContent = project.elements ? project.elements.length : 0;

        projectModal.style.display = 'block';
    }

    // Open project modal functions (global scope for onclick)
    window.openProject = function(index) {
        const username = Auth.getCurrentUser().toLowerCase();
        const projects = JSON.parse(localStorage.getItem('queen_ai_projects') || '{}');
        const userProjects = projects[username] || [];
        
        if (userProjects[index]) {
            // Save project data temporarily
            localStorage.setItem('queen_ai_project_to_load', JSON.stringify(userProjects[index]));
            window.location.href = 'designer.html';
        }
    };

    window.deleteProject = function(index) {
        if (confirm('Are you sure you want to delete this project?')) {
            const username = Auth.getCurrentUser().toLowerCase();
            const projects = JSON.parse(localStorage.getItem('queen_ai_projects') || '{}');
            const userProjects = projects[username] || [];
            
            userProjects.splice(index, 1);
            projects[username] = userProjects;
            localStorage.setItem('queen_ai_projects', JSON.stringify(projects));
            
            loadProjects();
        }
    };

    // Modal actions
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            projectModal.style.display = 'none';
        });
    }

    document.getElementById('modalCloseBtn').addEventListener('click', function() {
        projectModal.style.display = 'none';
    });

    document.getElementById('modalOpenBtn').addEventListener('click', function() {
        if (currentProjectId !== null) {
            window.openProject(currentProjectId);
        }
    });

    document.getElementById('modalDeleteBtn').addEventListener('click', function() {
        if (currentProjectId !== null) {
            window.deleteProject(currentProjectId);
            projectModal.style.display = 'none';
        }
    });

    document.getElementById('modalExportBtn').addEventListener('click', function() {
        if (currentProjectId !== null) {
            const username = Auth.getCurrentUser().toLowerCase();
            const projects = JSON.parse(localStorage.getItem('queen_ai_projects') || '{}');
            const userProjects = projects[username] || [];
            const project = userProjects[currentProjectId];

            if (project) {
                // Export project as JSON
                const dataStr = JSON.stringify(project, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${project.name || 'project'}.json`;
                link.click();
                URL.revokeObjectURL(url);
            }
        }
    });

    // Create new project
    if (createNewBtn) {
        createNewBtn.addEventListener('click', function() {
            window.location.href = 'designer.html';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === projectModal) {
            projectModal.style.display = 'none';
        }
    });

    // Display user details
    function displayUserDetails() {
        const userDetailsProjects = document.getElementById('userDetailsProjects');
        const userNameProjects = document.getElementById('userNameProjects');
        const userPlanProjects = document.getElementById('userPlanProjects');
        const userAvatarSmallProjects = document.getElementById('userAvatarSmallProjects');
        const logoutBtnProjects = document.getElementById('logoutBtnProjects');
        
        if (Auth.isAuthenticated()) {
            const username = Auth.getCurrentUser();
            const userRole = localStorage.getItem('queen_ai_user_role');
            const userPlan = localStorage.getItem('queen_ai_user_plan') || 'trial';
            const subscriptionEnd = localStorage.getItem('queen_ai_subscription_end');

            if (userDetailsProjects && userNameProjects && userPlanProjects && userAvatarSmallProjects) {
                userDetailsProjects.style.display = 'flex';
                
                // Set user name
                if (userRole === 'admin') {
                    userNameProjects.textContent = 'Arun Chandran';
                } else {
                    const users = JSON.parse(localStorage.getItem('queen_ai_users') || '{}');
                    const user = users[username.toLowerCase()] || {};
                    userNameProjects.textContent = user.fullname || username;
                }
                
                // Set user plan
                if (userRole === 'admin') {
                    userPlanProjects.textContent = 'Admin';
                } else if (userPlan === 'lifetime') {
                    userPlanProjects.textContent = 'Lifetime';
                } else if (subscriptionEnd) {
                    const endDate = new Date(subscriptionEnd);
                    const now = new Date();
                    const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
                    if (daysLeft > 0) {
                        userPlanProjects.textContent = `${userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} (${daysLeft}d)`;
                    } else {
                        userPlanProjects.textContent = 'Expired';
                    }
                } else {
                    userPlanProjects.textContent = userPlan.charAt(0).toUpperCase() + userPlan.slice(1);
                }
                
                // Set avatar
                let initials = '';
                if (username.includes('@')) {
                    initials = username.charAt(0).toUpperCase() + username.split('@')[1].charAt(0).toUpperCase();
                } else {
                    initials = username.charAt(0).toUpperCase() + (username.charAt(1) || '').toUpperCase();
                }
                userAvatarSmallProjects.textContent = initials;
            }

            // Logout button
            if (logoutBtnProjects) {
                logoutBtnProjects.style.display = 'inline-block';
                logoutBtnProjects.addEventListener('click', function() {
                    if (confirm('Are you sure you want to logout?')) {
                        Auth.logout();
                    }
                });
            }
        }
    }

    // Load projects on page load
    loadProjects();
});
