/* ========================================
   BOLT HACK - VANILLA JAVASCRIPT
   ========================================
   Handles all interactive elements and animations
*/

// ========================================
// CONFIGURATION
// ========================================

const config = {
    observerOptions: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    },
    animationDuration: 600,
    carouselDelay: 20000
};

// ========================================
// INTERSECTION OBSERVER - FADE UP ANIMATIONS
// ========================================

class FadeUpAnimator {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            config.observerOptions
        );
    }

    init() {
        const elements = document.querySelectorAll('.fade-up');
        elements.forEach(element => {
            this.observer.observe(element);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve to prevent animation from happening again
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ========================================
// ANIMATED COUNTER
// ========================================

class CounterAnimator {
    constructor() {
        this.counters = document.querySelectorAll('[data-target]');
        this.isAnimating = false;
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            config.observerOptions
        );
    }

    init() {
        this.counters.forEach(counter => {
            this.observer.observe(counter);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !this.isAnimating) {
                this.animateCounter(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = config.animationDuration;
        const start = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (target - start) * progress);

            element.textContent = this.formatNumber(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = this.formatNumber(target) + '+';
            }
        };

        requestAnimationFrame(animate);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(0) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    }
}

// ========================================
// INFINITE CAROUSEL
// ========================================

class CarouselAnimator {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        this.carousel = document.querySelector('.reviews-carousel');
        this.isHovering = false;
    }

    init() {
        if (!this.track) return;

        // Clone all items for infinite scroll
        this.cloneItems();
        
        // Add hover pause functionality
        this.carousel.addEventListener('mouseenter', () => {
            this.track.style.animationPlayState = 'paused';
        });

        this.carousel.addEventListener('mouseleave', () => {
            this.track.style.animationPlayState = 'running';
        });

        // Handle touch for mobile
        this.carousel.addEventListener('touchstart', () => {
            this.track.style.animationPlayState = 'paused';
        });

        this.carousel.addEventListener('touchend', () => {
            this.track.style.animationPlayState = 'running';
        });
    }

    cloneItems() {
        const items = this.track.querySelectorAll('.review-item');
        items.forEach(item => {
            const clone = item.cloneNode(true);
            this.track.appendChild(clone);
        });
    }
}

// ========================================
// SMOOTH SCROLL BEHAVIOR
// ========================================

class SmoothScroller {
    init() {
        // Add smooth scroll on all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ========================================
// NAVBAR EFFECTS
// ========================================

class NavbarEffects {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScrollY = 0;
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            this.navbar.style.background = 'rgba(10, 14, 39, 0.9)';
            this.navbar.style.borderBottom = '1px solid rgba(168, 85, 247, 0.3)';
        } else {
            this.navbar.style.background = 'rgba(10, 14, 39, 0.7)';
            this.navbar.style.borderBottom = '1px solid rgba(168, 85, 247, 0.2)';
        }

        this.lastScrollY = currentScrollY;
    }
}

// ========================================
// BUTTON EFFECTS
// ========================================

class ButtonEffects {
    init() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                this.createRipple(e, button);
            });
        });
    }

    createRipple(e, button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update CSS variables for glow position (optional enhancement)
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
    }
}

// ========================================
// SCROLL TO REVIEWS FUNCTION
// ========================================

function scrollToReviews() {
    const reviewsSection = document.getElementById('reviews');
    if (reviewsSection) {
        reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ========================================
// PARALLAX EFFECT FOR HERO IMAGE
// ========================================

class ParallaxEffect {
    constructor() {
        this.heroImage = document.querySelector('.hero-image');
    }

    init() {
        if (!this.heroImage) return;

        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const heroSection = document.querySelector('.hero');
        
        if (heroSection && scrollY < window.innerHeight) {
            const parallax = scrollY * 0.5;
            this.heroImage.style.transform = `translateY(${parallax}px)`;
        }
    }

    handleMouseMove(e) {
        if (window.scrollY > window.innerHeight) return;

        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        this.heroImage.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
    }
}

// ========================================
// PERFORMANCE OPTIMIZATION - DEBOUNCE
// ========================================

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

// ========================================
// ACTIVE NAV LINK TRACKING
// ========================================

class ActiveNavTracker {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link:not(.cta-nav)');
        this.sections = document.querySelectorAll('section[id]');
    }

    init() {
        window.addEventListener('scroll', debounce(() => this.updateActiveLink(), 100));
    }

    updateActiveLink() {
        let current = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// ========================================
// LOADING STATE & ANIMATIONS
// ========================================

class PageLoader {
    init() {
        // Ensure body is visible and animations are ready
        document.body.style.opacity = '1';
        
        // Trigger initial fade-up animations for hero section
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero .fade-up');
            heroElements.forEach(element => {
                element.classList.add('visible');
            });
        }, 100);
    }
}

// ========================================
// MAIN INITIALIZATION
// ========================================

function initializeApp() {
    // Check if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            runInitialization();
        });
    } else {
        runInitialization();
    }
}

function runInitialization() {
    try {
        // Initialize page loader
        const pageLoader = new PageLoader();
        pageLoader.init();

        // Initialize fade-up animations
        const fadeUpAnimator = new FadeUpAnimator();
        fadeUpAnimator.init();

        // Initialize counters
        const counterAnimator = new CounterAnimator();
        counterAnimator.init();

        // Initialize carousel
        const carouselAnimator = new CarouselAnimator();
        carouselAnimator.init();

        // Initialize smooth scrolling
        const smoothScroller = new SmoothScroller();
        smoothScroller.init();

        // Initialize navbar effects
        const navbarEffects = new NavbarEffects();
        navbarEffects.init();

        // Initialize button effects
        const buttonEffects = new ButtonEffects();
        buttonEffects.init();

        // Initialize parallax effect
        const parallaxEffect = new ParallaxEffect();
        parallaxEffect.init();

        // Initialize active nav tracking
        const activeNavTracker = new ActiveNavTracker();
        activeNavTracker.init();

        // Log initialization complete
        console.log('🔥 Bolt Hack Landing Page Initialized Successfully!');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// ========================================
// PERFORMANCE MONITORING
// ========================================

function logPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;

        console.log(`⚡ Page Load Time: ${loadTime}ms`);
        console.log(`⚡ DOM Ready Time: ${domReadyTime}ms`);
    }
}

// ========================================
// START APP
// ========================================

initializeApp();

// Log performance metrics after page load
window.addEventListener('load', () => {
    setTimeout(logPerformanceMetrics, 1000);
});

// ========================================
// GLOBAL FUNCTIONS
// ========================================

// Make scrollToReviews available globally
window.scrollToReviews = scrollToReviews;

// ========================================
// ANALYTICS & ERROR TRACKING (Optional)
// ========================================

// Catch and log any unhandled errors
window.addEventListener('error', (event) => {
    console.error('Global Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

// ========================================
// SERVICE WORKER (Optional - For PWA Support)
// ========================================

// Uncomment if you want to add PWA support
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('SW registration failed: ', err);
        });
    });
}
*/
