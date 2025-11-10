// Shooting Star Animation
(function() {
    'use strict';

    // CONFIGURABLE CONSTANTS
    const BASE_ANGLE = 45;          // Default shooting direction (degrees)
    const ANGLE_VARIATION = 10;     // Range of variation around the base angle (±5 degrees)
    const MIN_DISTANCE = 300;       // Minimum travel distance (px)
    const MAX_DISTANCE = 700;       // Maximum travel distance (px)
    const MIN_DURATION = 0.8;       // Minimum animation duration (seconds)
    const MAX_DURATION = 1.5;       // Maximum animation duration (seconds)
    const MIN_INTERVAL = 20000;     // Minimum time between stars (ms)
    const MAX_INTERVAL = 30000;     // Maximum time between stars (ms)
    const STAR_BAND_HEIGHT = 0.2;   // Portion of screen height where stars appear (top 20%)

    // STYLES
    const style = document.createElement('style');
    style.textContent = `
        .shooting-star {
            position: fixed;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);
            z-index: 9999;
            pointer-events: none;
        }

        .shooting-star::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            height: 2px;
            background: linear-gradient(to right, rgba(255, 255, 255, 0.8), transparent);
            transform-origin: right center;
        }

        @keyframes shoot {
            0% {
                opacity: 1;
                transform: translate(0, 0) rotate(var(--angle));
            }
            100% {
                opacity: 0;
                transform: translate(var(--distance-x), var(--distance-y)) rotate(var(--angle));
            }
        }
    `;
    document.head.appendChild(style);

    // SHOOTING STAR CREATION
    function createShootingStar() {
        const star = document.createElement('div');
        star.className = 'shooting-star';

        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * (window.innerHeight * STAR_BAND_HEIGHT);
        const angle = BASE_ANGLE + (Math.random() * ANGLE_VARIATION - ANGLE_VARIATION / 2);
        const distance = MIN_DISTANCE + Math.random() * (MAX_DISTANCE - MIN_DISTANCE);
        const angleRad = (angle * Math.PI) / 180;
        const distanceX = Math.cos(angleRad) * distance;
        const distanceY = Math.sin(angleRad) * distance;
        const duration = MIN_DURATION + Math.random() * (MAX_DURATION - MIN_DURATION);

        star.style.cssText = `
            left: ${startX}px;
            top: ${startY}px;
            --angle: ${angle}deg;
            --distance-x: ${distanceX}px;
            --distance-y: ${distanceY}px;
            animation: shoot ${duration}s linear forwards;
        `;

        document.body.appendChild(star);

        setTimeout(() => { if (star.parentNode) star.remove(); }, duration * 1000);
    }

    // STAR SCHEDULING
    function scheduleNextStar() {
        const interval = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);

        setTimeout(() => {
            createShootingStar();
            scheduleNextStar();
        }, interval);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => scheduleNextStar());
    } else {
        scheduleNextStar();
    }
})();
