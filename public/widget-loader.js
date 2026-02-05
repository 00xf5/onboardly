(function () {
    const CONFIG = {
        primaryColor: '#f97316',
        projectId: 'auth5-e43c9',
        baseUrl: window.location.origin,
    };

    const STYLES = `
        @keyframes onboardly-pulse {
            0% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
            50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
            100% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
        }

        .onboardly-hotspot {
            position: absolute;
            width: 20px;
            height: 20px;
            background: #f97316;
            border-radius: 50%;
            z-index: 999998;
            cursor: pointer;
            border: 2px solid white;
            animation: onboardly-pulse 2s infinite ease-in-out;
            pointer-events: auto;
        }

        .onboardly-tooltip {
            position: absolute;
            z-index: 999999;
            background: rgba(15, 17, 26, 0.8);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 16px;
            width: 240px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            pointer-events: auto;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .onboardly-tooltip.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .onboardly-tooltip h5 {
            margin: 0 0 8px 0;
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #f97316;
        }

        .onboardly-tooltip p {
            margin: 0;
            font-size: 12px;
            line-height: 1.5;
            color: rgba(255,255,255,0.7);
        }

        .onboardly-confetti {
            position: fixed;
            pointer-events: none;
            z-index: 1000000;
        }
    `;

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = STYLES;
        document.head.appendChild(style);
    }

    async function fetchData(clientId) {
        try {
            // 1. Resolve UserId from Slug
            const clientRes = await fetch(`https://firestore.googleapis.com/v1/projects/${CONFIG.projectId}/databases/(default)/documents:runQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    structuredQuery: {
                        from: [{ collectionId: 'clients' }],
                        where: {
                            fieldFilter: {
                                field: { fieldPath: 'slug' },
                                op: 'EQUAL',
                                value: { stringValue: clientId }
                            }
                        },
                        limit: 1
                    }
                })
            });
            const clientData = await clientRes.json();
            if (!clientData[0]?.document) return null;

            const userId = clientData[0].document.fields.userId.stringValue;

            // 2. Fetch Overlays for this User
            const overlayRes = await fetch(`https://firestore.googleapis.com/v1/projects/${CONFIG.projectId}/databases/(default)/documents:runQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    structuredQuery: {
                        from: [{ collectionId: 'overlays' }],
                        where: {
                            compositeFilter: {
                                op: 'AND',
                                filters: [
                                    { fieldFilter: { field: { fieldPath: 'userId' }, op: 'EQUAL', value: { stringValue: userId } } },
                                    { fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'active' } } }
                                ]
                            }
                        }
                    }
                })
            });
            const overlayData = await overlayRes.json();
            return overlayData
                .filter(d => d.document)
                .map(d => {
                    const f = d.document.fields;
                    return {
                        id: d.document.name.split('/').pop(),
                        type: f.type.stringValue,
                        selector: f.selector.stringValue,
                        content: f.content.stringValue,
                        position: f.position?.stringValue || 'top',
                        name: f.name.stringValue
                    };
                });
        } catch (e) {
            console.error('Onboardly: Subsystem Failure', e);
            return null;
        }
    }

    function renderOverlays(overlays) {
        overlays.forEach(overlay => {
            const target = document.querySelector(overlay.selector);
            if (!target) return;

            const rect = target.getBoundingClientRect();
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            if (overlay.type === 'hotspot') {
                const el = document.createElement('div');
                el.className = 'onboardly-hotspot';
                el.style.left = `${rect.left + scrollX + rect.width / 2 - 10}px`;
                el.style.top = `${rect.top + scrollY + rect.height / 2 - 10}px`;
                document.body.appendChild(el);

                // Attach Tooltip to Hotspot on Click/Hover
                el.onclick = () => showTooltip(overlay, target);
            } else if (overlay.type === 'tooltip') {
                showTooltip(overlay, target);
            }
        });
    }

    function showTooltip(overlay, target) {
        const existing = document.getElementById(`onboardly-tooltip-${overlay.id}`);
        if (existing) return;

        const rect = target.getBoundingClientRect();
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        const tip = document.createElement('div');
        tip.id = `onboardly-tooltip-${overlay.id}`;
        tip.className = 'onboardly-tooltip';

        tip.innerHTML = `
            <h5>${overlay.name}</h5>
            <p>${overlay.content}</p>
        `;

        document.body.appendChild(tip);

        const tipRect = tip.getBoundingClientRect();
        let top = 0, left = 0;

        switch (overlay.position) {
            case 'top':
                top = rect.top + scrollY - tipRect.height - 12;
                left = rect.left + scrollX + (rect.width / 2) - (tipRect.width / 2);
                break;
            case 'bottom':
                top = rect.bottom + scrollY + 12;
                left = rect.left + scrollX + (rect.width / 2) - (tipRect.width / 2);
                break;
            case 'left':
                top = rect.top + scrollY + (rect.height / 2) - (tipRect.height / 2);
                left = rect.left + scrollX - tipRect.width - 12;
                break;
            case 'right':
                top = rect.top + scrollY + (rect.height / 2) - (tipRect.height / 2);
                left = rect.right + scrollX + 12;
                break;
        }

        tip.style.top = `${top}px`;
        tip.style.left = `${left}px`;

        setTimeout(() => tip.classList.add('visible'), 10);

        // Auto-dismiss or click outside? Let's leave it for now for elegance.
        tip.onclick = () => {
            tip.classList.remove('visible');
            setTimeout(() => tip.remove(), 400);
        };
    }

    function initTrigger() {
        const script = document.currentScript || document.querySelector('script[data-onboardly-id]');
        const clientId = script?.getAttribute('data-onboardly-id');
        if (!clientId) return;

        injectStyles();

        fetchData(clientId).then(overlays => {
            if (overlays) renderOverlays(overlays);
        });

        // Current panel logic...
        const container = document.createElement('div');
        container.id = 'onboardly-widget-container';
        container.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 999999;';

        const button = document.createElement('button');
        button.style.cssText = `width: 56px; height: 56px; border-radius: 16px; background: ${CONFIG.primaryColor}; box-shadow: 0 8px 32px rgba(249, 115, 22, 0.4); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); outline: none;`;
        button.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';

        const panel = document.createElement('div');
        panel.style.cssText = 'position: absolute; bottom: 72px; right: 0; width: 320px; max-width: calc(100vw - 48px); height: 480px; max-height: calc(100vh - 120px); background: #0b0c10; border-radius: 24px; box-shadow: 0 12px 48px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); overflow: hidden; display: none; transform-origin: bottom right; transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); opacity: 0; transform: scale(0.9) translateY(20px);';

        const iframe = document.createElement('iframe');
        iframe.src = `${CONFIG.baseUrl}/widget/${clientId}`;
        iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
        panel.appendChild(iframe);

        let isOpen = false;
        button.onclick = () => {
            isOpen = !isOpen;
            if (isOpen) {
                panel.style.display = 'block';
                setTimeout(() => { panel.style.opacity = '1'; panel.style.transform = 'scale(1) translateY(0)'; button.style.transform = 'rotate(90deg) scale(0.9)'; }, 10);
            } else {
                panel.style.opacity = '0'; panel.style.transform = 'scale(0.9) translateY(20px)'; button.style.transform = 'rotate(0deg) scale(1)';
                setTimeout(() => { panel.style.display = 'none'; }, 300);
            }
        };

        // Handle Messages from Iframe (e.g. Confetti)
        window.addEventListener('message', (event) => {
            if (event.data.type === 'ONBOARDLY_TASK_COMPLETED') {
                triggerSuccessBurst();
            }
        });

        container.appendChild(panel);
        container.appendChild(button);
        document.body.appendChild(container);
    }

    function triggerSuccessBurst() {
        const colors = ['#f97316', '#3b82f6', '#10b981', '#ffffff'];
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'onboardly-confetti';
            const color = colors[Math.floor(Math.random() * colors.length)];

            const startX = window.innerWidth / 2;
            const startY = window.innerHeight / 2;

            particle.style.cssText = `
                width: ${Math.random() * 8 + 4}px;
                height: ${Math.random() * 8 + 4}px;
                background: ${color};
                left: ${startX}px;
                top: ${startY}px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                transition: all ${Math.random() * 1 + 1}s cubic-bezier(0.1, 0.8, 0.3, 1);
                box-shadow: 0 0 10px ${color}44;
            `;

            document.body.appendChild(particle);

            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 300 + 100;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist - 100;

            setTimeout(() => {
                particle.style.transform = `translate(${tx}px, ${ty}px) rotate(${Math.random() * 360}deg)`;
                particle.style.opacity = '0';
            }, 10);

            setTimeout(() => particle.remove(), 2000);
        }
    }

    if (document.readyState === 'complete') initTrigger();
    else window.addEventListener('load', initTrigger);
})();
