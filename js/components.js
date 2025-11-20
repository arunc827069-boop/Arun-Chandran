// Component Library Definitions

const ComponentLibrary = {
    components: {
        header: {
            name: 'Header',
            description: 'Website header with navigation',
            html: `
                <header class="component-header">
                    <div class="logo">My Website</div>
                    <nav>
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </nav>
                </header>
            `,
            css: '',
            js: '',
            editable: {
                logo: { type: 'text', label: 'Logo Text', selector: '.logo' },
                links: { type: 'array', label: 'Navigation Links', selector: 'nav ul' }
            }
        },
        hero: {
            name: 'Hero Section',
            description: 'Large hero banner with title and CTA',
            html: `
                <section class="component-hero" style="background-image: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%), url('https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1920&q=80'); background-size: cover; background-position: center;">
                    <div class="hero-content">
                        <h1>Welcome to Our Website</h1>
                        <p>We create amazing digital experiences</p>
                        <a href="#contact" class="component-button primary">Get Started</a>
                    </div>
                </section>
            `,
            css: '',
            js: '',
            editable: {
                title: { type: 'text', label: 'Title', selector: 'h1' },
                subtitle: { type: 'text', label: 'Subtitle', selector: 'p' },
                buttonText: { type: 'text', label: 'Button Text', selector: '.component-button' },
                backgroundColor: { type: 'color', label: 'Background Color', selector: '.component-hero' }
            }
        },
        button: {
            name: 'Button',
            description: 'Call-to-action button',
            html: `
                <div style="text-align: center; padding: 2rem;">
                    <a href="#" class="component-button primary">Click Me</a>
                </div>
            `,
            css: '',
            js: '',
            editable: {
                text: { type: 'text', label: 'Button Text', selector: '.component-button' },
                href: { type: 'text', label: 'Link URL', selector: '.component-button', attr: 'href' },
                style: { type: 'select', label: 'Style', selector: '.component-button', options: ['primary', 'secondary'] }
            }
        },
        card: {
            name: 'Card',
            description: 'Content card with title and text',
            html: `
                <div class="component-card">
                    <div class="card-image">
                        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80" alt="Card Image" loading="lazy">
                    </div>
                    <h3>Card Title</h3>
                    <p>Card description goes here. You can add more content as needed.</p>
                </div>
            `,
            css: '',
            js: '',
            editable: {
                title: { type: 'text', label: 'Title', selector: 'h3' },
                content: { type: 'textarea', label: 'Content', selector: 'p' }
            }
        },
        form: {
            name: 'Contact Form',
            description: 'Contact form with name, email, and message fields',
            html: `
                <section class="component-form">
                    <h2>Contact Us</h2>
                    <form>
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" required></textarea>
                        </div>
                        <button type="submit" class="component-button primary">Send Message</button>
                    </form>
                </section>
            `,
            css: '',
            js: '',
            editable: {
                title: { type: 'text', label: 'Form Title', selector: 'h2' }
            }
        },
        footer: {
            name: 'Footer',
            description: 'Website footer with copyright info',
            html: `
                <footer class="component-footer">
                    <p>&copy; 2024 My Website. All rights reserved.</p>
                    <p><a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a></p>
                </footer>
            `,
            css: '',
            js: '',
            editable: {
                copyright: { type: 'text', label: 'Copyright Text', selector: 'p:first-child' },
                links: { type: 'array', label: 'Footer Links', selector: 'p:last-child' }
            }
        },
        gallery: {
            name: 'Image Gallery',
            description: 'Grid gallery of images',
            html: `
                <section class="component-gallery">
                    <div class="component-gallery-item">
                        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80" alt="Image 1" loading="lazy">
                    </div>
                    <div class="component-gallery-item">
                        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80" alt="Image 2" loading="lazy">
                    </div>
                    <div class="component-gallery-item">
                        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80" alt="Image 3" loading="lazy">
                    </div>
                    <div class="component-gallery-item">
                        <img src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&q=80" alt="Image 4" loading="lazy">
                    </div>
                    <div class="component-gallery-item">
                        <img src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80" alt="Image 5" loading="lazy">
                    </div>
                    <div class="component-gallery-item">
                        <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80" alt="Image 6" loading="lazy">
                    </div>
                </section>
            `,
            css: '',
            js: '',
            editable: {
                images: { type: 'array', label: 'Images', selector: '.component-gallery' }
            }
        },
        about: {
            name: 'About Section',
            description: 'About section with heading and description',
            html: `
                <section class="component-about">
                    <div class="about-content">
                        <div class="about-image">
                            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80" alt="About Us" loading="lazy">
                        </div>
                        <div class="about-text">
                            <h2>About Us</h2>
                            <p>We are a passionate team dedicated to creating amazing digital experiences. Our mission is to help businesses succeed online through innovative design and development.</p>
                        </div>
                    </div>
                </section>
            `,
            css: '',
            js: '',
            editable: {
                title: { type: 'text', label: 'Title', selector: 'h2' },
                content: { type: 'textarea', label: 'Content', selector: 'p' }
            }
        },
        section: {
            name: 'Content Section',
            description: 'General content section with heading and text',
            html: `
                <section class="component-section">
                    <div class="component-container">
                        <div class="section-image">
                            <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1000&q=80" alt="Section Image" loading="lazy">
                        </div>
                        <h2>Section Title</h2>
                        <p>Section content goes here. You can add multiple paragraphs or other elements as needed.</p>
                    </div>
                </section>
            `,
            css: '',
            js: '',
            editable: {
                title: { type: 'text', label: 'Title', selector: 'h2' },
                content: { type: 'textarea', label: 'Content', selector: 'p' }
            }
        }
    },

    // Get component by key
    getComponent(key) {
        return this.components[key];
    },

    // Get all component keys
    getAllKeys() {
        return Object.keys(this.components);
    },

    // Render component HTML for preview
    renderComponent(key, data = {}) {
        const component = this.components[key];
        if (!component) return '';

        let html = component.html;
        
        // Replace editable content if provided
        if (component.editable && data) {
            Object.keys(component.editable).forEach(prop => {
                const editable = component.editable[prop];
                if (data[prop] !== undefined) {
                    if (editable.attr) {
                        // Set attribute
                        const regex = new RegExp(`(${editable.selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})([^>]*?)(>)`, 'gi');
                        html = html.replace(regex, (match, selector, attrs, closing) => {
                            if (!attrs.includes(`${editable.attr}=`)) {
                                return `${selector}${attrs} ${editable.attr}="${data[prop]}"${closing}`;
                            }
                            return match.replace(new RegExp(`${editable.attr}="[^"]*"`), `${editable.attr}="${data[prop]}"`);
                        });
                    } else {
                        // Replace text content
                        const regex = new RegExp(`(<${editable.selector}>)([^<]*)(</${editable.selector.split(' ')[0]}[^>]*>)`, 'gi');
                        html = html.replace(regex, `$1${data[prop]}$3`);
                    }
                }
            });
        }

        return html;
    }
};
