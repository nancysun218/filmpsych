
// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Scroll Animation Observer
    const scrollElements = document.querySelectorAll('.section-header, .five-col-card, .program-card, .impact-stat-card, .sneakpeaks-collage, .chapter-content, .internship-photos-row, .about-intro, .impact-stat, .blog-card, .team-member, .submit-box, .requirement-card, .faq-item');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    scrollElements.forEach(el => {
        el.classList.add('scroll-animate');
        scrollObserver.observe(el);
    });
    
    // Ripple effect for buttons
    document.querySelectorAll('.ripple-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 500);
        });
    });
    
    // Dropdowns now work on hover via CSS - no click toggle needed
    // Close all dropdowns when any link inside is clicked
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all dropdowns to ensure they close
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        });
    });

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Skip navigation for dropdown toggles - they only show the dropdown
            if (this.classList.contains('dropdown-toggle')) {
                return;
            }
            
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Handle dropdown navigation clicks
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Update corresponding nav link - for dropdown items, activate the parent nav link
                const parentNavLink = this.closest('.dropdown').querySelector('.nav-link');
                if (parentNavLink) {
                    parentNavLink.classList.add('active');
                }
            }
        });
    });

    // Handle hero button clicks and nav-trigger buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn, .nav-trigger');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Get target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Update corresponding nav link
                const targetNavLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
                if (targetNavLink) {
                    targetNavLink.classList.add('active');
                }
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // Handle footer navigation for blog pages
    const footerLinks = document.querySelectorAll('.footer-section a[href^="index.html#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.includes('#')) {
                // If we're on a blog page, navigate to the main page with the section
                window.location.href = href;
            }
        });
    });

    // Handle form submissions
    const joinForm = document.querySelector('.join-form');
    if (joinForm) {
        joinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your interest in joining FilmPsych! We will review your application and get back to you soon.');
            this.reset();
        });
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const formData = new FormData(this);
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Submit form using fetch
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    alert('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.');
                    this.reset();
                } else {
                    response.json().then(data => {
                        if (data.errors) {
                            alert('Oops! There was a problem: ' + data.errors.map(error => error.message).join(', '));
                        } else {
                            alert('Oops! There was a problem sending your message. Please try again.');
                        }
                    });
                }
            }).catch(error => {
                alert('Oops! There was a problem sending your message. Please try again.');
            }).finally(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && !href.startsWith('#home') && !href.startsWith('#about') && 
                !href.startsWith('#blogs') && !href.startsWith('#animations') && 
                !href.startsWith('#partnerships') && !href.startsWith('#join') && 
                !href.startsWith('#contact') && !href.startsWith('#writers')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

});

// Function to open video links
function openVideo(url) {
    window.open(url, '_blank');
}

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    const toggleIcon = navToggle.querySelector('i');
    
    navMenu.classList.toggle('active');
    
    // Change hamburger to X when open
    if (navMenu.classList.contains('active')) {
        toggleIcon.classList.remove('fa-bars');
        toggleIcon.classList.add('fa-times');
    } else {
        toggleIcon.classList.remove('fa-times');
        toggleIcon.classList.add('fa-bars');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    const navContainer = document.querySelector('.nav-container');
    
    if (!navContainer.contains(event.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const toggleIcon = navToggle.querySelector('i');
        toggleIcon.classList.remove('fa-times');
        toggleIcon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking on a nav link
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                const toggleIcon = navToggle.querySelector('i');
                toggleIcon.classList.remove('fa-times');
                toggleIcon.classList.add('fa-bars');
            }
        });
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Blog filtering functionality
function initializeBlogFiltering() {
    const blogFilter = document.getElementById('blog-filter');
    const blogsContainer = document.getElementById('blogs-container');
    
    if (!blogFilter || !blogsContainer) return;
    
    // Store original blog cards
    const originalBlogCards = Array.from(blogsContainer.querySelectorAll('.blog-card'));
    
    function sortBlogs(sortType) {
        let sortedCards = [...originalBlogCards];
        
        switch(sortType) {
            case 'latest':
                sortedCards.sort((a, b) => {
                    const dateA = new Date(a.dataset.date);
                    const dateB = new Date(b.dataset.date);
                    return dateB - dateA;
                });
                break;
                
            case 'oldest':
                sortedCards.sort((a, b) => {
                    const dateA = new Date(a.dataset.date);
                    const dateB = new Date(b.dataset.date);
                    return dateA - dateB;
                });
                break;
        }
        
        // Clear container and add sorted cards with animation
        blogsContainer.innerHTML = '';
        
        sortedCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            blogsContainer.appendChild(card);
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Handle filter change
    blogFilter.addEventListener('change', function() {
        sortBlogs(this.value);
    });
    
    // Initialize with latest posts first
    sortBlogs('latest');
}

// Blog Carousel Functionality
let currentSlideIndex = 0;
const totalSlides = 5;
let autoSlideInterval;

function showSlide(index) {
    const carousel = document.getElementById('homepage-blog-carousel');
    const dots = document.querySelectorAll('.dot');
    
    if (!carousel) return;
    
    // Ensure index is within bounds
    if (index >= totalSlides) currentSlideIndex = 0;
    else if (index < 0) currentSlideIndex = totalSlides - 1;
    else currentSlideIndex = index;
    
    // Calculate transform
    const slideWidth = 320; // 300px + 20px gap
    const offset = currentSlideIndex * slideWidth;
    carousel.style.transform = `translateX(-${offset}px)`;
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlideIndex);
    });
}

function nextSlide() {
    showSlide(currentSlideIndex + 1);
}

function previousSlide() {
    showSlide(currentSlideIndex - 1);
}

function currentSlide(index) {
    showSlide(index - 1);
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 4000); // Change slide every 4 seconds
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}

// Initialize carousel when page loads
function initializeCarousel() {
    const carouselContainer = document.querySelector('.blog-carousel-container');
    if (carouselContainer) {
        // Start auto-sliding
        startAutoSlide();
        
        // Pause auto-slide on hover
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
        
        // Initialize first slide
        showSlide(0);
    }
}

// Add hover effects for better interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog filtering
    initializeBlogFiltering();
    
    // Initialize homepage carousel
    initializeCarousel();
    
    // Add hover effect to navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

});
