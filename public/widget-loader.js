(function () {
    const CONFIG = {
        primaryColor: '#f97316',
        baseUrl: window.location.origin, // Fallback to current domain if not specified
    };

    function init() {
        const script = document.currentScript || document.querySelector('script[data-onboardly-id]');
        const clientId = script?.getAttribute('data-onboardly-id');

        if (!clientId) {
            console.error('Onboardly Error: Missing data-onboardly-id attribute');
            return;
        }

        // Create Container
        const container = document.createElement('div');
        container.id = 'onboardly-widget-container';
        container.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        `;

        // Create Button
        const button = document.createElement('button');
        button.style.cssText = `
            width: 56px;
            height: 56px;
            border-radius: 16px;
            background: ${CONFIG.primaryColor};
            box-shadow: 0 8px 32px rgba(249, 115, 22, 0.4);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            outline: none;
        `;
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        `;

        // Create Iframe Panel
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: absolute;
            bottom: 72px;
            right: 0;
            width: 320px;
            max-width: calc(100vw - 48px);
            height: 480px;
            max-height: calc(100vh - 120px);
            background: #0b0c10;
            border-radius: 24px;
            box-shadow: 0 12px 48px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
            overflow: hidden;
            display: none;
            transform-origin: bottom right;
            transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
            opacity: 0;
            transform: scale(0.9) translateY(20px);
        `;

        const iframe = document.createElement('iframe');
        iframe.src = `${CONFIG.baseUrl}/widget/${clientId}`;
        iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
        panel.appendChild(iframe);

        let isOpen = false;
        button.onclick = () => {
            isOpen = !isOpen;
            if (isOpen) {
                panel.style.display = 'block';
                setTimeout(() => {
                    panel.style.opacity = '1';
                    panel.style.transform = 'scale(1) translateY(0)';
                    button.style.transform = 'rotate(90deg) scale(0.9)';
                }, 10);
            } else {
                panel.style.opacity = '0';
                panel.style.transform = 'scale(0.9) translateY(20px)';
                button.style.transform = 'rotate(0deg) scale(1)';
                setTimeout(() => {
                    panel.style.display = 'none';
                }, 300);
            }
        };

        // Handle Messages from Iframe (e.g. Confetti)
        window.addEventListener('message', (event) => {
            if (event.data.type === 'ONBOARDLY_TASK_COMPLETED') {
                console.log('Onboardly: Task Completed!', event.data.progress);
                // Trigger localized explosion or something here if desired
            }
        });

        container.appendChild(panel);
        container.appendChild(button);
        document.body.appendChild(container);

        // Hover Effect
        button.onmouseenter = () => { if (!isOpen) button.style.transform = 'scale(1.1) translateY(-2px)'; };
        button.onmouseleave = () => { if (!isOpen) button.style.transform = 'scale(1) translateY(0)'; };
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
