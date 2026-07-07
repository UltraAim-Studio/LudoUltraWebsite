// ============================================
// LUDO ULTRA 3D - INTERACTIVE FEATURES
// ============================================

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const heroVideo = document.getElementById('heroVideo');
const playTrailerBtn = document.getElementById('playTrailerBtn');
const mainTrailer = document.getElementById('mainTrailer');
const portraitTrailer = document.getElementById('portraitTrailer');
const thumbnails = document.querySelectorAll('.thumbnail');
const mainPlayer = document.querySelector('.main-player');

const videoBasePath = 'assets/videos/';
const landscapeTrailerSrc = `${videoBasePath}Ludo Ultra 3D Landscape Simple Trailer v3 - 720p.mp4`;
const landscapeFullTrailerSrc = `${videoBasePath}Ludo Ultra 3D Landscape Simple Trailer v3.mp4`;
const captureActionSrc = `${videoBasePath}Ludo Ultra Capture Action.mp4`;
const captureActionTwoSrc = `${videoBasePath}Ludo Ultra Capture Action 2.mp4`;
const characterCustomizationSrc = `${videoBasePath}Ludo Ultra Character Customization.mp4`;
const diceRollSrc = `${videoBasePath}Ludo Ultra Dice Role.mp4`;
const funActionSrc = `${videoBasePath}Ludo Ultra Fun Action.mp4`;
const getHomeSrc = `${videoBasePath}Ludo Ultra Get Home.mp4`;
const jumpActionSrc = `${videoBasePath}Ludo Ultra Jump Action.mp4`;
const overviewSrc = `${videoBasePath}Ludo Ultra Overview.mp4`;
const winnerSrc = `${videoBasePath}Ludo Ultra Winner.mp4`;
const portraitTrailerSrc = `${videoBasePath}LudoUltra Trailer - Background - 25 may_01.mp4`;

// ============================================
// MOBILE MENU TOGGLE
// ============================================
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ============================================
// HERO VIDEO CONTROLS
// ============================================
playTrailerBtn.addEventListener('click', () => {
    if (heroVideo.paused) {
        heroVideo.play();
        playTrailerBtn.textContent = '⏸ Pause Trailer';
    } else {
        heroVideo.pause();
        playTrailerBtn.textContent = '▶ Watch Trailer';
    }
});

// Update button text when video is playing
heroVideo.addEventListener('play', () => {
    playTrailerBtn.textContent = '⏸ Pause Trailer';
});

// Update button text when video is paused
heroVideo.addEventListener('pause', () => {
    playTrailerBtn.textContent = '▶ Watch Trailer';
});

// ============================================
// TRAILER SWITCHING
// ============================================
const trailerData = {
    main: {
        title: 'Main Trailer',
        description: 'Experience the full magic of Ludo Ultra 3D',
        src: landscapeTrailerSrc,
        orientation: 'landscape'
    },
    gameplay: {
        title: 'Capture Action',
        description: 'See capture moments and board action',
        src: captureActionSrc,
        orientation: 'portrait'
    },
    portrait: {
        title: 'Mobile Trailer',
        description: 'Portrait trailer for mobile-first gameplay previews',
        src: portraitTrailerSrc,
        orientation: 'portrait'
    },
    multiplayer: {
        title: 'Overview Trailer',
        description: 'A broad look at the full Ludo Ultra 3D experience',
        src: overviewSrc,
        orientation: 'portrait'
    },
    characters: {
        title: 'Character Customization',
        description: 'Preview character styling and customization',
        src: characterCustomizationSrc,
        orientation: 'portrait'
    },
    tokens: {
        title: 'Fun Action',
        description: 'See playful token actions in motion',
        src: funActionSrc,
        orientation: 'portrait'
    },
    boards: {
        title: 'Landscape Full Trailer',
        description: 'High quality landscape trailer version',
        src: landscapeFullTrailerSrc,
        orientation: 'landscape'
    },
    dice: {
        title: 'Dice Roll',
        description: 'Watch the dice roll action',
        src: diceRollSrc,
        orientation: 'portrait'
    },
    jump: {
        title: 'Jump Action',
        description: 'Token jump movement preview',
        src: jumpActionSrc,
        orientation: 'portrait'
    },
    capture2: {
        title: 'Capture Action 2',
        description: 'More capture action gameplay moments',
        src: captureActionTwoSrc,
        orientation: 'portrait'
    },
    home: {
        title: 'Get Home',
        description: 'Token home stretch and finish moments',
        src: getHomeSrc,
        orientation: 'portrait'
    },
    winner: {
        title: 'Winner',
        description: 'Victory and winning celebration preview',
        src: winnerSrc,
        orientation: 'portrait'
    }
};

function loadTrailer(video, src) {
    const currentSrc = decodeURI(video.currentSrc || video.querySelector('source')?.getAttribute('src') || '');
    if (currentSrc.endsWith(src)) {
        return;
    }

    video.pause();
    video.innerHTML = `<source src="${src}" type="video/mp4">`;
    video.load();
}

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        const trailerType = thumbnail.getAttribute('data-trailer');
        
        // Update active state
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
        
        // Update main player with the selected local trailer file
        const trailerInfo = trailerData[trailerType];
        mainTrailer.title = trailerInfo.title;
        mainPlayer.classList.toggle('portrait-mode', trailerInfo.orientation === 'portrait');
        loadTrailer(mainTrailer, trailerInfo.src);
        
        // Visual feedback
        mainTrailer.play().catch(err => {
            console.log('Video playback not available:', err);
        });
    });
});

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe cards and sections
document.querySelectorAll('.feature-card, .mode-card, .board-card, .character-card, .token-item, .gallery-item, .social-card, .faq-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ============================================
// SMOOTH PAGE SCROLL TO TOP
// ============================================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(13, 27, 58, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(255, 0, 110, 0.1)';
    } else {
        navbar.style.background = 'rgba(13, 27, 58, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// ============================================
// LAZY LOADING FOR IMAGES
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// SMOOTH SCROLL BEHAVIOR FOR INTERNAL LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// PERFORMANCE: REQUEST ANIMATION FRAME
// ============================================
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = requestAnimationFrame(() => {
            // Perform scroll-dependent operations here
            updateNavbarStyle();
            scrollTimeout = null;
        });
    }
});

function updateNavbarStyle() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(13, 27, 58, 0.98)';
    }
}

// ============================================
// TOUCH-FRIENDLY VIDEO CONTROLS FOR MOBILE
// ============================================
if ('ontouchstart' in window) {
    const videoContainers = document.querySelectorAll('.video-wrapper');
    videoContainers.forEach(container => {
        container.addEventListener('touchend', (e) => {
            const video = container.querySelector('video');
            if (video) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });
    });
}

// ============================================
// DYNAMIC CONTENT LOADING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Ludo Ultra 3D Website Loaded Successfully');
    
    // Initialize components
    initializeGameModes();
    initializeFeatures();
    addAriaLabels();
});

function initializeGameModes() {
    const modes = document.querySelectorAll('.mode-card');
    modes.forEach((mode, index) => {
        mode.style.animationDelay = `${index * 0.1}s`;
    });
}

function initializeFeatures() {
    const features = document.querySelectorAll('.feature-card');
    features.forEach((feature, index) => {
        feature.style.animationDelay = `${index * 0.1}s`;
    });
}

// ============================================
// ACCESSIBILITY IMPROVEMENTS
// ============================================
function addAriaLabels() {
    // Add aria-labels to interactive elements
    document.querySelectorAll('.cta-primary, .cta-secondary').forEach(btn => {
        if (!btn.getAttribute('aria-label')) {
            btn.setAttribute('aria-label', btn.textContent.trim());
        }
    });

    // Add role attributes where needed
    document.querySelectorAll('.feature-card, .mode-card').forEach(card => {
        if (!card.getAttribute('role')) {
            card.setAttribute('role', 'article');
        }
    });
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        navLinks.classList.remove('active');
    }

    // Play/pause trailer on Space when focused
    if (e.key === ' ' && (e.target === heroVideo || e.target === mainTrailer)) {
        e.preventDefault();
        if (e.target.paused) {
            e.target.play();
        } else {
            e.target.pause();
        }
    }
});

// ============================================
// PERFORMANCE MONITORING
// ============================================
if ('PerformanceObserver' in window) {
    try {
        const perfObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (entry.duration > 100) {
                    console.warn('⚠️ Slow operation detected:', entry.name, entry.duration + 'ms');
                }
            });
        });
        perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (e) {
        // PerformanceObserver not fully supported
    }
}

// ============================================
// NETWORK STATUS INDICATOR
// ============================================
window.addEventListener('online', () => {
    console.log('📡 Back online');
});

window.addEventListener('offline', () => {
    console.log('📡 You are offline');
    // Could add a visual indicator or disable online features
});

// ============================================
// VIDEO FALLBACK HANDLING
// ============================================
function handleVideoLoadError(video) {
    video.addEventListener('error', function() {
        console.warn('Video failed to load:', video.src);
        const fallback = video.parentElement;
        if (fallback && fallback.classList.contains('video-wrapper')) {
            const placeholder = document.createElement('div');
            placeholder.textContent = '📹 Video content coming soon';
            placeholder.style.width = '100%';
            placeholder.style.height = '100%';
            placeholder.style.display = 'flex';
            placeholder.style.alignItems = 'center';
            placeholder.style.justifyContent = 'center';
            placeholder.style.fontSize = '1.5rem';
            placeholder.style.color = '#a0a0a0';
            fallback.replaceChild(placeholder, video);
        }
    });
}

// Apply video error handling
handleVideoLoadError(heroVideo);
handleVideoLoadError(mainTrailer);
if (portraitTrailer) {
    handleVideoLoadError(portraitTrailer);
}

// ============================================
// PAGE VISIBILITY API - PAUSE VIDEO WHEN TAB NOT ACTIVE
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (heroVideo && !heroVideo.paused) {
            heroVideo.pause();
        }
        if (mainTrailer && !mainTrailer.paused) {
            mainTrailer.pause();
        }
        if (portraitTrailer && !portraitTrailer.paused) {
            portraitTrailer.pause();
        }
    }
});

// ============================================
// ANALYTICS TRACKING
// ============================================
function trackEvent(eventName, eventData = {}) {
    // Log events for analytics (can be connected to actual analytics service)
    console.log(`📊 Event: ${eventName}`, eventData);
    
    // Example: Send to analytics service
    // fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ event: eventName, data: eventData }) });
}

// Track button clicks
document.querySelectorAll('.cta-primary, .cta-secondary, .download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('CTA_Click', { text: btn.textContent.trim() });
    });
});

// Track trailer plays
playTrailerBtn.addEventListener('click', () => {
    trackEvent('Trailer_Play');
});

// Track social links
document.querySelectorAll('.social-card').forEach(card => {
    card.addEventListener('click', () => {
        trackEvent('Social_Click', { platform: card.textContent.trim() });
    });
});

// ============================================
// LOCAL STORAGE - REMEMBER USER PREFERENCES
// ============================================
function saveUserPreferences() {
    const preferences = {
        lastTrailerWatched: document.querySelector('.thumbnail.active')?.getAttribute('data-trailer') || 'main',
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('ludoPreferences', JSON.stringify(preferences));
}

function loadUserPreferences() {
    const saved = localStorage.getItem('ludoPreferences');
    if (saved) {
        const preferences = JSON.parse(saved);
        console.log('Loaded preferences:', preferences);
    }
}

// Save preferences every 30 seconds
setInterval(saveUserPreferences, 30000);
loadUserPreferences();

// ============================================
// DYNAMIC CONTENT MODULES
// ============================================

// Module: Feature Cards Enhancement
const featureCards = {
    init: function() {
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.zIndex = '10';
            });
            card.addEventListener('mouseleave', () => {
                card.style.zIndex = '1';
            });
        });
    }
};

// Module: Social Media Links
const socialMedia = {
    links: {
        youtube: 'https://youtube.com',
        instagram: 'https://instagram.com',
        discord: 'https://discord.gg',
        twitter: 'https://twitter.com'
    },
    
    init: function() {
        document.querySelectorAll('.social-card').forEach(card => {
            const platform = card.textContent.toLowerCase();
            const link = Object.entries(this.links).find(([key]) => 
                platform.includes(key)
            );
            if (link) {
                card.href = link[1];
            }
        });
    }
};

// Initialize modules
featureCards.init();
socialMedia.init();

// ============================================
// SYSTEM INITIALIZATION
// ============================================
console.log('%c🎲 Ludo Ultra 3D Website', 'font-size: 20px; font-weight: bold; color: #ff006e;');
console.log('%cPowered by Premium Gaming Excellence', 'font-size: 12px; color: #00d4ff;');
console.log('Version: 1.0.0 | All systems operational ✅');
