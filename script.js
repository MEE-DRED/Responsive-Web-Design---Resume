
// Theme Toggle Functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.body = document.body;
        this.currentTheme = localStorage.getItem('theme') || 'light';

        this.init();
    }

    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);

        // Add event listener
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    setTheme(theme) {
        if (theme === 'dark') {
            this.body.classList.add('dark-mode');
            this.themeIcon.textContent = '🩺';
        } else {
            this.body.classList.remove('dark-mode');
            this.themeIcon.textContent = '💊';
        }
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.navList = document.getElementById('navList');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');

        this.init();
    }

    init() {
        // Mobile menu toggle
        this.menuToggle.addEventListener('click', () => {
            this.navList.classList.toggle('active');
        });

        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu after clicking
                this.navList.classList.remove('active');
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav') && this.navList.classList.contains('active')) {
                this.navList.classList.remove('active');
            }
        });
    }

    updateActiveNavLink() {
        const headerHeight = document.querySelector('header').offsetHeight;
        const scrollPosition = window.scrollY + headerHeight + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Form Manager
class FormManager {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.successMessage = document.getElementById('successMessage');
        this.errorMessage = document.getElementById('errorMessage');
        this.successModal = document.getElementById('successModal');
        this.closeModal = document.getElementById('closeModal');

        this.init();
    }

    init() {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        this.closeModal.addEventListener('click', () => {
            this.successModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === this.successModal) {
                this.successModal.style.display = 'none';
            }
        });

        // Real-time form validation
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error');

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Name validation (no numbers)
        if (field.name === 'name' && value) {
            const nameRegex = /^[a-zA-Z\s]+$/;
            if (!nameRegex.test(value)) {
                isValid = false;
                errorMessage = 'Name should only contain letters and spaces';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';

        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    handleFormSubmission() {
        const formData = new FormData(this.contactForm);
        const formObject = {};
        let isFormValid = true;

        // Validate all fields
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
            formObject[input.name] = input.value.trim();
        });

        if (!isFormValid) {
            this.showErrorMessage('Please correct the errors above');
            return;
        }

        // Hide previous messages
        this.hideMessages();

        // Simulate form submission with loading state
        const submitBtn = this.contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate API call delay
        setTimeout(() => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Show success
            this.showSuccessModal();
            this.contactForm.reset();

            // Clear any remaining field errors
            inputs.forEach(input => {
                this.clearFieldError(input);
            });

            // Log form data (in real app, this would be sent to server)
            console.log('Form submitted:', formObject);
        }, 1500);
    }

    showSuccessModal() {
        this.successModal.style.display = 'block';
    }

    showErrorMessage(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
        this.successMessage.style.display = 'none';

        setTimeout(() => {
            this.hideMessages();
        }, 5000);
    }

    hideMessages() {
        this.successMessage.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.init();
    }

    init() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            observer.observe(section);
        });

        // Add hover effects to interactive elements
        this.addHoverEffects();
    }

    addHoverEffects() {
        // Skill categories hover effect
        const skillCategories = document.querySelectorAll('.skill-category');
        skillCategories.forEach(category => {
            category.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });

            category.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Project cards hover effect
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Download Manager
class DownloadManager {
    constructor() {
        this.downloadBtn = document.getElementById('downloadBtn');
        this.init();
    }

    init() {
        this.downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleDownload();
        });
    }

    handleDownload() {
        // In a real application, this would download the actual PDF
        // For demo purposes, we'll show an alert
        const originalText = this.downloadBtn.textContent;
        this.downloadBtn.textContent = 'Preparing Download...';

        setTimeout(() => {
            this.downloadBtn.textContent = originalText;
            alert('PDF download would start here');

            // Create a sample download link 
            // const link = document.createElement('a');
            // link.href = 'WEBSITE/EBOMAH MILDRED EWENRIM__CV.main.pdf';
            // link.download = 'EBOMAH MILDRED EWENRIM__CV.main.pdf';
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
        }, 1000);
    }
}

// Scroll to Top Functionality
class ScrollManager {
    constructor() {
        this.createScrollToTopButton();
        this.init();
    }

    createScrollToTopButton() {
        const scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '↑';
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');

        // Add styles
        Object.assign(scrollBtn.style, {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(45deg, #3498db, #e74c3c)',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            opacity: '0',
            visibility: 'hidden',
            transition: 'all 0.3s ease',
            zIndex: '1000',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        });

        document.body.appendChild(scrollBtn);
        this.scrollBtn = scrollBtn;
    }

    init() {
        // Show/hide scroll button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                this.scrollBtn.style.opacity = '1';
                this.scrollBtn.style.visibility = 'visible';
            } else {
                this.scrollBtn.style.opacity = '0';
                this.scrollBtn.style.visibility = 'hidden';
            }
        });

        // Scroll to top when clicked
        this.scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Add hover effect
        this.scrollBtn.addEventListener('mouseenter', () => {
            this.scrollBtn.style.transform = 'scale(1.1)';
        });

        this.scrollBtn.addEventListener('mouseleave', () => {
            this.scrollBtn.style.transform = 'scale(1)';
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${Math.round(loadTime)}ms`);

            // Lazy load non-critical elements
            this.lazyLoadElements();
        });
    }

    lazyLoadElements() {
        // Lazy load social media icons and other non-critical elements
        const socialLinks = document.querySelectorAll('.social-links a');
        socialLinks.forEach(link => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';

            setTimeout(() => {
                link.style.transition = 'all 0.5s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, Math.random() * 1000 + 500);
        });
    }
}

// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        // Add keyboard navigation support
        this.addKeyboardNavigation();

        // Add focus indicators
        this.addFocusIndicators();

        // Add screen reader support
        this.addScreenReaderSupport();
    }

    addKeyboardNavigation() {
        // Allow keyboard navigation through sections
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Enhanced tab navigation is handled by browser
                return;
            }

            // Add custom keyboard shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
                        break;
                    case '2':
                        e.preventDefault();
                        document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
                        break;
                    case '3':
                        e.preventDefault();
                        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                        break;
                }
            }
        });
    }

    addFocusIndicators() {
        // Add visible focus indicators for keyboard users
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', function () {
                this.style.outline = '2px solid #3498db';
                this.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', function () {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
    }

    addScreenReaderSupport() {
        // Add ARIA labels and descriptions where needed
        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section, index) => {
            if (!section.getAttribute('aria-label')) {
                const heading = section.querySelector('h2');
                if (heading) {
                    section.setAttribute('aria-labelledby', heading.id || `section-${index}`);
                    if (!heading.id) {
                        heading.id = `section-${index}`;
                    }
                }
            }
        });
    }
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Mildred Ebomah Resume Website...');

    // Initialize all components
    new ThemeManager();
    new NavigationManager();
    new FormManager();
    new AnimationManager();
    new DownloadManager();
    new ScrollManager();
    new PerformanceMonitor();
    new AccessibilityManager();

    console.log('All components initialized successfully!');

    // Add loading complete class
    document.body.classList.add('loaded');
});

// Add error handling for uncaught errors
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// Add styles for error states and additional interactive elements
const additionalStyles = `
    <style>
        .error {
            border-color: #e74c3c !important;
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
        }

        .field-error {
            color: #e74c3c;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }

        .loaded {
            animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .scroll-to-top:hover {
            transform: scale(1.1) !important;
        }

        /* Enhanced focus styles */
        *:focus {
            outline: 2px solid #3498db !important;
            outline-offset: 2px !important;
        }

        /* Loading animation for submit button */
        .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        /* Smooth transitions for all interactive elements */
        .skill-category,
        .project-card,
        .experience-item,
        .nav-list a,
        .submit-btn,
        .download-btn {
            transition: all 0.3s ease !important;
        }
    </style>
`;