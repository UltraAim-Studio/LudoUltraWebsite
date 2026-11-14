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
        { id: 'dice-classic', name: 'Classic', category: 'Dice', desc: 'The timeless standard — clean white pips on a crisp cube. Balanced, familiar, and always fair.', img: 'assets/images/Icon_Dice/Icon_Dice_1_Default.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_1_Default.png'], video: null },
        { id: 'dice-metal', name: 'Metal', category: 'Dice', desc: 'Forged from brushed steel. Heavy in hand, satisfying to roll — every toss feels decisive.', img: 'assets/images/Icon_Dice/Icon_Dice_3_Metal.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_3_Metal.png'], video: null },
        { id: 'dice-marble', name: 'Marble', category: 'Dice', desc: 'Swirled veins of stone. No two faces alike — elegance meets chance in every roll.', img: 'assets/images/Icon_Dice/Icon_Dice_4_Marbel.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_4_Marbel.png'], video: null },
        { id: 'dice-color', name: 'Color', category: 'Dice', desc: 'Vivid hues on every face. Bright, bold, and impossible to ignore on the board.', img: 'assets/images/Icon_Dice/Icon_Dice_5_Color.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_5_Color.png'], video: null },
        { id: 'dice-rainbow', name: 'Rainbow', category: 'Dice', desc: 'Prismatic shimmer shifts with the light. A spectacle that turns every roll into a show.', img: 'assets/images/Icon_Dice/Icon_Dice_6_RainBow.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_6_RainBow.png'], video: null },
        { id: 'dice-heart', name: 'Heart', category: 'Dice', desc: 'Rounded corners, heart-shaped pips. Play with affection — even your cuts feel warm.', img: 'assets/images/Icon_Dice/Icon_Dice_7_Heart.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_7_Heart.png'], video: null },
        { id: 'dice-ice', name: 'Ice', category: 'Dice', desc: 'Frost-etched crystal. Cold to the touch, sharp in the roll — winter never looked this good.', img: 'assets/images/Icon_Dice/Icon_Dice_8_ice.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_8_ice.png'], video: null },
        { id: 'dice-dragon', name: 'Dragon', category: 'Dice', desc: 'Scales etched deep, pips like embers. Legendary weight for legendary plays.', img: 'assets/images/Icon_Dice/Icon_Dice_13_dragon.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_13_dragon.png'], video: null },
        { id: 'dice-scifi', name: 'Sci-Fi', category: 'Dice', desc: 'Holographic edges, neon pips. From the year 3024 — roll the future.', img: 'assets/images/Icon_Dice/Icon_Dice_17_Scifi.png', gallery: ['assets/images/Icon_Dice/Icon_Dice_17_Scifi.png'], video: null },
    ],
    boards: [
        { id: 'board-classic', name: 'Classic', category: 'Board', desc: 'The original arena. Four colors, four homes, one path to victory — pure Ludo since day one.', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%200%20Default.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%200%20Default.png'], video: null },
        { id: 'board-round', name: 'Round', category: 'Board', desc: 'Circular track, radial homes. No corners to hide in — the chase wraps around endlessly.', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%201%20Round.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%201%20Round.png'], video: null },
        { id: 'board-ice', name: 'Ice', category: 'Board', desc: 'Frozen lake with cracking tiles. Slide across slick surfaces — momentum is everything here.', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%202%20Ice.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%202%20Ice.png'], video: null },
        { id: 'board-wooden', name: 'Wooden', category: 'Board', desc: 'Carved oak, warm grain, brass inlays. The feel of a family heirloom, built for generations.', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%203%20Wooden.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%203%20Wooden.png'], video: null },
        { id: 'board-metal', name: 'Metal', category: 'Board', desc: 'Industrial steel deck, glowing track lines. Cold, precise, tournament-grade.', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%204%20Metal.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%204%20Metal.png'], video: null },
        { id: 'board-rock', name: 'Rock', category: 'Board', desc: 'Cavern floor, stalagmite obstacles. Rugged terrain where only the bold survive.', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%205%20Rock.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%205%20Rock.png'], video: null },
        { id: 'board-scifi', name: 'Sci-Fi', category: 'Board', desc: 'Neon grid, holo-barriers, zero-G zones. The board is alive — and it changes.', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%206%20Scifi.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%206%20Scifi.png'], video: null },
        { id: 'board-black', name: 'Black', category: 'Board', desc: 'Obsidian void, only the path glows. High contrast, high stakes — nothing to distract.', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%207%20Black.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%207%20Black.png'], video: null },
        { id: 'board-octagon', name: 'Octagon', category: 'Board', desc: 'Eight-sided arena, diagonal runs. New angles, new strategies, same race home.', img: 'assets/images/Icon_Board/Icon_Model_LudoBoard%208%20Octagon.png', gallery: ['assets/images/Icon_Board/Icon_Model_LudoBoard%208%20Octagon.png'], video: null },
    ],
    funActions: [
        { id: 'fun-banana', name: 'Banana', category: 'Fun Action', desc: 'Drop a peel — next token to land here slips back 3 spaces. Classic slapstick.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Banana.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Banana.png'], video: null },
        { id: 'fun-snowball', name: 'Snowball', category: 'Fun Action', desc: 'Freeze an opponent for one turn. They\'ll thaw... eventually.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Snowball.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Snowball.png'], video: null },
        { id: 'fun-heart', name: 'Heart', category: 'Fun Action', desc: 'Send a little love. Heals 1 HP if your token is damaged, or just makes them smile.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Heart.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Heart.png'], video: null },
        { id: 'fun-paperplane', name: 'Paper Plane', category: 'Fun Action', desc: 'Launch a message across the board. Randomly teleports a friendly token forward 1-6.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_PaperPlane.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_PaperPlane.png'], video: null },
        { id: 'fun-rose', name: 'Rose', category: 'Fun Action', desc: 'Charm an enemy — they skip their next attack action. Beauty disarms.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Rose.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Rose.png'], video: null },
        { id: 'fun-loveyou', name: 'Love You', category: 'Fun Action', desc: 'Blow a kiss. Both you and target gain a shield for one round. Mutual protection.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_LoveYou.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_LoveYou.png'], video: null },
        { id: 'fun-waterballoon', name: 'Water Balloon', category: 'Fun Action', desc: 'Splash! Target is soaked — movement reduced by half next turn.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_WaterBalloon.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_WaterBalloon.png'], video: null },
        { id: 'fun-dance', name: 'Dance', category: 'Fun Action', desc: 'Break it down. All tokens in range join a conga line — move together next roll.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Dance.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Dance.png'], video: null },
        { id: 'fun-brokenheart', name: 'Broken Heart', category: 'Fun Action', desc: 'Shatter their morale. Target loses their next capture action. Ouch.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_BrokenHeart.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_BrokenHeart.png'], video: null },
        { id: 'fun-cake', name: 'Cake', category: 'Fun Action', desc: 'Celebrate! Everyone in range gets a bonus roll. Sugar rush for all.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Cake.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Cake.png'], video: null },
        { id: 'fun-dice', name: 'Dice', category: 'Fun Action', desc: 'Roll a phantom die. Result applies as bonus movement to any token you choose.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Dice.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Dice.png'], video: null },
        { id: 'fun-duck', name: 'Duck', category: 'Fun Action', desc: 'Quack! Dodge the next incoming capture. The ultimate pacifist move.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Duck.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Duck.png'], video: null },
        { id: 'fun-egg', name: 'Egg', category: 'Fun Action', desc: 'Plant an egg. Hatches in 3 turns into a random buff. Patience rewarded.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Egg.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Egg.png'], video: null },
        { id: 'fun-hateyou', name: 'Hate You', category: 'Fun Action', desc: 'Flip the bird. Target\'s next roll is halved (rounded down). Pure spite.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_HateYou.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_HateYou.png'], video: null },
        { id: 'fun-missyou', name: 'Miss You', category: 'Fun Action', desc: 'Send a postcard. Teleports a far-away friendly token to your side. Reunion!', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_MissYou.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_MissYou.png'], video: null },
        { id: 'fun-shoe', name: 'Shoe', category: 'Fun Action', desc: 'Throw a shoe. Knocks target back 2 spaces and stuns for half a turn.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Shoe.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Shoe.png'], video: null },
        { id: 'fun-stone', name: 'Stone', category: 'Fun Action', desc: 'Drop a rock. Creates a temporary barrier — no passing for one full round.', img: 'assets/images/TokenFunActions/Icon_TokenFunActions_Stone.png', gallery: ['assets/images/TokenFunActions/Icon_TokenFunActions_Stone.png'], video: null },
    ],
    captureActions: [
        { id: 'cap-fireball', name: 'Fire Ball', category: 'Capture Action', desc: 'Incinerate the target — instant capture with burn damage over 2 turns.', img: 'assets/images/TokenActions/Icon_TokenActions_Fire_Ball.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Fire_Ball.png'], video: null },
        { id: 'cap-rockthrow', name: 'Rock Throw', category: 'Capture Action', desc: 'Heavy impact. Captures and knocks the victim back to their home base.', img: 'assets/images/TokenActions/Icon_TokenActions_Rock_Throw.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Rock_Throw.png'], video: null },
        { id: 'cap-gunshoot', name: 'Gun Shoot', category: 'Capture Action', desc: 'Precision strike. Long-range capture — reach tokens up to 10 spaces away.', img: 'assets/images/TokenActions/Icon_TokenActions_Gun_Shoot.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Gun_Shoot.png'], video: null },
        { id: 'cap-sword', name: 'Sword', category: 'Capture Action', desc: 'Honorable duel. Capture adjacent enemy and gain +2 to your next roll.', img: 'assets/images/TokenActions/Icon_TokenActions_Sword.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Sword.png'], video: null },
        { id: 'cap-watersplash', name: 'Water Splash', category: 'Capture Action', desc: 'Tidal wave. Captures target and washes away their active buffs.', img: 'assets/images/TokenActions/Icon_TokenActions_Water_Splash.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Water_Splash.png'], video: null },
        { id: 'cap-grenade', name: 'Grenade', category: 'Capture Action', desc: 'Explosive radius. Captures target + all adjacent enemies. Area denial.', img: 'assets/images/TokenActions/Icon_TokenActions_Grenade.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Grenade.png'], video: null },
        { id: 'cap-kick', name: 'Kick', category: 'Capture Action', desc: 'Boot them out. Standard capture with a satisfying punt animation.', img: 'assets/images/TokenActions/Icon_TokenActions_Kick.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Kick.png'], video: null },
        { id: 'cap-laser', name: 'Laser Attack', category: 'Capture Action', desc: 'Beam pierces shields. Ignores defensive buffs and captures instantly.', img: 'assets/images/TokenActions/Icon_TokenActions_Laser_Attack.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Laser_Attack.png'], video: null },
        { id: 'cap-magicspike', name: 'Magic Spike', category: 'Capture Action', desc: 'Eldritch impalement. Captures and curses — victim rolls -1 for 3 turns.', img: 'assets/images/TokenActions/Icon_TokenActions_Magic_Spike_Attack.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Magic_Spike_Attack.png'], video: null },
        { id: 'cap-meteor', name: 'Meteor', category: 'Capture Action', desc: 'Orbital strike. Capture with screen-shake impact. High drama, high damage.', img: 'assets/images/TokenActions/Icon_TokenActions_Meteor.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Meteor.png'], video: null },
        { id: 'cap-punch', name: 'Punch', category: 'Capture Action', desc: 'Straight jab. Quick capture, no frills. Reliable up-close work.', img: 'assets/images/TokenActions/Icon_TokenActions_Punch.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Punch.png'], video: null },
        { id: 'cap-spiralrock', name: 'Spiral Rock', category: 'Capture Action', desc: 'Drilling projectile. Captures through walls and barriers. No cover saves them.', img: 'assets/images/TokenActions/Icon_TokenActions_Spiral_Rock_Attack.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Spiral_Rock_Attack.png'], video: null },
        { id: 'cap-thunder', name: 'Thunder', category: 'Capture Action', desc: 'Lightning arc. Captures target and chains to one nearby enemy. Zap zap.', img: 'assets/images/TokenActions/Icon_TokenActions_Thunder_Lightning.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Thunder_Lightning.png'], video: null },
        { id: 'cap-waterswim', name: 'Water Swim', category: 'Capture Action', desc: 'Drown the chase. Captures and drags victim to nearest water tile.', img: 'assets/images/TokenActions/Icon_TokenActions_Water_Swim.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Water_Swim.png'], video: null },
        { id: 'cap-windsplash', name: 'Wind Splash', category: 'Capture Action', desc: 'Gust blast. Captures and blows all tokens in a 3-radius back 2 spaces.', img: 'assets/images/TokenActions/Icon_TokenActions_Wind_Splash.png', gallery: ['assets/images/TokenActions/Icon_TokenActions_Wind_Splash.png'], video: null },
    ],
    environments: [
        { id: 'env-classic', name: 'Classic', category: 'Environment', desc: 'The original tabletop. Warm wood, soft felt, familiar dice cup — home turf.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20C1%20Default.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20C1%20Default.png'], video: null },
        { id: 'env-city', name: 'City', category: 'Environment', desc: 'Rooftop showdown. Neon skyline, distant traffic, rain-slick tiles. Urban legends play here.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20C2%20City.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20C2%20City.png'], video: null },
        { id: 'env-kidsroom', name: 'Kids Room', category: 'Environment', desc: 'Carpet battlefield. Toy blocks as obstacles, crayon-drawn paths. Nostalgia mode.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20C3%20Kids%20Room.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20C3%20Kids%20Room.png'], video: null },
        { id: 'env-castle', name: 'Castle', category: 'Environment', desc: 'Stone hall, torchlight, banner-draped walls. Play like royalty in the great hall.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20C4%20Castle.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20C4%20Castle.png'], video: null },
        { id: 'env-christmas', name: 'Christmas', category: 'Environment', desc: 'Snow-globe village. Twinkling lights, gift-box homes, Santa watches the rolls.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20L1%20christmas.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20L1%20christmas.png'], video: null },
        { id: 'env-dragon', name: 'Dragon Lair', category: 'Environment', desc: 'Molten cavern, gold piles, the wyrm stirs. High heat, high stakes.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20L2%20Dragon.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20L2%20Dragon.png'], video: null },
        { id: 'env-soccer', name: 'Soccer Field', category: 'Environment', desc: 'Pitch-perfect. Grass tiles, goal-post homes, referee whistle on capture.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20R1%20soccer%20field.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20R1%20soccer%20field.png'], video: null },
        { id: 'env-island', name: 'Island', category: 'Environment', desc: 'Tropical paradise. Sand paths, tide-pool homes, coconut dice. Vacation vibes.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20R2%20Island.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20R2%20Island.png'], video: null },
        { id: 'env-magical', name: 'Magical', category: 'Environment', desc: 'Floating isles, mana currents, runes glow underfoot. Magic changes the rules.', img: 'assets/images/Icon_Environment/Icon_Model_Environment%20R3%20Magical.png', gallery: ['assets/images/Icon_Environment/Icon_Model_Environment%20R3%20Magical.png'], video: null },
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
    modalImage.src = item.img;
    modalImage.alt = item.name;
    modalImage.style.display = 'block';
    modalVideo.style.display = 'none';

    // Remove any existing placeholder
    const existingPlaceholder = modalMedia.querySelector('.modal-video-placeholder');
    if (existingPlaceholder) existingPlaceholder.remove();

    if (item.video) {
        modalVideo.src = item.video;
        modalVideo.style.display = 'block';
        modalImage.style.display = 'none';
    } else {
        // Show portrait video placeholder for mobile
        const placeholder = document.createElement('div');
        placeholder.className = 'modal-video-placeholder';
        placeholder.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="2" width="20" height="20" rx="2"/>
                <polygon points="10 8 16 12 10 16"/>
            </svg>
            <span>Portrait video preview<br><small>Add video URL to item data</small></span>
        `;
        modalMedia.appendChild(placeholder);
    }

    // Meta tags
    modalMeta.innerHTML = `
        <span class="modal-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> ${item.category}</span>
        <span class="modal-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> View Details</span>
    `;

    // Gallery thumbnails - use item.gallery if available, otherwise fall back to all items
    const galleryImages = item.gallery && item.gallery.length > 0 ? item.gallery : items.map(it => it.img);
    modalGallery.innerHTML = galleryImages.map((imgSrc, i) => `
        <div class="modal-gallery-item ${i === 0 ? 'active' : ''}" data-index="${i}" style="background-image: url('${imgSrc}')">
            <img src="${imgSrc}" alt="${item.name} preview ${i + 1}">
        </div>
    `).join('');

    // Gallery click
    modalGallery.querySelectorAll('.modal-gallery-item').forEach(el => {
        el.addEventListener('click', () => {
            // For now, just update the main image
            const idx = parseInt(el.dataset.index);
            const imgSrc = galleryImages[idx];
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
