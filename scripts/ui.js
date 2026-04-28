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
                }, 400); 
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
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
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
})();
