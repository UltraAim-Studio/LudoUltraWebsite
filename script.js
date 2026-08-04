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
// DETAIL CARD VIEW
// ============================================
const detailModal = document.getElementById('detailModal');
const detailMedia = document.getElementById('detailMedia');
const detailCategory = document.getElementById('detailCategory');
const detailTitle = document.getElementById('detailTitle');
const detailDescription = document.getElementById('detailDescription');

const detailDescriptions = {
    'Online Multiplayer': 'Jump into real-time Ludo matches with players around the world. Built for quick matchmaking, smooth turns, and that satisfying feeling of outplaying friends and rivals on a living 3D board.',
    'Play with Friends': 'Create friendly matches, invite your circle, and turn every roll into a shared moment. This mode focuses on easy joining, playful competition, and fast rematches.',
    'Play vs Computer': 'Practice whenever you want against AI opponents. It is ideal for learning routes, testing risky moves, and sharpening your strategy before entering online games.',
    'Pass & Play': 'A local party mode for family and friends on one device. Pass the device around, roll the dice, and keep the table-game feeling alive.',
    'Character Customization': 'Personalize your character with playful items, accessories, and style choices that make your board presence feel unique.',
    'Token Actions': 'Special actions add surprise and personality to each token move. Use them to create dramatic turns, funny moments, and match-changing plays.',
    'Leaderboard': 'Climb the ranks by winning matches and proving your consistency. Built for players who want bragging rights and long-term progression.',
    'Rewards & Quests': 'Complete goals, collect rewards, and keep every session feeling fresh with meaningful tasks beyond the main match.',
    'Quick Match': 'Start playing fast with minimal setup. Quick Match is designed for instant action when you want one more round right now.',
    'Private Room': 'Create a dedicated room with custom control over who joins. Perfect for friend groups, small tournaments, and planned game nights.',
    'Join Room': 'Enter a room code and jump directly into a friend-created match. Simple, fast, and made for sharing.',
    'Play with Computer': 'Train against computer-controlled players and experiment with safer or riskier strategies at your own pace.',
    'Forest Theme': 'A lush board presentation that gives matches a bright, adventurous personality with a nature-inspired mood.',
    'Sunny Beach': 'A sunny, vacation-style board atmosphere that keeps the game colorful, warm, and playful.',
    'Sky World': 'A dreamy board theme with a light, elevated feel for matches that should look magical and energetic.',
    'Future Tech': 'A futuristic board look for players who enjoy neon polish, clean shapes, and sci-fi energy.',
    'Wizard': 'A magical character style with a fantasy vibe, made for players who want their piece to feel mysterious and powerful.',
    'Hero': 'A bold character style for players who like confident, adventurous looks on the board.',
    'Vampire': 'A darker character personality with a stylish, supernatural edge.',
    'Jester': 'A playful character option for players who enjoy expressive and unpredictable board energy.',
    'Dragon': 'A legendary style that makes your presence on the board feel big and dramatic.',
    'Fairy': 'A graceful character style with a lighter, magical tone.',
    'Banana': 'A fun token action designed for silly moments and quick turnarounds during a match.',
    'Snowball': 'A cool action effect that gives moves an icy personality and adds visual variety to token play.',
    'Cake': 'A cheerful reward-style action that keeps matches playful and celebratory.',
    'Heart': 'A warm support-style action that adds charm and personality to your token moments.',
    'Fireball': 'A high-impact action with a dramatic look, perfect for big plays and bold turns.',
    'Rock': 'A heavy action effect that feels powerful, direct, and satisfying.',
    'Phone Screenshot 2': 'A phone-sized gameplay screenshot showing how Ludo Ultra 3D looks in a mobile-first view.',
    'Phone Screenshot 3': 'A close mobile preview of the game experience, shaped for vertical screens and app-store style presentation.',
    'Phone Screenshot 4': 'A gameplay screenshot focused on the colorful board and readable mobile layout.',
    'Phone Screenshot 5': 'A vertical showcase image for the game interface, characters, and board presentation.',
    'Phone Screenshot 6': 'A phone screenshot that highlights the polished mobile look and playful 3D styling.',
    'Phone Screenshot 7': 'A final mobile showcase frame for gallery browsing and promotional preview.'
};

function getCardCategory(card) {
    if (card.classList.contains('feature-card')) return 'Feature';
    if (card.classList.contains('mode-card')) return 'Game Mode';
    if (card.classList.contains('board-card')) return 'Board Theme';
    if (card.classList.contains('character-card')) return 'Character';
    if (card.classList.contains('token-item')) return 'Token Action';
    if (card.classList.contains('gallery-item')) return 'Gallery';
    return 'Showcase';
}

function getCardMedia(card) {
    const mediaNode = card.querySelector('.feature-icon, .mode-icon, .board-image, .character-image, .token-icon, .gallery-image');
    if (!mediaNode) return '';

    const image = getComputedStyle(mediaNode).backgroundImage;
    return image && image !== 'none' ? image : '';
}

function openDetailCard(card) {
    const titleNode = card.querySelector('h3, h4, p');
    const textNode = card.querySelector('p');
    const title = titleNode?.textContent.trim() || 'Ludo Ultra 3D';
    const fallbackText = textNode && textNode !== titleNode ? textNode.textContent.trim() : '';

    detailCategory.textContent = getCardCategory(card);
    detailTitle.textContent = title;
    detailDescription.textContent = detailDescriptions[title] || fallbackText || 'Explore this Ludo Ultra 3D showcase item with a closer look at its game-ready style and personality.';

    const media = getCardMedia(card);
    detailMedia.style.backgroundImage = media || 'url("assets/images/Ludo%20Icon%20v1.png")';

    detailModal.classList.toggle('gallery-detail', card.classList.contains('gallery-item'));
    detailModal.classList.add('active');
    detailModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeDetailCard() {
    detailModal.classList.remove('active');
    detailModal.classList.remove('gallery-detail');
    detailModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

document.querySelectorAll('.feature-card, .mode-card, .board-card, .character-card, .token-item, .gallery-item').forEach(card => {
    card.setAttribute('tabindex', '0');
    if (!card.getAttribute('role')) {
        card.setAttribute('role', 'button');
    }
    card.addEventListener('click', () => openDetailCard(card));
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openDetailCard(card);
        }
    });
});

document.querySelectorAll('[data-detail-close]').forEach(control => {
    control.addEventListener('click', closeDetailCard);
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
    console.log('Ludo Ultra 3D Website Loaded Successfully');
    
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
        if (detailModal.classList.contains('active')) {
            closeDetailCard();
        }
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
