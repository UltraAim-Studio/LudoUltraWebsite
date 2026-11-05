// ============================================================
// LUDO ULTRA 3D — INTERACTIONS
// Menu · hero video · trailer switcher · board token · reveals
// ============================================================

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navbar = document.querySelector('.navbar');
const heroVideo = document.getElementById('heroVideo');
const playTrailerBtn = document.getElementById('playTrailerBtn');

// ---------- Mobile menu ----------
menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
navLinks.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => navLinks.classList.remove('active'))
);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') navLinks.classList.remove('active');
});

// ---------- Navbar & watermark scroll state ----------
const iconWatermark = document.querySelector('.icon-watermark');
let ticking = false;
window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        // Watermark moves to bottom-right after scrolling significantly past the board section start
        const boardSection = document.getElementById('board');
        const boardTop = boardSection.offsetTop;
        if (window.scrollY > boardTop + 400) {
            iconWatermark.classList.add('scrolled');
        } else {
            iconWatermark.classList.remove('scrolled');
        }
        ticking = false;
    });
}, { passive: true });

// ---------- Hero video play/pause ----------
playTrailerBtn.addEventListener('click', () => {
    if (heroVideo.paused) {
        heroVideo.play().catch(() => {});
        playTrailerBtn.textContent = '⏸ Pause trailer';
    } else {
        heroVideo.pause();
        playTrailerBtn.textContent = '▶ Watch trailer';
    }
});
heroVideo.addEventListener('play', () => (playTrailerBtn.textContent = '⏸ Pause trailer'));
heroVideo.addEventListener('pause', () => (playTrailerBtn.textContent = '▶ Watch trailer'));

// Pause all video when the tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) [heroVideo, mainTrailer].forEach((v) => v && !v.paused && v.pause());
});

// ---------- Trailer switcher ----------
// Only trailers that actually exist in assets/videos/ are listed.
const trailerData = [
    { key: 'main', label: 'Main Trailer', desc: 'The full experience, in one take.', src: 'Ludo Ultra 3D Landscape Simple Trailer v3 - 720p.mp4' },
    { key: 'landscape', label: 'Landscape 4K', desc: 'High-quality landscape version.', src: 'Ludo Ultra 3D Landscape Simple Trailer v3.mp4' },
    { key: 'portrait', label: 'Mobile Trailer', desc: 'Portrait cut for reels and shorts.', src: 'LudoUltra Trailer - Background - 25 may_01.mp4' },
    { key: 'capture', label: 'Capture Action', desc: 'Jumps and captures in the heat of the game.', src: 'Ludo Ultra Capture Action.mp4' },
    { key: 'capture2', label: 'Capture 2', desc: 'More capture moments.', src: 'Ludo Ultra Capture Action 2.mp4' },
    { key: 'dice', label: 'Dice Roll', desc: 'The dice, rolling.', src: 'Ludo Ultra Dice Role.mp4' },
    { key: 'fun', label: 'Fun Actions', desc: 'Playful token actions in motion.', src: 'Ludo Ultra Fun Action.mp4' },
    { key: 'jump', label: 'Jump Action', desc: 'Token jump movement preview.', src: 'Ludo Ultra Jump Action.mp4' },
    { key: 'home', label: 'Get Home', desc: 'The home stretch and finish.', src: 'Ludo Ultra Get Home.mp4' },
    { key: 'winner', label: 'Winner', desc: 'Victory celebration.', src: 'Ludo Ultra Winner.mp4' },
];

const mainTrailer = document.getElementById('mainTrailer');
const mainSource = mainTrailer.querySelector('source');
const mainPlayer = document.getElementById('mainPlayer');
const trailerTitle = document.getElementById('trailerTitle');
const trailerDesc = document.getElementById('trailerDesc');
const trailerThumbs = document.getElementById('trailerThumbs');

trailerData.forEach((t, i) => {
    const btn = document.createElement('button');
    btn.className = 'trailer-thumb' + (i === 0 ? ' active' : '');
    btn.innerHTML = `<span class="dot"></span>${t.label}`;
    btn.addEventListener('click', () => {
        const currentSrc = mainSource.getAttribute('src');
        if (currentSrc && currentSrc.endsWith(t.src)) return;
        mainTrailer.pause();
        mainSource.src = `assets/videos/${t.src}`;
        mainTrailer.load();
        mainTrailer.play().catch(() => {});
        trailerTitle.textContent = t.label;
        trailerDesc.textContent = t.desc;
        trailerThumbs.querySelectorAll('.trailer-thumb').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
    });
    trailerThumbs.appendChild(btn);
});

// ---------- Ludo board: token travels with the rooms ----------
const ludoBoard = document.getElementById('ludoBoard');
const boardHint = document.getElementById('boardHint');
const rooms = [...document.querySelectorAll('.room[data-room-index]')];

const roomPositions = { 0: 'tl', 1: 'tr', 2: 'bl', 3: 'br', 4: 'c' };
const roomHints = {
    0: 'Board themes — green corner',
    1: 'Game modes — red corner',
    2: 'Token actions — blue corner',
    3: 'Characters — yellow corner',
    4: 'Made it home — roll again!',
};

const roomObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const index = Number(entry.target.dataset.roomIndex);
                ludoBoard.dataset.pos = roomPositions[index] || 'c';
                boardHint.textContent = roomHints[index] || '';
            }
        });
    },
    { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
);
rooms.forEach((room) => roomObserver.observe(room));

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);
document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

// ---------- Touch: tap video to play/pause (mobile) ----------
if ('ontouchstart' in window) {
    mainPlayer.addEventListener('touchend', (e) => {
        e.preventDefault();
        mainTrailer.paused ? mainTrailer.play().catch(() => {}) : mainTrailer.pause();
    });
}

// ---------- Feedback form ----------
const feedbackForm = document.getElementById('feedbackForm');
const feedbackStatus = document.getElementById('feedbackStatus');

feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(feedbackForm);
    const data = Object.fromEntries(formData.entries());

    const subject = encodeURIComponent(`Ludo Ultra 3D Feedback: ${data.subject}`);
    const body = encodeURIComponent(
        `From: ${data.name} <${data.email}>\n\n${data.message}`
    );

    feedbackStatus.textContent = 'Opening your mail app...';
    feedbackStatus.className = 'ok';

    window.location.href = `mailto:contact@ultraaim.in?subject=${subject}&body=${body}`;
});
