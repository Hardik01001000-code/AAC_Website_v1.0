// Shooting Star Animation
(function() {
    'use strict';

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

    function createShootingStar() {
        const star = document.createElement('div');
        star.className = 'shooting-star';

        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * (window.innerHeight * 0.2);
        const angle = 45 + (Math.random() * 10 - 5);
        const distance = 300 + Math.random() * 400;
        const angleRad = (angle * Math.PI) / 180;
        const distanceX = Math.cos(angleRad) * distance;
        const distanceY = Math.sin(angleRad) * distance;
        const duration = 0.8 + Math.random() * 0.7;

        star.style.cssText = `
            left: ${startX}px;
            top: ${startY}px;
            --angle: ${angle}deg;
            --distance-x: ${distanceX}px;
            --distance-y: ${distanceY}px;
            animation: shoot ${duration}s linear forwards;
        `;

        document.body.appendChild(star);

        setTimeout(() => star.remove(), duration * 1000);
    }

    function scheduleNextStar() {
        // One star between every 20s to 30s randomly
        const interval = 20000 + Math.random() * 10000;

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
