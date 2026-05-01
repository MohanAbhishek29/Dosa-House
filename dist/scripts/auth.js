// ============================================================
// Dosa House — Auth Helper
// ============================================================

const STAFF_ROLES = {
    'admin@dosahouse.com': 'admin',
    'kitchen@dosahouse.com': 'kitchen',
    'delivery@dosahouse.com': 'delivery'
};

// Inject full-screen loader immediately — hides page until auth resolves
(function injectLoader() {
    const loader = document.createElement('div');
    loader.id = '__auth_loader';
    loader.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:#FFF8E1;z-index:99999;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        font-family:'Outfit',sans-serif;
    `;
    loader.innerHTML = `
        <div style="font-size:3rem;margin-bottom:1rem;">🍛</div>
        <div style="font-size:1.1rem;font-weight:700;color:#3E2723;">Dosa House</div>
        <div style="margin-top:1rem;width:40px;height:4px;background:#F57F17;border-radius:2px;animation:dh-pulse 1s ease-in-out infinite;"></div>
        <style>@keyframes dh-pulse{0%,100%{opacity:0.3;transform:scaleX(0.5)}50%{opacity:1;transform:scaleX(1)}}</style>
    `;
    document.documentElement.appendChild(loader);
})();

function hideLoader() {
    const l = document.getElementById('__auth_loader');
    if (l) l.remove();
}

// Get current user with role
function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            unsubscribe();
            if (!user) { resolve(null); return; }
            try {
                const userDoc = await db.collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                    resolve({ uid: user.uid, email: user.email, name: user.displayName || userDoc.data().name, ...userDoc.data() });
                } else {
                    const role = STAFF_ROLES[user.email] || 'customer';
                    const userData = {
                        name: user.displayName || user.email.split('@')[0],
                        email: user.email,
                        role,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    await db.collection('users').doc(user.uid).set(userData);
                    resolve({ uid: user.uid, ...userData });
                }
            } catch (e) {
                console.error('Auth error:', e);
                resolve(null);
            }
        });
    });
}

// Require login — redirect if not logged in or wrong role
async function requireAuth(allowedRoles) {
    const user = await getCurrentUser();
    if (!user) {
        window.location.replace('login.html');
        return null;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        const redirectMap = { admin: 'admin.html', kitchen: 'kitchen.html', delivery: 'delivery.html', customer: 'index.html' };
        window.location.replace(redirectMap[user.role] || 'index.html');
        return null;
    }
    hideLoader();
    return user;
}

// Logout
async function logoutUser() {
    await auth.signOut();
    window.location.replace('login.html');
}

