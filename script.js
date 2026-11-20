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

const roomPositions = { 0: 'tl', 1: 'tr', 2: 'bl', 3: 'br', 4: 'tl', 5: 'tr', 6: 'c' };
const roomHints = {
    0: 'Dice collection — purple corner',
    1: 'Board themes — green corner',
    2: 'Game modes — red corner',
    3: 'Token actions — blue corner',
    4: 'Characters — yellow corner',
    5: 'Environments — orange corner',
    6: 'Made it home — roll again!',
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

// ---------- Item Detail Modal ----------
const ITEM_DATA = {
    dice: [
        { id: 'dice-classic', name: 'Classic', category: 'Dice', desc: 'Classic dice with a clean, balanced design for standard gameplay.', img: 'assets/images/Icon_Dice/Icon_Dice_1_Default.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_1_Default.png'], video: null },
        { id: 'dice-metal', name: 'Metal', category: 'Dice', desc: 'A sturdy dice with a sleek metallic finish.', img: 'assets/images/Icon_Dice/Icon_Dice_3_Metal.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_3_Metal.png'], video: null },
        { id: 'dice-marble', name: 'Marble', category: 'Dice', desc: 'A smooth dice with a polished marble finish.', img: 'assets/images/Icon_Dice/Icon_Dice_4_Marbel.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_4_Marbel.png'], video: null },
        { id: 'dice-color', name: 'Color', category: 'Dice', desc: 'A vibrant dice with a colorful, playful finish.', img: 'assets/images/Icon_Dice/Icon_Dice_5_Color.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_5_Color.png'], video: null },
        { id: 'dice-rainbow', name: 'Rainbow', category: 'Dice', desc: 'A item that designed for a smooth and enjoyable gameplay experience', img: 'assets/images/Icon_Dice/Icon_Dice_6_RainBow.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_6_RainBow.png'], video: null },
        { id: 'dice-heart', name: 'Heart', category: 'Dice', desc: 'A item that designed for a smooth and enjoyable gameplay experience', img: 'assets/images/Icon_Dice/Icon_Dice_7_Heart.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_7_Heart.png'], video: null },
        { id: 'dice-ice', name: 'Ice', category: 'Dice', desc: 'A item that designed for a smooth and enjoyable gameplay experience', img: 'assets/images/Icon_Dice/Icon_Dice_8_ice.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_8_ice.png'], video: null },
        { id: 'dice-dragon', name: 'Dragon', category: 'Dice', desc: 'A item that designed for a smooth and enjoyable gameplay experience', img: 'assets/images/Icon_Dice/Icon_Dice_13_dragon.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_13_dragon.png'], video: null },
        { id: 'dice-scifi', name: 'Sci-Fi', category: 'Dice', desc: 'A item that designed for a smooth and enjoyable gameplay experience', img: 'assets/images/Icon_Dice/Icon_Dice_17_Scifi.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_17_Scifi.png'], video: null },
    ],
    boards: [
        { id: 'board-classic', name: 'Classic', category: 'Board', desc: 'A timeless board for a familiar Ludo experience.', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%200%20Default.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%200%20Default.png'], video: null },
        { id: 'board-round', name: 'Round', category: 'Board', desc: 'A smooth and elegant board with a unique rounded design.', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%201%20Round.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%201%20Round.png'], video: null },
        { id: 'board-ice', name: 'Ice', category: 'Board', desc: 'A cool, icy board with a frosty and refreshing design.', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%202%20Ice.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%202%20Ice.png'], video: null },
        { id: 'board-wooden', name: 'Wooden', category: 'Board', desc: 'A classic board crafted with a warm wooden design.', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%203%20Wooden.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%203%20Wooden.png'], video: null },
        { id: 'board-metal', name: 'Metal', category: 'Board', desc: 'A item that designed for a smooth and enjoyable gameplay experience', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%204%20Metal.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%204%20Metal.png'], video: null },
        { id: 'board-rock', name: 'Rock', category: 'Board', desc: 'A item that designed for a smooth and enjoyable gameplay experience', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%205%20Rock.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%205%20Rock.png'], video: null },
        { id: 'board-scifi', name: 'Sci-Fi', category: 'Board', desc: 'A item that designed for a smooth and enjoyable gameplay experience', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%206%20Scifi.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%206%20Scifi.png'], video: null },
        { id: 'board-black', name: 'Black', category: 'Board', desc: 'A item that designed for a smooth and enjoyable gameplay experience', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%207%20Black.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%207%20Black.png'], video: null },
        { id: 'board-octagon', name: 'Octagon', category: 'Board', desc: 'A item that designed for a smooth and enjoyable gameplay experience', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%208%20Octagon.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%208%20Octagon.png'], video: null },
    ],
    funActions: [
        { id: 'fun-banana', name: 'Banana', category: 'Fun Action', desc: 'Chuck a banana at an opponent\'s token for a goofy, yellow gag hit.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Banana.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Banana.png'], video: null },
        { id: 'fun-snowball', name: 'Snowball', category: 'Fun Action', desc: 'Bonk an opponent\'s token with a snowball — fluffy hit, frosty chill.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Snowball.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Snowball.png'], video: null },
        { id: 'fun-heart', name: 'Heart', category: 'Fun Action', desc: 'Shower an opponent\'s token in hearts — sweet, sparkly, impossible to ignore.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Heart.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Heart.png'], video: null },
        { id: 'fun-paperplane', name: 'Paper Plane', category: 'Fun Action', desc: 'Glide a paper plane across the board right into an opponent\'s token.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_PaperPlane.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_PaperPlane.png'], video: null },
        { id: 'fun-rose', name: 'Rose', category: 'Fun Action', desc: 'Offer a rose to an opponent\'s token — smooth, classy and a little show-off.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Rose.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Rose.png'], video: null },
        { id: 'fun-loveyou', name: 'Love You', category: 'Fun Action', desc: 'Send a glowing "Love U" straight to an opponent\'s token.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_LoveYou.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_LoveYou.png'], video: null },
        { id: 'fun-waterballoon', name: 'Water Balloon', category: 'Fun Action', desc: 'Toss a water balloon at an opponent\'s token for a cheerful, splashy hit.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_WaterBalloon.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_WaterBalloon.png'], video: null },
        { id: 'fun-dance', name: 'Dance', category: 'Fun Action', desc: 'Break it down. All tokens in range join a conga line — move together next roll.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Dance.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Dance.png'], video: null },
        { id: 'fun-brokenheart', name: 'Broken Heart', category: 'Fun Action', desc: 'Throw a cracked heart at an opponent\'s token for maximum heartbreak drama.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_BrokenHeart.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_BrokenHeart.png'], video: null },
        { id: 'fun-cake', name: 'Cake', category: 'Fun Action', desc: 'Splat a cake onto an opponent\'s token — frosting first, zero mercy.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Cake.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Cake.png'], video: null },
        { id: 'fun-dice', name: 'Dice', category: 'Fun Action', desc: 'Roll a lucky dice straight at an opponent\'s token and shake up the board.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Dice.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Dice.png'], video: null },
        { id: 'fun-duck', name: 'Duck', category: 'Fun Action', desc: 'Toss a duck at an opponent\'s token — quack attack!', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Duck.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Duck.png'], video: null },
        { id: 'fun-egg', name: 'Egg', category: 'Fun Action', desc: 'Egg an opponent\'s token for a messy, splat-worthy hit.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Egg.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Egg.png'], video: null },
        { id: 'fun-hateyou', name: 'Hate You', category: 'Fun Action', desc: 'Flash a petty "Hate You" at an opponent\'s token and let them know how you feel.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_HateYou.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_HateYou.png'], video: null },
        { id: 'fun-missyou', name: 'Miss You', category: 'Fun Action', desc: 'Drift a "Miss You" note across the board to an opponent\'s token.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_MissYou.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_MissYou.png'], video: null },
        { id: 'fun-shoe', name: 'Shoe', category: 'Fun Action', desc: 'Gift an opponent\'s token a fresh pair of kicks to flex.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Shoe.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Shoe.png'], video: null },
        { id: 'fun-stone', name: 'Stone', category: 'Fun Action', desc: 'Pel an opponent\'s token with flying stones for a rugged, rocky hit.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Stone.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Stone.png'], video: null },
    ],
    captureActions: [
        { id: 'cap-fireball', name: 'Fire Ball', category: 'Capture Action', desc: 'Call down direct fire to capture an opponent. Watch it burn.', img: 'assets/images/TokenActions/Icon_TokenActions_Fire_Ball.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Fire_Ball.png'], video: null },
        { id: 'cap-rockthrow', name: 'Rock Throw', category: 'Capture Action', desc: 'Hurl searing stone magic to smash and capture an opponent\'s token.', img: 'assets/images/TokenActions/Icon_TokenActions_Rock_Throw.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Rock_Throw.png'], video: null },
        { id: 'cap-gunshoot', name: 'Gun Shoot', category: 'Capture Action', desc: 'Take aim and fire to pick off an opponent\'s token from a distance.', img: 'assets/images/TokenActions/Icon_TokenActions_Gun_Shoot.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Gun_Shoot.png'], video: null },
        { id: 'cap-sword', name: 'Sword', category: 'Capture Action', desc: 'Walk in and slash with a giant blade — capture a token in one mighty swing.', img: 'assets/images/TokenActions/Icon_TokenActions_Sword.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Sword.png'], video: null },
        { id: 'cap-watersplash', name: 'Water Splash', category: 'Capture Action', desc: 'Crash a wave of water magic over an opponent\'s token — splashed and captured.', img: 'assets/images/TokenActions/Icon_TokenActions_Water_Splash.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Water_Splash.png'], video: null },
        { id: 'cap-grenade', name: 'Grenade', category: 'Capture Action', desc: 'Stand tall, pull the pin and lob a grenade to blow a token off the board.', img: 'assets/images/TokenActions/Icon_TokenActions_Grenade.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Grenade.png'], video: null },
        { id: 'cap-kick', name: 'Kick', category: 'Capture Action', desc: 'Sprint in and deliver a flying kick that knocks an opponent\'s token out.', img: 'assets/images/TokenActions/Icon_TokenActions_Kick.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Kick.png'], video: null },
        { id: 'cap-laser', name: 'Laser Attack', category: 'Capture Action', desc: 'Capture a token with a searing dark laser. Fast, precise, ruthless.', img: 'assets/images/TokenActions/Icon_TokenActions_Laser_Attack.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Laser_Attack.png'], video: null },
        { id: 'cap-magicspike', name: 'Magic Spike', category: 'Capture Action', desc: 'Launch magic spikes from the ground to skewer and capture an opponent\'s token.', img: 'assets/images/TokenActions/Icon_TokenActions_Magic_Spike_Attack.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Magic_Spike_Attack.png'], video: null },
        { id: 'cap-meteor', name: 'Meteor', category: 'Capture Action', desc: 'Call a meteor from the skies to crush and capture an opponent\'s token.', img: 'assets/images/TokenActions/Icon_TokenActions_Meteor.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Meteor.png'], video: null },
        { id: 'cap-punch', name: 'Punch', category: 'Capture Action', desc: 'Close the gap and land a solid punch to capture an opponent\'s token.', img: 'assets/images/TokenActions/Icon_TokenActions_Punch.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Punch.png'], video: null },
        { id: 'cap-spiralrock', name: 'Spiral Rock', category: 'Capture Action', desc: 'Drilling projectile. Captures through walls and barriers. No cover saves them.', img: 'assets/images/TokenActions/Icon_TokenActions_Spiral_Rock_Attack.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Spiral_Rock_Attack.png'], video: null },
        { id: 'cap-thunder', name: 'Thunder', category: 'Capture Action', desc: 'Strike from the clouds with a bolt of lightning to capture an opponent\'s token.', img: 'assets/images/TokenActions/Icon_TokenActions_Thunder_Lightning.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Thunder_Lightning.png'], video: null },
        { id: 'cap-waterswim', name: 'Water Swim', category: 'Capture Action', desc: 'Swim, stalk and strike — capture a token with a slippery surprise attack.', img: 'assets/images/TokenActions/Icon_TokenActions_Water_Swim.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Water_Swim.png'], video: null },
        { id: 'cap-windsplash', name: 'Wind Splash', category: 'Capture Action', desc: 'Whisk an opponent\'s token away with a slicing gust of wind magic.', img: 'assets/images/TokenActions/Icon_TokenActions_Wind_Splash.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Wind_Splash.png'], video: null },
    ],
    environments: [
        { id: 'env-classic', name: 'Classic', category: 'Environment', desc: 'A simple and balanced environment for classic gameplay.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20C1%20Default.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20C1%20Default.png'], video: null },
        { id: 'env-city', name: 'City', category: 'Environment', desc: 'A lively urban environment filled with a vibrant city atmosphere.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20C2%20City.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20C2%20City.png'], video: null },
        { id: 'env-kidsroom', name: 'Kids Room', category: 'Environment', desc: 'A cozy indoor environment with a warm and relaxing atmosphere.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20C3%20Kids%20Room.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20C3%20Kids%20Room.png'], video: null },
        { id: 'env-castle', name: 'Castle', category: 'Environment', desc: 'Play your Ludo matches in a grand castle setting.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20C4%20Castle.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20C4%20Castle.png'], video: null },
        { id: 'env-christmas', name: 'Christmas', category: 'Environment', desc: 'Celebrate the season with a festive Christmas setting for your Ludo match.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20L1%20christmas.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20L1%20christmas.png'], video: null },
        { id: 'env-dragon', name: 'Dragon Lair', category: 'Environment', desc: 'A dragon-themed dice that brings a fierce touch to every roll.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20L2%20Dragon.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20L2%20Dragon.png'], video: null },
        { id: 'env-soccer', name: 'Soccer Field', category: 'Environment', desc: 'Take your Ludo match to the soccer field for a sporty setting.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20R1%20soccer%20field.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20R1%20soccer%20field.png'], video: null },
        { id: 'env-island', name: 'Island', category: 'Environment', desc: 'Enjoy your Ludo match in a relaxing island setting.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20R2%20Island.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20R2%20Island.png'], video: null },
        { id: 'env-magical', name: 'Magical', category: 'Environment', desc: 'Bring a touch of wonder to your match in this magical setting.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20R3%20Magical.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20R3%20Magical.png'], video: null },
    ],
};

let currentCategory = 'dice';
let currentIndex = 0;
const modalOverlay = document.getElementById('itemModal');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const modalCategory = document.getElementById('modalCategory');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalMeta = document.getElementById('modalMeta');
const modalGallery = document.getElementById('modalGallery');
const modalCounter = document.getElementById('modalCounter');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const modalClose = document.getElementById('modalClose');

function openModal(category, index) {
    currentCategory = category;
    currentIndex = index;
    renderModal();
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    modalVideo.pause();
    modalVideo.style.display = 'none';
    modalImage.style.display = 'block';
}

function renderModal() {
    const items = ITEM_DATA[currentCategory];
    const item = items[currentIndex];

    modalCategory.textContent = item.category;
    modalTitle.textContent = item.name;
    modalDescription.textContent = item.desc;
    modalCounter.textContent = `${currentIndex + 1} / ${items.length}`;

    // Media
    modalVideo.pause();
    modalImage.src = item.img;
    modalImage.alt = item.name;
    modalImage.style.display = 'block';
    modalVideo.style.display = 'none';

    if (item.video) {
        modalVideo.src = item.video;
        modalVideo.style.display = 'block';
        modalImage.style.display = 'none';
    }

    // Meta tags
    modalMeta.innerHTML = `
        <span class="modal-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> ${item.category}</span>
        <span class="modal-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> View Details</span>
    `;

    // Gallery thumbnails - use item.gallery if available, otherwise fall back to all items
    const galleryImages = item.gallery && item.gallery.length > 0 ? item.gallery : items.map(it => it.img);
    modalGallery.innerHTML = galleryImages.map((imgSrc, i) => `
        <div class="modal-gallery-item ${i === 0 ? 'active' : ''}" data-index="${i}">
            <img src="${imgSrc}" alt="${item.name} preview ${i + 1}">
        </div>
    `).join('');

    // Gallery click
    modalGallery.querySelectorAll('.modal-gallery-item').forEach(el => {
        el.addEventListener('click', () => {
            // For now, just update the main image
            const idx = parseInt(el.dataset.index);
            const imgSrc = galleryImages[idx];
            modalVideo.pause();
            modalVideo.style.display = 'none';
            modalImage.style.display = 'block';
            modalImage.src = imgSrc;
            modalGallery.querySelectorAll('.modal-gallery-item').forEach((g, gi) => {
                g.classList.toggle('active', gi === idx);
            });
        });
    });

    // Nav buttons
    modalPrev.disabled = currentIndex === 0;
    modalNext.disabled = currentIndex === items.length - 1;
}

// Event listeners
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});
modalPrev.addEventListener('click', () => {
    if (currentIndex > 0) openModal(currentCategory, currentIndex - 1);
});
modalNext.addEventListener('click', () => {
    const items = ITEM_DATA[currentCategory];
    if (currentIndex < items.length - 1) openModal(currentCategory, currentIndex + 1);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!modalOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') modalPrev.click();
    if (e.key === 'ArrowRight') modalNext.click();
});

// Attach click handlers to all clickable items
function attachModalTriggers() {
    // Dice
    document.querySelectorAll('.dc').forEach((el, i) => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => openModal('dice', i));
    });
    // Boards
    document.querySelectorAll('.bt').forEach((el, i) => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => openModal('boards', i));
    });
    // Fun Actions
    document.querySelectorAll('.token-fun:not(.token-fun--attack) .tf').forEach((el, i) => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => openModal('funActions', i));
    });
    // Capture Actions
    document.querySelectorAll('.token-fun--attack .tf').forEach((el, i) => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => openModal('captureActions', i));
    });
    // Environments
    document.querySelectorAll('.ec').forEach((el, i) => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => openModal('environments', i));
    });
}

// Initialize after DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachModalTriggers);
} else {
    attachModalTriggers();
}

// ---------- Full-view screenshots ----------
const screenshotViewer = document.getElementById('screenshotViewer');
const screenshotFull = document.getElementById('screenshotFull');
const screenshotClose = document.getElementById('screenshotClose');
let screenshotTrigger = null;
let screenshotPreviousOverflow = '';

document.querySelectorAll('#parade .shot').forEach(shot => {
    const image = shot.querySelector('img');
    shot.setAttribute('role', 'button');
    shot.setAttribute('tabindex', '0');
    shot.setAttribute('aria-label', `View full screenshot: ${image.alt}`);
    shot.setAttribute('aria-haspopup', 'dialog');

    const openScreenshot = () => {
        if (screenshotViewer.open) return;
        screenshotTrigger = shot;
        screenshotPreviousOverflow = document.body.style.overflow;
        screenshotFull.src = image.currentSrc || image.src;
        screenshotFull.alt = image.alt;
        screenshotViewer.showModal();
        document.body.style.overflow = 'hidden';
        screenshotClose.focus();
    };

    shot.addEventListener('click', openScreenshot);
    shot.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openScreenshot();
        }
    });
});

screenshotClose.addEventListener('click', () => screenshotViewer.close());
screenshotViewer.addEventListener('click', e => {
    if (e.target === screenshotViewer) screenshotViewer.close();
});
// Native dialog handles Escape and keeps keyboard focus inside the viewer.
screenshotViewer.addEventListener('close', () => {
    document.body.style.overflow = screenshotPreviousOverflow;
    screenshotFull.removeAttribute('src');
    if (screenshotTrigger) screenshotTrigger.focus({ preventScroll: true });
});

// ---------- Feedback form ----------
const feedbackForm = document.getElementById('feedbackForm');
const feedbackStatus = document.getElementById('feedbackStatus');

const feedbackEndpoint = 'https://docs.google.com/forms/d/e/1FAIpQLSexoyGQKwguZXJxcejHz3oEAtuQnNhnVnIg3Lw61jmpKjkdUQ/formResponse';
// These entry IDs belong to the published form; update them if questions are recreated.
const feedbackFields = {
    name: 'entry.1568226805',
    email: 'entry.27432634',
    subject: 'entry.1897350469',
    message: 'entry.1844792717',
};
let feedbackSubmitting = false;

feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (feedbackSubmitting || !feedbackForm.reportValidity()) return;
    const formData = new FormData(feedbackForm);
    const body = new URLSearchParams();
    for (const [name, entry] of Object.entries(feedbackFields)) {
        const value = String(formData.get(name) || '').trim();
        if (!value) {
            feedbackStatus.textContent = 'Please complete every field before sending.';
            feedbackForm.elements.namedItem(name).focus();
            return;
        }
        body.set(entry, value);
    }

    const button = feedbackForm.querySelector('button[type="submit"]');
    const originalLabel = button.textContent;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    feedbackSubmitting = true;
    button.disabled = true;
    button.textContent = 'Sending...';
    feedbackForm.setAttribute('aria-busy', 'true');
    feedbackStatus.textContent = 'Sending your feedback to Google Forms...';

    try {
        // Google Forms does not expose a readable cross-origin response.
        // An opaque response is NOT proof that Google accepted the submission.
        await fetch(feedbackEndpoint, {
            method: 'POST',
            mode: 'no-cors',
            credentials: 'omit',
            body,
            signal: controller.signal,
        });
        feedbackStatus.textContent = 'Submission request sent to Google Forms. This page cannot confirm it was saved. Your text has been kept; use the direct form link below if you need confirmation.';
    } catch (error) {
        feedbackStatus.textContent = error.name === 'AbortError'
            ? 'The request timed out; delivery is unknown. Your text is still here. Check your connection or use the Google Form below.'
            : 'Could not confirm delivery. Your text is still here. Check your connection or use the Google Form below.';
    } finally {
        clearTimeout(timeout);
        feedbackSubmitting = false;
        button.disabled = false;
        button.textContent = originalLabel;
        feedbackForm.removeAttribute('aria-busy');
    }
});
