// Export Functionality - Generate and download HTML/CSS/JS files

const Export = {
    // Export website as downloadable files
    exportWebsite() {
        const html = this.generateHTML();
        const css = this.generateCSS();
        const js = this.generateJS();

        // Create a complete HTML file with embedded CSS and JS
        const completeHTML = this.createCompleteHTML(html, css, js);

        // Download as HTML file
        this.downloadFile(completeHTML, 'index.html', 'text/html');

        // Also offer separate files option
        if (confirm('Website exported as index.html. Would you like to also download separate CSS and JS files?')) {
            this.downloadFile(css, 'styles.css', 'text/css');
            this.downloadFile(js, 'script.js', 'text/javascript');
        }
    },

    // Generate HTML from canvas
    generateHTML() {
        const elements = document.querySelectorAll('#canvas .canvas-element');
        let html = '';

        elements.forEach(element => {
            // Clone element and remove controls
            const clone = element.cloneNode(true);
            const controls = clone.querySelector('.element-controls');
            if (controls) {
                controls.remove();
            }
            
            // Remove editor-specific classes
            clone.classList.remove('canvas-element', 'selected', 'dragging');
            
            // Get inner HTML (the actual component HTML)
            html += clone.innerHTML + '\n';
        });

        return html.trim();
    },

    // Generate CSS from component styles
    generateCSS() {
        // Get all component CSS
        const componentStyles = this.getComponentStyles();
        
        // Base styles
        const baseStyles = `
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
`;

        // Component CSS (from components.css)
        const componentCSS = this.extractComponentCSS();

        return baseStyles + '\n' + componentStyles + '\n' + componentCSS;
    },

    // Get component-specific styles
    getComponentStyles() {
        // Extract computed styles from canvas elements
        let styles = '';

        const elements = document.querySelectorAll('#canvas .canvas-element > *');
        elements.forEach(element => {
            const classes = Array.from(element.classList);
            if (classes.length > 0) {
                classes.forEach(className => {
                    if (className.startsWith('component-')) {
                        // Styles for this component are already in components.css
                        // We'll include them via extractComponentCSS
                    }
                });
            }
        });

        return styles;
    },

    // Extract component CSS from stylesheet
    extractComponentCSS() {
        // Since we can't easily access the stylesheet content in vanilla JS,
        // we'll include the component CSS directly
        return `
/* Component Styles */

/* Header Component */
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

/* Hero Section */
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

/* Button Component */
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

/* Card Component */
.component-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
}

.component-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.component-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #2c3e50;
}

.component-card p {
    color: #666;
    line-height: 1.6;
}

/* Form Component */
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

.component-form button {
    margin-top: 0.5rem;
}

/* Footer Component */
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

/* Gallery Component */
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

/* About Section */
.component-about {
    padding: 4rem 2rem;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
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

/* Section */
.component-section {
    padding: 4rem 2rem;
}

.component-section h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #2c3e50;
}

/* Container */
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
    },

    // Generate JavaScript
    generateJS() {
        // Basic JavaScript for interactive elements
        return `
// Basic JavaScript for website functionality

document.addEventListener('DOMContentLoaded', function() {
    // Form submission handler
    const forms = document.querySelectorAll('.component-form form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Form submitted! (In a real website, this would send data to a server.)');
        });
    });

    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
`;
    },

    // Create complete HTML file
    createCompleteHTML(html, css, js) {
        // Add contact footer to exported HTML
        const contactFooter = `
    <footer class="component-footer" style="margin-top: 2rem; background: #2c3e50; color: white; padding: 2rem; text-align: center;">
        <p><strong>Contact:</strong> Arun Chandran</p>
        <p>Email: <a href="mailto:arun.chandran@thequeenai.com" style="color: #3498db;">arun.chandran@thequeenai.com</a></p>
        <p>The Queen AI &copy; ${new Date().getFullYear()}. All rights reserved.</p>
    </footer>`;

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website - Created with The Queen AI</title>
    <style>
${css}
    </style>
</head>
<body>
${html}
${contactFooter}
    <script>
${js}
    </script>
</body>
</html>`;
    },

    // Download file
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};
