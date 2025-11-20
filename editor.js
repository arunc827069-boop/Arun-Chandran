// Drag and Drop Editor Functionality

const Editor = {
    selectedElement: null,
    draggedComponent: null,
    canvas: null,

    init() {
        this.canvas = document.getElementById('canvas');
        this.setupDragAndDrop();
        this.setupElementSelection();
        this.setupElementControls();
    },

    // Setup drag and drop from component library
    setupDragAndDrop() {
        // Allow drop on canvas
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'copy';
            }
        });

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const componentKey = e.dataTransfer.getData('text/plain');
            if (componentKey && ComponentLibrary.getComponent(componentKey)) {
                this.addComponentToCanvas(componentKey, e.clientX, e.clientY);
            }
        });

        // Setup component library items as draggable
        const componentList = document.getElementById('componentList');
        const componentKeys = ComponentLibrary.getAllKeys();

        componentKeys.forEach(key => {
            const component = ComponentLibrary.getComponent(key);
            const item = document.createElement('div');
            item.className = 'component-item';
            item.draggable = true;
            item.dataset.component = key;
            item.innerHTML = `
                <h3>${component.name}</h3>
                <p>${component.description}</p>
            `;

            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', key);
                this.draggedComponent = key;
            });

            componentList.appendChild(item);
        });
    },

    // Add component to canvas
    addComponentToCanvas(componentKey, x = null, y = null) {
        const component = ComponentLibrary.getComponent(componentKey);
        if (!component) return;

        // Remove placeholder if exists
        const placeholder = this.canvas.querySelector('.canvas-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        const element = document.createElement('div');
        element.className = 'canvas-element';
        element.dataset.component = componentKey;
        element.innerHTML = ComponentLibrary.renderComponent(componentKey);

        // Add element controls
        const controls = document.createElement('div');
        controls.className = 'element-controls';
        controls.innerHTML = `
            <button class="element-control-btn delete" title="Delete">×</button>
            <button class="element-control-btn duplicate" title="Duplicate">⧉</button>
            <button class="element-control-btn move-up" title="Move Up">↑</button>
            <button class="element-control-btn move-down" title="Move Down">↓</button>
        `;
        element.appendChild(controls);

        // Add to canvas
        if (this.canvas.children.length === 0) {
            this.canvas.appendChild(element);
        } else {
            this.canvas.insertBefore(element, this.canvas.firstChild);
        }

        // Setup element events
        this.setupElementEvents(element);

        // Select the new element
        this.selectElement(element);
    },

    // Setup element selection
    setupElementSelection() {
        this.canvas.addEventListener('click', (e) => {
            const element = e.target.closest('.canvas-element');
            if (element) {
                e.stopPropagation();
                this.selectElement(element);
            } else {
                this.deselectElement();
            }
        });
    },

    // Select an element
    selectElement(element) {
        // Deselect previous
        if (this.selectedElement) {
            this.selectedElement.classList.remove('selected');
        }

        // Select new
        this.selectedElement = element;
        element.classList.add('selected');

        // Update properties panel
        this.updatePropertiesPanel(element);
    },

    // Deselect current element
    deselectElement() {
        if (this.selectedElement) {
            this.selectedElement.classList.remove('selected');
            this.selectedElement = null;
        }

        // Clear properties panel
        const panel = document.getElementById('propertiesPanel');
        panel.innerHTML = '<p class="no-selection">No element selected</p>';
    },

    // Setup element-specific events
    setupElementEvents(element) {
        const controls = element.querySelector('.element-controls');

        // Delete button
        controls.querySelector('.delete').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Delete this element?')) {
                element.remove();
                this.deselectElement();
                this.checkPlaceholder();
            }
        });

        // Duplicate button
        controls.querySelector('.duplicate').addEventListener('click', (e) => {
            e.stopPropagation();
            const cloned = element.cloneNode(true);
            this.setupElementEvents(cloned);
            element.parentNode.insertBefore(cloned, element.nextSibling);
            this.selectElement(cloned);
        });

        // Move up button
        controls.querySelector('.move-up').addEventListener('click', (e) => {
            e.stopPropagation();
            const prev = element.previousElementSibling;
            if (prev && prev.classList.contains('canvas-element')) {
                element.parentNode.insertBefore(element, prev);
            }
        });

        // Move down button
        controls.querySelector('.move-down').addEventListener('click', (e) => {
            e.stopPropagation();
            const next = element.nextElementSibling;
            if (next && next.classList.contains('canvas-element')) {
                element.parentNode.insertBefore(next, element);
            }
        });

        // Make element draggable within canvas
        element.draggable = true;
        element.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            element.classList.add('dragging');
        });

        element.addEventListener('dragend', (e) => {
            element.classList.remove('dragging');
        });
    },

    // Update properties panel based on selected element
    updatePropertiesPanel(element) {
        const componentKey = element.dataset.component;
        const component = ComponentLibrary.getComponent(componentKey);

        if (!component || !component.editable) {
            const panel = document.getElementById('propertiesPanel');
            panel.innerHTML = '<p class="no-selection">No editable properties</p>';
            return;
        }

        const panel = document.getElementById('propertiesPanel');
        panel.innerHTML = '<h3>Edit Properties</h3>';

        Object.keys(component.editable).forEach(propKey => {
            const editable = component.editable[propKey];
            const group = document.createElement('div');
            group.className = 'property-group';

            const label = document.createElement('label');
            label.textContent = editable.label;
            group.appendChild(label);

            let input;

            switch (editable.type) {
                case 'text':
                    input = document.createElement('input');
                    input.type = 'text';
                    // Get current value from element
                    const textEl = element.querySelector(editable.selector);
                    if (textEl) {
                        input.value = editable.attr ? textEl.getAttribute(editable.attr) || '' : textEl.textContent || '';
                    }
                    input.addEventListener('input', (e) => {
                        this.updateElementProperty(element, propKey, e.target.value, editable);
                    });
                    break;

                case 'textarea':
                    input = document.createElement('textarea');
                    const textareaEl = element.querySelector(editable.selector);
                    if (textareaEl) {
                        input.value = textareaEl.textContent || '';
                    }
                    input.addEventListener('input', (e) => {
                        this.updateElementProperty(element, propKey, e.target.value, editable);
                    });
                    break;

                case 'color':
                    input = document.createElement('input');
                    input.type = 'color';
                    const colorEl = element.querySelector(editable.selector);
                    if (colorEl) {
                        const styles = window.getComputedStyle(colorEl);
                        input.value = this.rgbToHex(styles.backgroundColor) || '#667eea';
                    }
                    input.addEventListener('change', (e) => {
                        this.updateElementProperty(element, propKey, e.target.value, editable);
                    });
                    break;

                case 'select':
                    input = document.createElement('select');
                    if (editable.options) {
                        editable.options.forEach(option => {
                            const optionEl = document.createElement('option');
                            optionEl.value = option;
                            optionEl.textContent = option.charAt(0).toUpperCase() + option.slice(1);
                            input.appendChild(optionEl);
                        });
                    }
                    input.addEventListener('change', (e) => {
                        this.updateElementProperty(element, propKey, e.target.value, editable);
                    });
                    break;
            }

            if (input) {
                group.appendChild(input);
                panel.appendChild(group);
            }
        });
    },

    // Update element property
    updateElementProperty(element, propKey, value, editable) {
        const target = element.querySelector(editable.selector);
        if (!target) return;

        if (editable.attr) {
            target.setAttribute(editable.attr, value);
        } else if (editable.type === 'color') {
            target.style.backgroundColor = value;
        } else {
            target.textContent = value;
        }
    },

    // Convert RGB to hex
    rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return '#667eea';
        const match = rgb.match(/\d+/g);
        if (!match || match.length < 3) return '#667eea';
        return '#' + match.slice(0, 3).map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    },

    // Setup element controls
    setupElementControls() {
        // Clear canvas button
        document.getElementById('clearBtn').addEventListener('click', () => {
            if (confirm('Clear all elements from canvas?')) {
                this.clearCanvas();
            }
        });
    },

    // Clear canvas
    clearCanvas() {
        this.canvas.innerHTML = `
            <div class="canvas-placeholder">
                <p>Enter a website description below or drag components from the library to start building.</p>
            </div>
        `;
        this.deselectElement();
    },

    // Check if placeholder is needed
    checkPlaceholder() {
        if (this.canvas.querySelectorAll('.canvas-element').length === 0) {
            this.clearCanvas();
        }
    },

    // Generate website from template
    generateWebsite(text) {
        const result = TemplateEngine.generateWebsite(text);
        
        // Clear canvas
        this.clearCanvas();

        // Parse HTML and add sections as elements
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${result.html}</div>`, 'text/html');
        const sections = doc.body.firstChild.children;

        Array.from(sections).forEach((section, index) => {
            // Try to match section to component type
            const sectionType = this.detectComponentType(section);
            
            const element = document.createElement('div');
            element.className = 'canvas-element';
            element.dataset.component = sectionType;
            element.innerHTML = section.outerHTML;

            // Add controls
            const controls = document.createElement('div');
            controls.className = 'element-controls';
            controls.innerHTML = `
                <button class="element-control-btn delete" title="Delete">×</button>
                <button class="element-control-btn duplicate" title="Duplicate">⧉</button>
                <button class="element-control-btn move-up" title="Move Up">↑</button>
                <button class="element-control-btn move-down" title="Move Down">↓</button>
            `;
            element.appendChild(controls);

            this.setupElementEvents(element);
            this.canvas.appendChild(element);
        });

        // Remove placeholder
        const placeholder = this.canvas.querySelector('.canvas-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
    },

    // Detect component type from HTML element
    detectComponentType(element) {
        const classList = Array.from(element.classList);
        
        if (classList.some(c => c.includes('header'))) return 'header';
        if (classList.some(c => c.includes('hero'))) return 'hero';
        if (classList.some(c => c.includes('footer'))) return 'footer';
        if (classList.some(c => c.includes('form'))) return 'form';
        if (classList.some(c => c.includes('gallery'))) return 'gallery';
        if (classList.some(c => c.includes('about'))) return 'about';
        if (classList.some(c => c.includes('card'))) return 'card';
        if (classList.some(c => c.includes('section'))) return 'section';
        
        return 'section';
    },

    // Get canvas HTML
    getCanvasHTML() {
        const elements = this.canvas.querySelectorAll('.canvas-element');
        let html = '';

        elements.forEach(element => {
            // Clone element and remove controls
            const clone = element.cloneNode(true);
            const controls = clone.querySelector('.element-controls');
            if (controls) {
                controls.remove();
            }
            // Remove canvas-element class
            clone.classList.remove('canvas-element', 'selected');
            html += clone.innerHTML;
        });

        return html;
    }
};
