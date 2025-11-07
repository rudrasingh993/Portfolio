// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    const isMobile = () => /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

    // Dynamically load fluid simulation scripts on all devices.
    // The animation will be paused/resumed based on visibility.
    const datGuiScript = document.createElement('script');
    datGuiScript.src = 'dat.gui.min.js';
    document.body.appendChild(datGuiScript);

    datGuiScript.onload = () => {
        const fluidScript = document.createElement('script');
        fluidScript.src = 'script2.js';
        document.body.appendChild(fluidScript);

        fluidScript.onload = () => {
            // Hide the dat.gui panel once the script is loaded
            const guiContainer = document.querySelector('.dg.main');
            if (guiContainer) {
                guiContainer.style.display = 'none';
            }
            // The fluid intro logic will now handle pausing/resuming, so we call it here.
            initFluidIntro();
        };
    };

    // Initialize all functionality, passing mobile status to functions that need it
    initTheme();
    initNavigation();
    initScrollEffects();
    initTypingAnimation();
    initSkillBars();
    initChatbot();
    initProjectModals();
});

// Fluid Intro Interactive Features
function initFluidIntro() {
    const fluidSection = document.getElementById('fluid-intro');
    const fluidLetter = document.getElementById('fluidLetter');
    const navbar = document.getElementById('navbar');
    const scrollIndicator = document.getElementById('scrollIndicator');
    
    if (!fluidSection || !fluidLetter) return;
    
    // Scroll indicator click handler - scroll to next section
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const homeSection = document.getElementById('home');
            if (homeSection) {
                homeSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Interactive R text distortion effect
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    
    fluidSection.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        fluidLetter.style.transform = '';
    });
    
    fluidSection.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = (e.clientX - dragStartX) * 0.1;
            const deltaY = (e.clientY - dragStartY) * 0.1;
            const skewX = Math.max(-30, Math.min(30, deltaX));
            const skewY = Math.max(-30, Math.min(30, deltaY));
            
            fluidLetter.style.transform = `
                skewX(${skewX}deg) 
                skewY(${-skewY}deg) 
                scale(${1 + Math.abs(deltaX) * 0.002})
            `;
        }
    });
    
    // Navbar transparency control
    if (navbar) {
        // Use IntersectionObserver to toggle transparency
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navbar.classList.add('transparent');
                        navbar.classList.remove('scrolled');
                    } else {
                        navbar.classList.remove('transparent');
                        // Check scroll position for scrolled class
                        if (window.scrollY > 50) {
                            navbar.classList.add('scrolled');
                        }
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(fluidSection);
        } else {
            // Fallback: use scroll position
            window.addEventListener('scroll', () => {
                const fluidHeight = fluidSection.offsetHeight;
                const scrollPos = window.scrollY;
                const isInFluidSection = scrollPos < fluidHeight - 50;
                
                if (isInFluidSection) {
                    navbar.classList.add('transparent');
                    navbar.classList.remove('scrolled');
                } else {
                    navbar.classList.remove('transparent');
                    if (scrollPos > 50) {
                        navbar.classList.add('scrolled');
                    }
                }
            });
        }

        // Pause/Resume fluid animation based on visibility
        if ('IntersectionObserver' in window && typeof window.toggleFluidAnimation === 'function') {
            const fluidObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Section is visible, resume animation
                        window.toggleFluidAnimation(false);
                    } else {
                        // Section is not visible, pause animation
                        window.toggleFluidAnimation(true);
                    }
                });
            }, { threshold: 0.01 }); // Trigger even if 1% is visible

            fluidObserver.observe(fluidSection);
        }
    }
}

// Project Spotlight Modal
function initProjectModals() {
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('projectModal');
    const overlay = document.getElementById('projectModalOverlay');
    const closeBtn = document.getElementById('modalCloseBtn');

    if (!modal || !overlay || !closeBtn) return;

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            populateAndShowModal(card);
        });
    });

    function populateAndShowModal(card) {
        // Get data from card
        const title = card.dataset.title;
        const description = card.dataset.description;
        const image = card.dataset.image;
        const tech = card.dataset.tech.split(',');
        const github = card.dataset.github;
        const live = card.dataset.live;

        // Get modal elements
        const modalImage = document.getElementById('modalProjectImage');
        const modalTitle = document.getElementById('modalProjectTitle');
        const modalTech = document.getElementById('modalProjectTech');
        const modalDescription = document.getElementById('modalProjectDescription');
        const modalGithubLink = document.getElementById('modalGithubLink');
        const modalLiveLink = document.getElementById('modalLiveLink');

        // Populate modal
        modalImage.src = image;
        modalImage.alt = title;
        modalTitle.textContent = title;
        modalDescription.textContent = description;

        modalTech.innerHTML = '';
        tech.forEach(t => {
            const techTag = document.createElement('span');
            techTag.className = 'tech-tag';
            techTag.innerHTML = `<span>${t}</span>`;
            modalTech.appendChild(techTag);
        });

        modalGithubLink.href = github;
        modalLiveLink.href = live;

        // Show/hide links based on availability
        modalGithubLink.style.display = github === '#' ? 'none' : 'flex';
        modalLiveLink.style.display = live === '#' ? 'none' : 'flex';

        // Show modal
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
}
// Enhanced Theme Toggle with Smooth Transitions
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Load saved theme or use system preference
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDark.matches ? 'dark' : 'light');
    
    setTheme(initialTheme);
    
    // Theme toggle event
    themeToggle.addEventListener('click', function(e) {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Create elegant transition effect
        createThemeTransition(e);
        
        setTimeout(() => {
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        }, 150);
    });
    
    // Listen for system theme changes
    prefersDark.addListener((e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function createThemeTransition(event) {
    const transition = document.createElement('div');
    const rect = event.target.closest('.theme-toggle').getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    transition.style.cssText = `
        position: fixed;
        top: ${y}px;
        left: ${x}px;
        width: 0;
        height: 0;
        background: var(--accent-primary);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9999;
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        opacity: 0.1;
    `;
    
    document.body.appendChild(transition);
    
    requestAnimationFrame(() => {
        const size = Math.max(window.innerWidth, window.innerHeight) * 2.5;
        transition.style.width = size + 'px';
        transition.style.height = size + 'px';
    });
    
    setTimeout(() => transition.remove(), 800);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.content = theme === 'dark' ? '#0f0f0f' : '#fdfcfb';
    }
}

// Professional Navigation
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');
    const navLinksArray = document.querySelectorAll('.nav-link');

    if (!hamburger || !navLinks || !navbar) return;

    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on nav links
    navLinksArray.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            if (window.innerWidth <= 768) {
                document.body.style.overflow = '';
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active nav link based on scroll position
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Enhanced Typing Animation
function initTypingAnimation() {
    const roles = [
        'AI/ML Enthusiast',
        'Creative Developer', 
        
        'Frontend Specialist',
        'Problem Solver'
    ];
    
    const roleElement = document.getElementById('roleText');
    if (!roleElement) return;
    
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    function typeRole() {
        const currentRole = roles[currentRoleIndex];
        
        if (!isDeleting) {
            roleElement.textContent = currentRole.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            
            if (currentCharIndex === currentRole.length) {
                setTimeout(() => {
                    isDeleting = true;
                    typeRole();
                }, 2000);
                return;
            }
        } else {
            roleElement.textContent = currentRole.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            
            if (currentCharIndex === 0) {
                isDeleting = false;
                currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            }
        }
        
        const timeout = isDeleting ? 50 : 100;
        setTimeout(typeRole, timeout);
    }

    // Start typing animation after page load
    setTimeout(typeRole, 1500);
}

// Professional Scroll Effects
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special animations for different elements
                if (entry.target.classList.contains('skill-item')) {
                    setTimeout(() => animateSkillBar(entry.target), 200);
                }
                
                if (entry.target.classList.contains('story-card')) {
                    const cards = document.querySelectorAll('.story-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }, index * 150);
                }
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
}

// Skill Bars Animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.progress-bar');
    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });
}

function animateSkillBar(skillItem) {
    const progressBar = skillItem.querySelector('.progress-bar');
    if (progressBar && !progressBar.animated) {
        const targetWidth = progressBar.getAttribute('data-width');
        
        setTimeout(() => {
            progressBar.style.width = targetWidth;
            progressBar.animated = true;
        }, 300);
    }
}

// Enhanced Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        const isValid = validateForm();
        if (!isValid) return;
        
        // Get form data
        const formData = new FormData(contactForm);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Simulate form submission with professional feedback
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalContent = submitButton.innerHTML;
        
        // Loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        setTimeout(() => {
            // Success state
            submitButton.classList.remove('loading');
            submitButton.classList.add('success');
            submitButton.innerHTML = '<span class="btn-text">Message Sent!</span><div class="btn-arrow">✓</div>';
            
            setTimeout(() => {
                submitButton.innerHTML = originalContent;
                submitButton.classList.remove('success');
                submitButton.disabled = false;
                contactForm.reset();
            }, 2000);
        }, 1500);
        
        console.log('Form submitted:', formObject);
    });
    
    // Form validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidation);
    });
}

function validateForm() {
    const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing validation classes
    field.classList.remove('valid', 'invalid');
    
    if (field.hasAttribute('required') && !value) {
        field.classList.add('invalid');
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('invalid');
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    field.classList.add('valid');
    clearFieldError(field);
    return true;
}

function clearValidation(e) {
    const field = e.target;
    field.classList.remove('valid', 'invalid');
    clearFieldError(field);
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Creative Animations and Interactions
function initCreativeAnimations(isMobile) {
    // Profile frame 3D effect
    // Disable on mobile for performance
    if (isMobile) return;

    const profileFrame = document.querySelector('.profile-frame');
    if (profileFrame) {
        profileFrame.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const rotateX = (mouseY / rect.height) * 5;
            const rotateY = (mouseX / rect.width) * -5;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        profileFrame.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }
    
    // Social links platform-specific hover colors
    const socialLinks = document.querySelectorAll('.social-link[data-platform]');
    socialLinks.forEach(link => {
        const platform = link.getAttribute('data-platform');
        let hoverColor;
        
        switch(platform) {
            case 'github': hoverColor = '#333'; break;
            case 'linkedin': hoverColor = '#0077b5'; break;
            case 'telegram': hoverColor = '#1da1f2'; break;
            case 'discord': hoverColor = '#5865F2'; break;
            default: hoverColor = 'var(--accent-primary)'; // Fallback color
        }
        
        link.addEventListener('mouseenter', function() {
            this.style.setProperty('--hover-color', hoverColor);
        });
    });
    
    // Decorative stars interaction
    const stars = document.querySelectorAll('.deco-star');
    stars.forEach(star => {
        star.addEventListener('mouseenter', function() {
            this.style.animation = 'gentleTwinkle 0.6s ease-in-out 2';
        });
    });
    
    // Floating shapes interaction on scroll
    // Disable on mobile for performance
    window.addEventListener('scroll', throttle(() => {
        if (isMobile) return;

        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.floating-shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = scrolled * speed;
            shape.style.transform = `translateY(${yPos}px)`;
        });
    }, 16));
}

// Utility Functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Page Loading Animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Performance Optimizations
const resizeObserver = new ResizeObserver(debounce(() => {
    // Handle resize events efficiently
    const isMobile = window.innerWidth <= 768;
    document.documentElement.style.setProperty('--is-mobile', isMobile ? '1' : '0');
}, 100));

resizeObserver.observe(document.documentElement);

// Console Branding
console.log('%c🏛️ Welcome to my  Portfolio!', 
    'color: #8b6f47; font-size: 24px; font-weight: 600; font-family: "Playfair Display", serif;');

const knowledgeBase = {
    "name": "Rudra Pratap Singh",
    "hello|hi": "Hello there! I'm Rudra's digital assistant. Feel free to ask me anything about his work and skills.",
    "who are you|what are you": "I am Rudra's portfolio chatbot. I can answer questions about Rudra Pratap Singh: his skills, projects, goals, devices, and preferences.",
    "who is rudra|who's rudra": "Rudra Pratap Singh is a passionate AI/ML enthusiast and creative web developer building portfolio projects, games, and AI features. He's focused on learning and making practical projects for his B.Tech / AI career path.",
    "email": "rudrasingh14513@gmail.com",
    "contact|how to contact": "The best way to contact Rudra is via the contact form on his site or by email at rudrasingh14513@gmail.com.",
  
    // Skills & technical profile
    "skills|what are your skills": "Rudra is a versatile developer with a strong foundation in both frontend and backend technologies. His toolkit includes React, Next.js, Node.js, Python, FastAPI, and various databases. He's also proficient in design tools like Figma. For a detailed list, check out the 'Skills' section!",
    "technical craft": "Rudra writes clean, maintainable code and prefers minimal, thoughtful design — 'less is more'.",
  
    // Projects & portfolio
    "what is this website": "This is Rudra Pratap Singh's personal portfolio showcasing his projects, skills, and creative journey.",
    "projects|what are the projects": "Rudra is building projects including games, AI-powered chatbots, e-commerce demos, and portfolio showcase apps. Several items are in progress and will be posted soon.",
    "portfolio features": "Features planned: AI chatbot, special admin login, showcase of games and e-commerce projects, and polished UI/UX for each project.",
  
    // Career & education
    "education status": "Rudra completed 12th grade studies and took a gap year (2024–2025) to focus on skills, exam prep (JEE, BITSAT, VITJEE), and portfolio development.",
    "career goals": "Rudra aims to pursue AI/ML in B.Tech, build an AI/ML portfolio, learn model-building, and ultimately work towards building his own LLM and a semiconductor plant in India.",
    "roadmap": "Interested in AI/ML and Data Science — focus on math, Python, ML libraries, project-based portfolio, internships, and building demonstrable systems.",
  
    // Devices / hardware / audio
    "devices": "Primary phone: Realme Narzo 60 Pro. Also owns Samsung Galaxy J7 Prime (SM-G610F/DD, rooted). Audio gear: Sony WH-1000XM5 and Audio-Technica M50xBT2.",
    "headphones": "Rudra prefers high-quality sound with deep bass; owns Sony WH-1000XM5 and Audio-Technica M50xBT2.",
  
    // Personal & preferences
    "name prefer": "Rudra (Rudra Pratap Singh)",
    "diet": "Vegetarian.",
    "fitness level": "Beginner in gym training; prefers a mix of machines and free weights.",
    "gym schedule": "Usually goes to the gym 4:00 PM to 5:30 PM on all days except Sundays and Wednesdays.",
    "supplements": "Started taking creatine on 2025-02-21, taken pre-workout.",
    "body stats": "Height: 6'2\". Weight: ~87 kg (last recorded 2024-11-29). On a calorie-deficit diet for weight loss.",
    "beard": "Patchy beard growth that curls; prefers to keep beard short.",
    "age & birthday": "Birthday: December 17. (Age recorded in convo: 18 on 2024-11-29.)",
  
    // Skin & grooming
    "skin type": "Oily, sweaty skin with concerns: tan, acne spots, occasional pimples, persistently oily.",
    "skincare products": "Uses Mamaearth Ubtan Face Wash, Mamaearth Vitamin C Daily Glow Face Serum, Mamaearth Tea Tree Face Serum, Rose Water, Lakme 50 PA+++ Gel Light Sunscreen. Also has Nivea moisturizer cream and a Beardo activated charcoal peel-off mask.",
    "skincare preferences": "Prefers budget-friendly options. Likes Minimalist 2% Salicylic Acid Face Wash and is considering Minimalist B5 Moisturizer.",
    
    // UX / product preferences
    "product preferences": "Budget-friendly skincare; high-quality audio with deep bass; accessible, practical web projects.",
    
    // Development preferences & projects details
    "game target audience": "Teens.",
    "game concept": "Web-based simulation/adventure game with a funny theme that teaches basic Python programming.",
    "captcha system": "Developing a CAPTCHA that presents calculus and trigonometry questions and shows a new question after successful completion.",
    "web goals": "Wants portfolio to auto-update on new GitHub commits and be hosted on Vercel. Uses modern web stacks and cares about clean UI and OG tags.",
    
    // Tools & coding notes encountered in convo
    "recent technical issues": "Examples discussed: Gemini CLI node engine error (requires Node >=20), MusicKit CSP frame-ancestors issue, Vercel output directory config errors.",
    "tech interests": "AI/ML model building, LLMs, portfolio sites, game dev, and learning dev tooling.",
    
    // Social & content creation
    "social goals": "Wants to start Instagram and YouTube, learn photo/video editing, and build a presence while making technical content.",
    "video editing": "Looking for good, free, simple video editing platforms for personal use.",
    
    // Fallbacks & fun bits
    "tell me a joke": "Why don't scientists trust atoms? Because they make up everything!",
    "meaning of life": "Rudra believes in living a life of purpose, passion, and continuous learning.",
    
    // Default fallback
    "default": "I'm sorry—I can only answer questions about Rudra Pratap Singh's portfolio and preferences. If you want to update anything, tell me what to change."
};

async function getBotResponse(userInput, chatHistory) {
    // All logic, including local search and API calls, is now offloaded to the worker
    // to prevent blocking the main thread. This keeps the UI and animations smooth.
    return new Promise((resolve, reject) => {
        // We assume 'chat-worker.js' exists and is configured correctly.
        const worker = new Worker('chat-worker.js');

        // The worker will now return a stream for AI responses, or a direct object for local ones.
        worker.onmessage = (event) => {
            resolve(event.data);
            worker.terminate();
        };

        worker.onerror = (error) => {
            console.error('Error in chat worker:', error);
            reject(new Error("Worker error: " + error.message));
            worker.terminate();
        };

        // Send the user input and history to the worker to start processing
        worker.postMessage({ userInput, chatHistory, knowledgeBase });
    });
}
// Chatbot functionality
function initChatbot() {
    const chatIcon = document.getElementById('chatIcon');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatClear = document.getElementById('chatClear');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');

    const CHAT_HISTORY_KEY = 'rudra_chat_history';
    let chatHistory = [];

    // Saves the current chat history to localStorage
    function saveHistory() {
        try {
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
        } catch (error) {
            console.error('Could not save chat history:', error);
        }
    }

    // Loads chat history from localStorage and displays it
    function loadHistory() {
        try {
            chatMessages.innerHTML = ''; // Clear any existing messages first
            const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
            if (savedHistory && JSON.parse(savedHistory).length > 0) {
                chatHistory = JSON.parse(savedHistory);
                chatHistory.forEach(msg => appendMessage(msg.text, msg.className, false)); // Don't save while loading
            } else {
                // If no history, add and save the initial bot message
                appendMessage('Hello! How can I help you?', 'bot-message');
            }
        } catch (error) {
            console.error('Could not load chat history:', error);
            // Fallback to default message if loading fails
            appendMessage('Hello! How can I help you?', 'bot-message');
        }
    }

    // Display suggested questions as chips in the chat flow
    function showSuggestions(suggestions) {
        // Remove any existing suggestion chips first
        const existingSuggestions = document.querySelector('.message-suggestions');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }

        if (!suggestions || suggestions.length === 0) return;

        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'message-suggestions';

        suggestions.forEach(suggestionText => {
            const chip = document.createElement('button');
            chip.className = 'suggestion-chip';
            chip.textContent = suggestionText;
            chip.addEventListener('click', () => {
                chatInput.value = suggestionText;
                sendMessage();
            });
            suggestionsContainer.appendChild(chip);
        });

        chatMessages.appendChild(suggestionsContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatIcon.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    chatClear.addEventListener('click', () => {
        chatHistory = [];
        saveHistory();
        chatMessages.innerHTML = '';
        // Add and save the initial bot message after clearing
        appendMessage('Hello! How can I help you?', 'bot-message');
        // Show default suggestions after clearing
        showSuggestions([
            "What are his main skills?",
            "Tell me about a project.",
            "How do I contact him?"
        ]);
    });

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const userInput = chatInput.value.trim();
        if (userInput === '') return;

        // Remove old suggestions when a new message is sent
        const existingSuggestions = document.querySelector('.message-suggestions');
        if (existingSuggestions) existingSuggestions.remove();

        // Disable input while processing

        chatInput.disabled = true;
        chatSend.disabled = true;

        appendMessage(userInput, 'user-message'); // This will also save the user message
        chatInput.value = '';

        // Show loading indicator
        const loadingMessage = appendMessage('Thinking...', 'bot-message loading-message', false);

        try {
            const workerResponse = await getBotResponse(userInput, chatHistory);

            if (workerResponse.type === 'local') {
                // Handle instant local response
                loadingMessage.remove();
                appendMessage(workerResponse.response, 'bot-message');
                showSuggestions(workerResponse.suggestions);
            } else if (workerResponse.type === 'stream') {
                // Handle streaming AI response by calling our secure API endpoint
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userInput, chatHistory, knowledgeBase }),
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.statusText}`);
                }

                // Create a new message element to stream into
                loadingMessage.remove();
                const botMessageContainer = appendMessage('', 'bot-message', false);
                const botMessageElement = botMessageContainer.querySelector('.message');

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullResponseText = '';
                let suggestionsText = '';
                let suggestionsFound = false;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const jsonChunks = chunk.replace(/^data: /gm, '').split('\n').filter(s => s.trim());

                    for (const jsonChunk of jsonChunks) {
                        try {
                            const parsed = JSON.parse(jsonChunk);
                            let textChunk = parsed.candidates[0].content.parts[0].text;

                            if (suggestionsFound) {
                                suggestionsText += textChunk;
                            } else if (textChunk.includes('[SUGGESTIONS]')) {
                                suggestionsFound = true;
                                const parts = textChunk.split('[SUGGESTIONS]');
                                textChunk = parts[0];
                                suggestionsText = parts[1] || '';
                            }

                            if (!suggestionsFound) {
                                fullResponseText += textChunk;
                                renderMessageContent(botMessageElement, fullResponseText);
                                chatMessages.scrollTop = chatMessages.scrollHeight;
                            }
                        } catch (e) {
                            // Ignore parsing errors for incomplete chunks
                        }
                    }
                }

                // Finalize message content and save
                renderMessageContent(botMessageElement, fullResponseText, true); // Final render with highlighting
                chatHistory.push({ text: fullResponseText, className: 'bot-message' });
                saveHistory();
                showSuggestions(suggestionsText.split('|').filter(s => s.trim()));
            }
        } catch (error) {
            console.error('Chatbot Error:', error);
            loadingMessage.remove();
            appendMessage("I'm sorry, something went wrong. Please try again.", 'bot-message');
        } finally {
            chatInput.disabled = false;
            chatSend.disabled = false;
            chatInput.focus();
        }
    }

    function appendMessage(text, className, shouldSave = true) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        const messageElement = document.createElement('div');
        messageElement.className = `message ${className || ''}`;

        // Regex to find markdown-style code blocks
        const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
        let lastIndex = 0;
        let match;

        // Initial render. For streaming, this will be updated by renderMessageContent
        messageElement.textContent = text;
        messageContainer.appendChild(messageElement);

        // Check if the message is from the bot and contains a code block
        if (className.includes('bot-message') && codeBlockRegex.test(text)) {
            // Reset regex for execution
            codeBlockRegex.lastIndex = 0; 

            while ((match = codeBlockRegex.exec(text)) !== null) {
                // Add text before the code block
                if (match.index > lastIndex) {
                    const textNode = document.createElement('p');
                    textNode.textContent = text.substring(lastIndex, match.index);
                    messageElement.appendChild(textNode);
                }

                const [fullMatch, language, code] = match;
                
                // Create container for the code block
                const codeContainer = document.createElement('div');
                codeContainer.className = 'code-block-container';

                const pre = document.createElement('pre');
                const codeEl = document.createElement('code');
                if (language) {
                    codeEl.className = `language-${language}`;
                }
                codeEl.textContent = code.trim();
                pre.appendChild(codeEl);

                // Create copy button
                const copyButton = document.createElement('button');
                copyButton.className = 'copy-code-btn';
                copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(code.trim()).then(() => {
                        copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        setTimeout(() => {
                            copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
                        }, 2000);
                    });
                });

                codeContainer.appendChild(copyButton);
                codeContainer.appendChild(pre);
                messageElement.appendChild(codeContainer);

                lastIndex = codeBlockRegex.lastIndex;
            }

            // Add any remaining text after the last code block
            if (lastIndex < text.length) {
                const textNode = document.createElement('p');
                textNode.textContent = text.substring(lastIndex);
                messageElement.appendChild(textNode);
            }
        } else {
            // If no code block, just set the text content
            messageElement.textContent = text;
        }

        if (className.includes('bot-message') && !className.includes('loading-message')) {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-response-btn';
            copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
            copyButton.title = 'Copy response text';
            copyButton.addEventListener('click', () => {
                // We use the raw 'text' variable to copy content even from code blocks
                navigator.clipboard.writeText(text).then(() => {
                    copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
                    }, 2000);
                });
            });
            messageContainer.appendChild(copyButton);
        }

        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add to history and save, if required
        if (shouldSave) {
            chatHistory.push({ text, className });
            saveHistory();
        }

        return messageContainer; // Return the container so it can be removed if it's a loading message
    }

    /**
     * Renders message content, parsing for code blocks.
     * Can be called repeatedly for streaming text.
     * @param {HTMLElement} messageElement - The .message element to render into.
     * @param {string} text - The full text to render.
     * @param {boolean} isFinal - If true, applies final touches like syntax highlighting.
     */
    function renderMessageContent(messageElement, text, isFinal = false) {
        messageElement.innerHTML = ''; // Clear previous content

        const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
        let lastIndex = 0;
        let match;

        // Use a temporary regex object for each run
        const regex = new RegExp(codeBlockRegex);

        while ((match = regex.exec(text)) !== null) {
            // Add text before the code block
            if (match.index > lastIndex) {
                const textNode = document.createElement('p');
                textNode.textContent = text.substring(lastIndex, match.index);
                messageElement.appendChild(textNode);
            }

            const [fullMatch, language, code] = match;
            
            const pre = document.createElement('pre');
            // Add the language class for Prism.js. Normalize common names.
            const langClass = language.toLowerCase() || 'none';
            pre.className = `language-${langClass}`;

            const codeEl = document.createElement('code');
            codeEl.textContent = code.trim();
            pre.appendChild(codeEl);

            // On the final render, apply syntax highlighting
            if (isFinal && window.Prism) {
                Prism.highlightElement(codeEl);
            }

            // The copy button is now part of the <pre> element for Prism Toolbar
            if (isFinal) {
                pre.setAttribute('data-prismjs-copy', 'Copy');
                pre.setAttribute('data-prismjs-copy-success', 'Copied!');
            }

            messageElement.appendChild(pre);

            lastIndex = regex.lastIndex;
        }

        // Add any remaining text after the last code block
        if (lastIndex < text.length) {
            const textNode = document.createElement('p');
            textNode.textContent = text.substring(lastIndex);
            messageElement.appendChild(textNode);
        }

        // If the message is empty (e.g., at the start of a stream), add a cursor
        if (text.length === 0) {
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            messageElement.appendChild(cursor);
        }
    }

    // Load the chat history when the chatbot is initialized
    loadHistory(); 
    // Show default suggestions on initial load if history is empty
    if (chatHistory.length <= 1) {
        showSuggestions(["What are his main skills?", "Tell me about a project.", "How do I contact him?"]);
    }
}



    
    