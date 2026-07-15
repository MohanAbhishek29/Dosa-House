// Global UI Script (Toast, WhatsApp, Transitions, PWA)

(function initUI() {
    // 1. Page Transition (Fade-in)
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 50);

    // Page Transition (Fade-out on internal links)
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            if (target && target.endsWith('.html') && link.target !== '_blank') {
                e.preventDefault();
                document.body.classList.remove('page-loaded');
                setTimeout(() => {
                    window.location.href = target;
                }, 150); 
            }
        });
    });

    // 2. Setup Toast Container
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    // Expose showToast globally
    window.showToast = function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = type === 'success' ? '✅' : '❌';
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // 3. Floating WhatsApp Button
    if (!window.location.pathname.includes('kitchen.html')) {
        const waBtn = document.createElement('a');
        waBtn.href = "https://wa.me/919392421941?text=Hi%20Dosa%20House,%20I%20need%20help%20with...";
        waBtn.target = "_blank";
        waBtn.className = "whatsapp-float";
        waBtn.title = "Contact us on WhatsApp";
        waBtn.innerHTML = `
            <svg viewBox="0 0 32 32" width="32" height="32" fill="currentColor">
                <path d="M16.002 0c-8.835 0-16 7.163-16 16 0 2.802 0.728 5.438 2.016 7.747l-2.018 7.371 7.545-1.977c2.253 1.157 4.793 1.815 7.457 1.815 8.835 0 16-7.163 16-16s-7.165-16-16-16zM16.002 29.288c-2.453 0-4.767-0.627-6.804-1.74l-0.487-0.289-4.301 1.127 1.146-4.195-0.318-0.505c-1.238-1.97-1.896-4.269-1.896-6.685 0-7.892 6.417-14.312 14.308-14.312 7.894 0 14.312 6.42 14.312 14.312s-6.419 14.288-14.308 14.288zM23.864 21.037c-0.433-0.217-2.559-1.264-2.955-1.409-0.395-0.145-0.684-0.217-0.972 0.217-0.288 0.433-1.117 1.409-1.369 1.698-0.252 0.289-0.505 0.325-0.938 0.108-0.433-0.217-1.826-0.673-3.48-2.148-1.288-1.148-2.158-2.566-2.41-3.001-0.252-0.434-0.027-0.669 0.19-0.885 0.195-0.194 0.433-0.505 0.65-0.758 0.217-0.253 0.289-0.433 0.433-0.722 0.145-0.289 0.072-0.542-0.036-0.758-0.108-0.217-0.972-2.348-1.332-3.214-0.352-0.844-0.709-0.73-0.972-0.743-0.252-0.013-0.541-0.013-0.83-0.013s-0.758 0.108-1.155 0.542c-0.397 0.433-1.516 1.481-1.516 3.612s1.552 4.19 1.769 4.478c0.217 0.289 3.053 4.66 7.396 6.536 1.032 0.446 1.838 0.713 2.467 0.912 1.036 0.329 1.979 0.282 2.724 0.171 0.834-0.124 2.559-1.047 2.919-2.059 0.361-1.011 0.361-1.878 0.252-2.059-0.108-0.181-0.396-0.289-0.829-0.505z"></path>
            </svg>
        `;
        document.body.appendChild(waBtn);
    }

    // 4. Register Service Worker for Mobile Push Notifications & PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('SW registered for push notifications:', registration);
            }).catch(error => {
                console.log('SW registration failed:', error);
            });
        });
    }

    // 5. PWA Install Button Logic
    let deferredPrompt;
    const installBtn = document.getElementById('install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        deferredPrompt = e;
    });

    if (installBtn) {
        installBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    installBtn.style.display = 'none';
                }
                deferredPrompt = null;
            } else {
                // If it's already installed or on iOS where prompt doesn't work
                if (window.showToast) {
                    window.showToast("To install, tap the Share icon ⍗ and select 'Add to Home Screen'", "success");
                } else {
                    alert("To install, tap the Share icon and select 'Add to Home Screen'");
                }
            }
        });
    }
})();
window.addEventListener('load', () => {
    // Check if the current page is a customer-facing page (not admin/kitchen/delivery)
    const path = window.location.pathname;
    const isCustomerPage = !path.includes('admin') && !path.includes('kitchen') && !path.includes('delivery');
    
    if (isCustomerPage) {
        checkRestaurantStatusUI();
        window.addEventListener('restaurantStatusChanged', checkRestaurantStatusUI);
    }
});

function checkRestaurantStatusUI() {
    if (typeof isRestaurantOpen === 'undefined') return; // Wait for firebase-config to load
    
    const isOpen = isRestaurantOpen();
    
    // 1. Update Live Indicator (if it exists on nav)
    let liveIndicator = document.getElementById('global-live-indicator');
    if (!liveIndicator) {
        // Find navbar and inject if missing
        const navRight = document.querySelector('.nav-links');
        if (navRight && window.location.pathname.includes('index.html')) {
            liveIndicator = document.createElement('div');
            liveIndicator.id = 'global-live-indicator';
            liveIndicator.style.cssText = `
                display: flex; align-items: center; gap: 0.4rem; 
                font-weight: 700; font-size: 0.85rem; padding: 0.3rem 0.8rem; 
                border-radius: 20px; transition: all 0.3s;
            `;
            // Insert before the login button
            const loginBtn = document.getElementById('nav-login-wrap');
            if (loginBtn) {
                navRight.insertBefore(liveIndicator, loginBtn);
            } else {
                navRight.appendChild(liveIndicator);
            }
        }
    }
    
    if (liveIndicator) {
        if (isOpen) {
            liveIndicator.innerHTML = `<span style="color:#4CAF50; animation: blink 2s infinite;">●</span> <span style="color:#2E7D32;">OPEN</span>`;
            liveIndicator.style.background = '#E8F5E9';
        } else {
            liveIndicator.innerHTML = `<span style="color:#EF5350; animation: blink 1s infinite;">●</span> <span style="color:#D32F2F;">CLOSED</span>`;
            liveIndicator.style.background = '#FFEBEE';
        }
    }

    // 2. Add style for blinking if not exists
    if (!document.getElementById('blink-style')) {
        const style = document.createElement('style');
        style.id = 'blink-style';
        style.textContent = `@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`;
        document.head.appendChild(style);
    }

    // 3. Show "We Are Closed" full screen modal (once per session)
    if (!isOpen && !sessionStorage.getItem('closedModalShown')) {
        showClosedModal();
        sessionStorage.setItem('closedModalShown', 'true');
    }
    
    // 4. Show fixed banner on menu page if closed
    const menuContainer = document.querySelector('.menu-controls');
    if (menuContainer) {
        let banner = document.getElementById('closed-banner');
        if (!isOpen) {
            if (!banner) {
                banner = document.createElement('div');
                banner.id = 'closed-banner';
                banner.style.cssText = `
                    width: 100%; background: #FFEBEE; border: 1px solid #EF9A9A; 
                    color: #D32F2F; padding: 1rem; border-radius: 12px; text-align: center; 
                    font-weight: 700; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                `;
                banner.innerHTML = `<span style="animation: blink 1s infinite;">🔴</span> Restaurant is Currently Closed. We accept orders from 9:00 AM to 11:30 PM.`;
                menuContainer.parentNode.insertBefore(banner, menuContainer);
            }
        } else if (banner) {
            banner.remove();
        }
    }
}

function showClosedModal() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px); z-index: 999999;
        display: flex; align-items: center; justify-content: center;
        opacity: 0; transition: opacity 0.5s ease;
    `;
    
    const card = document.createElement('div');
    card.style.cssText = `
        background: white; padding: 3rem; border-radius: 24px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.1); text-align: center;
        max-width: 90%; transform: translateY(20px); transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    
    card.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 1rem;">😴</div>
        <h2 style="font-size: 2rem; color: #3E2723; margin-bottom: 0.5rem; font-family: 'Outfit', sans-serif;">We're currently resting.</h2>
        <p style="color: #666; font-size: 1.1rem; line-height: 1.5;">Dosa House is closed right now.<br>Please visit us between <strong>9:00 AM and 11:30 PM</strong>.</p>
    `;
    
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    
    // Animate in
    setTimeout(() => {
        overlay.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 50);
    
    // Auto remove after 6 seconds
    setTimeout(() => {
        overlay.style.opacity = '0';
        card.style.transform = 'translateY(-20px)';
        setTimeout(() => overlay.remove(), 500);
    }, 6000);
}
