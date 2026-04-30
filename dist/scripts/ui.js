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

    // 4. Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.error('Service Worker registration failed', err));
    }

    // 5. PWA Install Button Logic
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        deferredPrompt = e;
        
        // Find navbar to inject install button
        const navContainer = document.querySelector('.nav-content > div:last-child');
        if (navContainer && !document.getElementById('install-btn')) {
            const installBtn = document.createElement('button');
            installBtn.id = 'install-btn';
            installBtn.className = 'btn';
            installBtn.style.padding = '0.4rem 1rem';
            installBtn.style.fontSize = '0.9rem';
            installBtn.style.border = '2px solid var(--color-sambar)';
            installBtn.style.color = 'var(--color-sambar)';
            installBtn.style.background = 'transparent';
            installBtn.style.marginLeft = '1rem';
            installBtn.innerHTML = '📱 Install App';
            
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                        installBtn.style.display = 'none';
                    }
                    deferredPrompt = null;
                }
            });
            
            navContainer.appendChild(installBtn);
        }
    });
})();
