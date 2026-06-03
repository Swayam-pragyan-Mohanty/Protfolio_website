/**
 * Swayam Pragyan Mohanty - Portfolio Script System
 * High-performance UI interactions & Neural Canvas Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Mobile Menu Navigation
    // -------------------------------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('open');
            });
        });
    }

    // Sticky Header Scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // -------------------------------------------------------------------------
    // 2. Active Link Highlighting with IntersectionObserver
    // -------------------------------------------------------------------------
    const sections = document.querySelectorAll('section, footer');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger active highlight when section occupies middle/top viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // -------------------------------------------------------------------------
    // 3. Dynamic Typing subtitle effect
    // -------------------------------------------------------------------------
    const typedTextSpan = document.getElementById('typed-text');
    const textArray = [
        "AI/ML Developer",
        "Full-Stack Enthusiast",
        "RAG Chatbot Builder",
        "SIH 2025 National Winner"
    ];
    const typingSpeed = 100;
    const erasingSpeed = 60;
    const newTextDelay = 2000; // Delay between titles
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingSpeed + 500);
        }
    }

    if (typedTextSpan) {
        setTimeout(type, newTextDelay - 1000);
    }

    // -------------------------------------------------------------------------
    // 4. Interactive Neural Node Canvas Background
    // -------------------------------------------------------------------------
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        // Adjust Canvas Size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        // Particle Class
        class Particle {
            constructor(x, y, dx, dy, size, color) {
                this.x = x;
                this.y = y;
                this.dx = dx;
                this.dy = dy;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                // Bounce on boundaries
                if (this.x > canvas.width || this.x < 0) {
                    this.dx = -this.dx;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.dy = -this.dy;
                }

                // Mouse interaction
                let mouseDistance = Math.hypot(this.x - mouse.x, this.y - mouse.y);
                if (mouseDistance < mouse.radius && mouse.x !== null) {
                    // Push particles slightly away or attract
                    const angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
                    const force = (mouse.radius - mouseDistance) / mouse.radius;
                    
                    // Subtle hover push
                    this.x += Math.cos(angle) * force * 1.5;
                    this.y += Math.sin(angle) * force * 1.5;
                }

                // Move particle
                this.x += this.dx;
                this.y += this.dy;

                this.draw();
            }
        }

        // Initialize Particle System
        function initParticles() {
            particles = [];
            // Scale number of particles based on screen width
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 16000), 85);
            
            // Neon teal & electric violet theme colors
            const colors = [
                'rgba(20, 184, 166, 0.45)', // Teal
                'rgba(168, 85, 247, 0.45)', // Violet
                'rgba(255, 255, 255, 0.15)'  // White glow
            ];

            for (let i = 0; i < count; i++) {
                const size = Math.random() * 2 + 1.2;
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const dx = (Math.random() - 0.5) * 0.4; // Low speed for smooth ambiance
                const dy = (Math.random() - 0.5) * 0.4;
                const color = colors[Math.floor(Math.random() * colors.length)];

                particles.push(new Particle(x, y, dx, dy, size, color));
            }
        }

        // Connect particles with neural links
        function connectParticles() {
            const linkDistance = 115;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dist = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);
                    if (dist < linkDistance) {
                        // Transparency depends on distance
                        const opacity = (1 - (dist / linkDistance)) * 0.13;
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation Loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => p.update());
            connectParticles();

            requestAnimationFrame(animate);
        }

        // Mouse listeners
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', resizeCanvas);

        // Run
        resizeCanvas();
        animate();
    }

    // -------------------------------------------------------------------------
    // 5. Contact Form Validation & Interactions
    // -------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const submitBtn = document.getElementById('submit-btn');
        const successBox = document.getElementById('success-box');

        // Simple validation checks
        function validateEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        function toggleInputError(inputElement, errorElement, isValid) {
            if (isValid) {
                inputElement.classList.remove('invalid');
                errorElement.style.display = 'none';
            } else {
                inputElement.classList.add('invalid');
                errorElement.style.display = 'block';
            }
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = nameInput.value.trim() !== '';
            const isEmailValid = validateEmail(emailInput.value.trim());
            const isMessageValid = messageInput.value.trim() !== '';

            toggleInputError(nameInput, document.getElementById('name-error'), isNameValid);
            toggleInputError(emailInput, document.getElementById('email-error'), isEmailValid);
            toggleInputError(messageInput, document.getElementById('message-error'), isMessageValid);

            if (isNameValid && isEmailValid && isMessageValid) {
                // Submit Form Mocking
                submitBtn.disabled = true;
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Sending...';

                setTimeout(() => {
                    successBox.style.display = 'flex';
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;

                    // Automatically fade out success message
                    setTimeout(() => {
                        successBox.style.opacity = '0';
                        setTimeout(() => {
                            successBox.style.display = 'none';
                            successBox.style.opacity = '1';
                        }, 500);
                    }, 4000);
                }, 1200);
            }
        });

        // Real-time error removal on input
        nameInput.addEventListener('input', () => {
            if (nameInput.value.trim() !== '') {
                toggleInputError(nameInput, document.getElementById('name-error'), true);
            }
        });

        emailInput.addEventListener('input', () => {
            if (validateEmail(emailInput.value.trim())) {
                toggleInputError(emailInput, document.getElementById('email-error'), true);
            }
        });

        messageInput.addEventListener('input', () => {
            if (messageInput.value.trim() !== '') {
                toggleInputError(messageInput, document.getElementById('message-error'), true);
            }
        });
    }

    // -------------------------------------------------------------------------
    // 6. Interactive Milestones Slideshow System (Multi-Slideshow Engine)
    // -------------------------------------------------------------------------
    const slideshows = document.querySelectorAll('.slideshow-wrapper');
    slideshows.forEach(slideshow => {
        const slides = slideshow.querySelectorAll('.slide');
        const dots = slideshow.querySelectorAll('.slide-dot');
        const prevArrow = slideshow.querySelector('.prev-arrow');
        const nextArrow = slideshow.querySelector('.next-arrow');
        
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        let slideInterval;
        
        function showSlide(index) {
            // Remove active classes
            slides[currentSlide].classList.remove('active');
            if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
            
            // Set new current index
            currentSlide = (index + slides.length) % slides.length;
            
            // Add active classes
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        }
        
        function nextSlide() {
            showSlide(currentSlide + 1);
        }
        
        function prevSlide() {
            showSlide(currentSlide - 1);
        }
        
        // Navigation clicks
        if (prevArrow) {
            prevArrow.addEventListener('click', (e) => {
                e.stopPropagation(); // Avoid triggering parent card clicks
                prevSlide();
                resetInterval();
            });
        }
        
        if (nextArrow) {
            nextArrow.addEventListener('click', (e) => {
                e.stopPropagation();
                nextSlide();
                resetInterval();
            });
        }
        
        // Dot clicks
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(idx);
                resetInterval();
            });
        });
        
        // Auto-play swap every 5 seconds
        function startInterval() {
            slideInterval = setInterval(nextSlide, 5000);
        }
        
        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }
        
        // Start auto slide
        startInterval();
        
        // Pause auto-play when hovering over slideshow area
        slideshow.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slideshow.addEventListener('mouseleave', startInterval);
    });
});
