// Template Engine - Maps text descriptions to templates and generates HTML

const TemplateEngine = {
    templates: {
        portfolio: {
            name: 'Portfolio Website',
            keywords: ['portfolio', 'photographer', 'artist', 'designer', 'creative', 'showcase'],
            sections: ['header', 'hero', 'gallery', 'about', 'contact', 'footer']
        },
        business: {
            name: 'Business Website',
            keywords: ['business', 'company', 'corporate', 'professional', 'service', 'enterprise'],
            sections: ['header', 'hero', 'section', 'card', 'section', 'form', 'footer']
        },
        landing: {
            name: 'Landing Page',
            keywords: ['landing', 'page', 'promo', 'product', 'launch', 'marketing'],
            sections: ['header', 'hero', 'section', 'section', 'form', 'footer']
        },
        blog: {
            name: 'Blog Website',
            keywords: ['blog', 'article', 'news', 'journal', 'post', 'content'],
            sections: ['header', 'hero', 'card', 'card', 'card', 'footer']
        }
    },

    // Analyze text and determine best template
    analyzeText(text) {
        const lowerText = text.toLowerCase();
        let bestMatch = null;
        let maxScore = 0;

        Object.keys(this.templates).forEach(key => {
            const template = this.templates[key];
            let score = 0;

            template.keywords.forEach(keyword => {
                if (lowerText.includes(keyword)) {
                    score++;
                }
            });

            if (score > maxScore) {
                maxScore = score;
                bestMatch = key;
            }
        });

        // Default to business if no good match
        return bestMatch || 'business';
    },

    // Generate website from template and text description
    generateWebsite(text, userData = {}) {
        const templateKey = this.analyzeText(text);
        const template = this.templates[templateKey];

        // Extract information from text
        const extractedData = this.extractDataFromText(text);

        // Merge with user data
        const data = { ...extractedData, ...userData };

        // Generate HTML from template sections
        let html = '';

        template.sections.forEach((sectionType, index) => {
            html += this.generateSection(sectionType, data, index);
        });

        return {
            html: html,
            template: templateKey,
            templateName: template.name
        };
    },

    // Extract data from text description
    extractDataFromText(text) {
        const data = {};

        // Try to extract title
        const titleMatch = text.match(/(?:title|name|heading)[:\s]+([^\n,\.]+)/i) || 
                          text.match(/^([^,\.]+)/);
        if (titleMatch) {
            data.title = titleMatch[1].trim();
        } else {
            data.title = 'My Website';
        }

        // Try to extract description
        const descMatch = text.match(/(?:description|about|info)[:\s]+([^\n]+)/i) ||
                         text.match(/website for ([^\n,\.]+)/i);
        if (descMatch) {
            data.description = descMatch[1].trim();
        } else {
            data.description = 'A beautiful website created with AI Website Designer';
        }

        // Extract website type
        const typeMatch = text.match(/(?:for|website for)\s+([^\n,\.]+)/i);
        if (typeMatch) {
            data.websiteType = typeMatch[1].trim();
        }

        return data;
    },

    // Generate a section based on type
    generateSection(sectionType, data, index) {
        const component = ComponentLibrary.getComponent(sectionType);
        if (!component) {
            return this.generateDefaultSection(sectionType, data, index);
        }

        // Prepare data for component
        const sectionData = this.prepareSectionData(sectionType, data, index);

        // Render component
        return ComponentLibrary.renderComponent(sectionType, sectionData);
    },

    // Prepare data specific to each section type
    prepareSectionData(sectionType, data, index) {
        const sectionData = {};

        switch (sectionType) {
            case 'header':
                sectionData.logo = data.title || 'My Website';
                break;

            case 'hero':
                sectionData.title = data.title || 'Welcome to Our Website';
                sectionData.subtitle = data.description || 'We create amazing digital experiences';
                sectionData.buttonText = 'Get Started';
                break;

            case 'about':
                sectionData.title = 'About Us';
                sectionData.content = data.description || 'Learn more about what we do.';
                break;

            case 'section':
                sectionData.title = `Section ${index + 1}`;
                sectionData.content = 'Section content goes here.';
                break;

            case 'card':
                sectionData.title = `Card Title ${index + 1}`;
                sectionData.content = 'Card content description.';
                break;

            case 'form':
                sectionData.title = 'Contact Us';
                break;

            case 'footer':
                sectionData.copyright = `© ${new Date().getFullYear()} ${data.title || 'My Website'}. All rights reserved.`;
                break;
        }

        return sectionData;
    },

    // Generate default section if component doesn't exist
    generateDefaultSection(sectionType, data, index) {
        const imageUrl = `https://images.unsplash.com/photo-${1551434678 + index}-e076c223a692?w=1000&q=80`;
        return `
            <section class="component-section">
                <div class="component-container">
                    <div class="section-image">
                        <img src="${imageUrl}" alt="Section Image" loading="lazy">
                    </div>
                    <h2>${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} Section</h2>
                    <p>This is a ${sectionType} section.</p>
                </div>
            </section>
        `;
    }
};
