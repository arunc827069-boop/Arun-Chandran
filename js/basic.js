// Basic Website Creator Logic

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!Auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    const textInput = document.getElementById('textInput');
    const generateBtn = document.getElementById('generateBtn');
    const preview = document.getElementById('preview');
    const exportBtn = document.getElementById('exportBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const advancedModeBtn = document.getElementById('advancedModeBtn');
    const userProfileBtn = document.getElementById('userProfileBtn');

    // Configuration settings
    const config = {
        techStack: 'vanilla',
        aiMethod: 'template',
        featuresLevel: 'basic',
        exportOption: 'download'
    };

    // Update user profile
    function updateUserProfile() {
        const username = Auth.getCurrentUser();
        const userRole = localStorage.getItem('queen_ai_user_role');
        const userPlan = localStorage.getItem('queen_ai_user_plan') || 'trial';
        const subscriptionEnd = localStorage.getItem('queen_ai_subscription_end');
        let initials = '';
        
        if (username.includes('@')) {
            // It's an email
            initials = username.charAt(0).toUpperCase() + username.split('@')[1].charAt(0).toUpperCase();
        } else {
            initials = username.charAt(0).toUpperCase() + (username.charAt(1) || '').toUpperCase();
        }
        
        document.getElementById('userInitials').textContent = initials;
        
        // Also display user info next to profile button
        const userInfoDisplay = document.querySelector('.top-bar .user-info-display');
        if (!userInfoDisplay) {
            const userInfoDiv = document.createElement('div');
            userInfoDiv.className = 'user-info-display';
            userInfoDiv.style.cssText = 'color: white; margin-right: 1rem; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem;';
            
            const userNameSpan = document.createElement('span');
            userNameSpan.style.fontWeight = '600';
            if (userRole === 'admin') {
                userNameSpan.textContent = 'Arun Chandran';
            } else {
                const users = JSON.parse(localStorage.getItem('queen_ai_users') || '{}');
                const user = users[username.toLowerCase()] || {};
                userNameSpan.textContent = user.fullname || username;
            }
            
            const userPlanSpan = document.createElement('span');
            userPlanSpan.style.opacity = '0.9';
            if (userRole === 'admin') {
                userPlanSpan.textContent = '| Admin';
            } else if (userPlan === 'lifetime') {
                userPlanSpan.textContent = '| Lifetime';
            } else if (subscriptionEnd) {
                const endDate = new Date(subscriptionEnd);
                const now = new Date();
                const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
                if (daysLeft > 0) {
                    userPlanSpan.textContent = `| ${userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} (${daysLeft}d)`;
                } else {
                    userPlanSpan.textContent = '| Expired';
                }
            } else {
                userPlanSpan.textContent = `| ${userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}`;
            }
            
            userInfoDiv.appendChild(userNameSpan);
            userInfoDiv.appendChild(userPlanSpan);
            
            const topBarRight = document.querySelector('.top-bar-right');
            if (topBarRight) {
                topBarRight.insertBefore(userInfoDiv, topBarRight.firstChild);
            }
        } else {
            // Update existing
            const spans = userInfoDisplay.querySelectorAll('span');
            if (spans.length >= 2) {
                if (userRole === 'admin') {
                    spans[0].textContent = 'Arun Chandran';
                    spans[1].textContent = '| Admin';
                } else {
                    const users = JSON.parse(localStorage.getItem('queen_ai_users') || '{}');
                    const user = users[username.toLowerCase()] || {};
                    spans[0].textContent = user.fullname || username;
                    if (userPlan === 'lifetime') {
                        spans[1].textContent = '| Lifetime';
                    } else if (subscriptionEnd) {
                        const endDate = new Date(subscriptionEnd);
                        const now = new Date();
                        const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
                        if (daysLeft > 0) {
                            spans[1].textContent = `| ${userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} (${daysLeft}d)`;
                        } else {
                            spans[1].textContent = '| Expired';
                        }
                    } else {
                        spans[1].textContent = `| ${userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}`;
                    }
                }
            }
        }
    }

    // Setup option buttons
    function setupOptionButtons() {
        const optionGroups = ['techStack', 'aiMethod', 'featuresLevel', 'exportOption'];
        
        optionGroups.forEach(groupId => {
            const buttons = document.querySelectorAll(`#${groupId} .option-btn`);
            buttons.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Remove active from siblings
                    buttons.forEach(b => b.classList.remove('active'));
                    // Add active to clicked button
                    this.classList.add('active');
                    // Update config
                    config[groupId] = this.dataset.value;
                    
                    // Show message if using advanced options
                    if (groupId === 'techStack' && config.techStack !== 'vanilla') {
                        showInfoMessage(`Note: ${this.textContent} output will be generated, but requires a build process.`);
                    }
                    if (groupId === 'aiMethod' && config.aiMethod !== 'template') {
                        showInfoMessage(`Note: ${this.textContent} method is selected but template-based generation will be used in demo mode.`);
                    }
                    
                    // Update export button text
                    if (groupId === 'exportOption') {
                        updateExportButtonText();
                    }
                });
            });
        });
    }

    // Update export button text based on selected option
    function updateExportButtonText() {
        const exportLabels = {
            'download': 'Download HTML',
            'deploy': 'Auto Deploy',
            'copy': 'Copy Code'
        };
        exportBtn.textContent = exportLabels[config.exportOption] || 'Download HTML';
    }

    // Show info message
    function showInfoMessage(message) {
        const existingMsg = document.querySelector('.info-message');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        const msg = document.createElement('div');
        msg.className = 'info-message';
        msg.textContent = message;
        msg.style.cssText = 'background: #e3f2fd; color: #1976d2; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.85rem;';
        textInput.parentElement.insertBefore(msg, textInput);
        
        setTimeout(() => {
            msg.remove();
        }, 5000);
    }

    updateUserProfile();
    setupOptionButtons();

    // Show home button for admin
    const userRole = localStorage.getItem('queen_ai_user_role');
    const homeBtn = document.getElementById('homeBtn');
    if (userRole === 'admin' && homeBtn) {
        homeBtn.style.display = 'inline-block';
        homeBtn.addEventListener('click', function() {
            window.location.href = 'home.html';
        });
    }

    // Generate website from text
    function generateWebsite() {
        const text = textInput.value.trim();
        
        if (!text) {
            alert('Please enter a website description.');
            return;
        }

        // Show generating message
        const previewContainer = document.getElementById('preview');
        const placeholder = document.createElement('div');
        placeholder.className = 'preview-placeholder';
        placeholder.innerHTML = '<p>Generating website...</p>';
        previewContainer.innerHTML = '';
        previewContainer.appendChild(placeholder);

        // Generate based on selected options
        setTimeout(() => {
            let html = '';
            
            // Use template engine (template-based method)
            if (config.aiMethod === 'template' || config.aiMethod === 'api' || config.aiMethod === 'service' || config.aiMethod === 'custom') {
                // For demo, all methods use template-based generation
                const result = TemplateEngine.generateWebsite(text);
                
                // Generate HTML based on tech stack
                if (config.techStack === 'vanilla') {
                    html = generateCompleteHTML(result.html, result.template);
                } else if (config.techStack === 'react') {
                    html = generateReactHTML(result.html, result.template);
                } else if (config.techStack === 'vue') {
                    html = generateVueHTML(result.html, result.template);
                } else {
                    html = generateCompleteHTML(result.html, result.template);
                }
            }
            
            // Display preview
            displayPreview(html);
            
            // Store generated HTML for export
            preview.dataset.generatedHtml = html;
            preview.dataset.config = JSON.stringify(config);
        }, 500);
    }

    // Generate complete HTML with embedded CSS
    function generateCompleteHTML(content, templateType) {
        const css = generateCSS(templateType);
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website - The Queen AI</title>
    <style>
${css}
    </style>
</head>
<body>
${content}
</body>
</html>`;
    }

    // Generate CSS for the website
    function generateCSS(templateType) {
        // Base styles
        const baseCSS = `
/* Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #333;
}

img {
    max-width: 100%;
    height: auto;
}

a {
    text-decoration: none;
    color: inherit;
}

ul {
    list-style: none;
}
`;

        // Get component CSS from components.css content
        const componentCSS = `
/* Component Styles */
.component-header {
    background: #2c3e50;
    color: white;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.component-header .logo {
    font-size: 1.5rem;
    font-weight: 600;
}

.component-header nav ul {
    display: flex;
    list-style: none;
    gap: 2rem;
    padding: 0;
    margin: 0;
}

.component-header nav a {
    color: white;
    text-decoration: none;
    transition: color 0.2s;
}

.component-header nav a:hover {
    color: #3498db;
}

.component-hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 5rem 2rem;
    text-align: center;
}

.component-hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.component-hero p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.component-button {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.2s;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
}

.component-button:hover {
    background: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.component-button.primary {
    background: #3498db;
}

.component-button.secondary {
    background: #95a5a6;
}

.component-button.secondary:hover {
    background: #7f8c8d;
}

.component-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    overflow: hidden;
}

.component-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.component-card .card-image {
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: #f0f0f0;
}

.component-card .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.component-card:hover .card-image img {
    transform: scale(1.1);
}

.component-card h3 {
    font-size: 1.5rem;
    margin: 1.5rem 1.5rem 1rem;
    color: #2c3e50;
}

.component-card p {
    color: #666;
    line-height: 1.6;
    margin: 0 1.5rem 1.5rem;
}

.component-form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
}

.component-form .form-group {
    margin-bottom: 1.5rem;
}

.component-form label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
}

.component-form input,
.component-form textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
}

.component-form input:focus,
.component-form textarea:focus {
    outline: none;
    border-color: #3498db;
}

.component-form textarea {
    resize: vertical;
    min-height: 120px;
}

.component-footer {
    background: #2c3e50;
    color: white;
    padding: 2rem;
    text-align: center;
}

.component-footer p {
    margin: 0.5rem 0;
}

.component-footer a {
    color: #3498db;
    text-decoration: none;
}

.component-footer a:hover {
    text-decoration: underline;
}

.component-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: 2rem;
}

.component-gallery-item {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    aspect-ratio: 4/3;
    background: #f0f0f0;
}

.component-gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.component-gallery-item:hover img {
    transform: scale(1.1);
}

.component-about {
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.component-about .about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
}

.component-about .about-image {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.component-about .about-image img {
    width: 100%;
    height: auto;
    display: block;
}

.component-about .about-text {
    text-align: left;
}

.component-about h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #2c3e50;
}

.component-about p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #666;
}

.component-section .section-image {
    width: 100%;
    max-width: 800px;
    margin: 0 auto 2rem;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.component-section .section-image img {
    width: 100%;
    height: auto;
    display: block;
}

.component-section {
    padding: 4rem 2rem;
}

.component-section h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #2c3e50;
}

.component-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .component-hero h1 {
        font-size: 2rem;
    }
    
    .component-header nav ul {
        flex-direction: column;
        gap: 1rem;
    }
    
    .component-gallery {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
}
`;

        return baseCSS + componentCSS;
    }

    // Display preview
    function displayPreview(html) {
        // Remove placeholder
        const placeholder = preview.querySelector('.preview-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        // Create iframe for safe preview
        let iframe = preview.querySelector('iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.borderRadius = '8px';
            preview.appendChild(iframe);
        }

        // Write HTML to iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();
    }

    // Generate React HTML
    function generateReactHTML(content, templateType) {
        const css = generateCSS(templateType);
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website - React/Next.js - The Queen AI</title>
    <style>
${css}
    </style>
</head>
<body>
    <div id="root">
${content}
    </div>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script>
        // React component structure (demo)
        // Note: For full React implementation, use build tools like Vite or Next.js
        console.log('React mode enabled');
    </script>
</body>
</html>`;
    }

    // Generate Vue HTML
    function generateVueHTML(content, templateType) {
        const css = generateCSS(templateType);
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website - Vue.js - The Queen AI</title>
    <style>
${css}
    </style>
</head>
<body>
    <div id="app">
${content}
    </div>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script>
        // Vue component structure (demo)
        // Note: For full Vue implementation, use build tools like Vite
        const { createApp } = Vue;
        createApp({
            data() {
                return {};
            }
        }).mount('#app');
    </script>
</body>
</html>`;
    }

    // Export HTML based on selected option
    function exportHTML() {
        const html = preview.dataset.generatedHtml;
        const savedConfig = preview.dataset.config;
        
        if (!html) {
            alert('Please generate a website first.');
            return;
        }

        const exportConfig = savedConfig ? JSON.parse(savedConfig) : config;

        if (exportConfig.exportOption === 'download') {
            // Download as HTML file
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filename = exportConfig.techStack === 'vanilla' ? 'website.html' : 
                           exportConfig.techStack === 'react' ? 'website-react.html' : 
                           'website-vue.html';
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('Website downloaded successfully!');
        } else if (exportConfig.exportOption === 'copy') {
            // Copy code to clipboard
            navigator.clipboard.writeText(html).then(() => {
                alert('Code copied to clipboard!');
            }).catch(() => {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = html;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                alert('Code copied to clipboard!');
            });
        } else if (exportConfig.exportOption === 'deploy') {
            // Show deployment message
            alert('Auto-deployment feature coming soon! For now, please download the files and deploy manually.');
        }
    }

    // Event listeners
    generateBtn.addEventListener('click', generateWebsite);
    
    refreshBtn.addEventListener('click', function() {
        if (preview.dataset.generatedHtml) {
            displayPreview(preview.dataset.generatedHtml);
        }
    });
    
    exportBtn.addEventListener('click', exportHTML);
    
    if (advancedModeBtn) {
        advancedModeBtn.addEventListener('click', function() {
            window.location.href = 'designer.html';
        });
    }
    
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            Auth.logout();
        }
    });

    // Allow Enter + Ctrl to generate
    textInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            generateWebsite();
        }
    });
});

// Fill example function (global scope for onclick)
function fillExample(text) {
    document.getElementById('textInput').value = text;
    document.getElementById('textInput').focus();
}
