/**
 * High-performance confetti relay
 */
export const triggerConfetti = async () => {
    try {
        // Dynamic import from CDN to avoid bundle bloat
        // @ts-ignore
        const confetti = (await import('https://cdn.skypack.dev/canvas-confetti')).default;

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f97316', '#ffffff', '#fb923c']
        });
    } catch (e) {
        console.error('Confetti failed to launch:', e);
    }
};

export const triggerSuccessBurst = async () => {
    try {
        // @ts-ignore
        const confetti = (await import('https://cdn.skypack.dev/canvas-confetti')).default;

        const duration = 3 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#f97316']
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    } catch (e) {
        console.error('Success burst failed:', e);
    }
};
