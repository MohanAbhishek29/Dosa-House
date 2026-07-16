// ============================================================
// Dosa House — Auth Helper
// STAFF_ROLES is defined in firebase-config.js — do NOT redeclare here
// ============================================================

function hideLoader() {
    const l = document.getElementById('__auth_loader');
    if (l) { l.style.opacity = '0'; setTimeout(() => l.remove(), 200); }
}

// Get current user with role from Firestore
function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            unsubscribe();
            if (!user) { resolve(null); return; }
            try {
                // The root admin is unchangeable
                const isRootAdmin = user.email === 'admin@dosahouse.com';

                const userDoc = await db.collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                    const data = userDoc.data();
                    let role = isRootAdmin ? 'admin' : (data.role || 'customer');
                    
                    if (isRootAdmin && data.role !== 'admin') {
                        db.collection('users').doc(user.uid).update({ role: 'admin' });
                    }
                    
                    resolve({ uid: user.uid, email: user.email || data.email || null, phone: user.phoneNumber || data.phone || null, name: user.displayName || data.name || 'Customer', ...data, role });
                } else {
                    const role = isRootAdmin ? 'admin' : 'customer';
                    // Generate a name from email, or phone, or default to Customer
                    const defaultName = user.displayName || (user.email ? user.email.split('@')[0] : (user.phoneNumber ? user.phoneNumber : 'Customer'));
                    const userData = {
                        name: defaultName,
                        email: user.email || null,
                        phone: user.phoneNumber || null,
                        role,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    await db.collection('users').doc(user.uid).set(userData);
                    resolve({ uid: user.uid, ...userData });
                }
            } catch (e) {
                console.error('Auth error in getCurrentUser:', e);
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

// ============================================================
// setupNavAuth — call on any PUBLIC page.
// Shows Login button for guests, profile dropdown for logged-in users.
// Pass requireLoginFn if you want to guard specific actions.
// ============================================================
async function setupNavAuth() {
    hideLoader();
    const user = await getCurrentUser();
    const profileWrap = document.getElementById('user-profile-wrap');
    const loginWrap = document.getElementById('nav-login-wrap');

    if (user) {
        // Logged in — show profile button, hide login button
        if (profileWrap) profileWrap.style.display = 'block';
        if (loginWrap) loginWrap.style.display = 'none';
        
        const mProfile = document.querySelector('.mobile-profile-link');
        const mLogin = document.querySelector('.mobile-login-link');
        if (mProfile) mProfile.style.display = 'block';
        if (mLogin) mLogin.style.display = 'none';
        
        const nameEl = document.getElementById('user-name-nav');
        const emailEl = document.getElementById('profile-email');
        const avatarEl = document.getElementById('user-avatar');
        if (nameEl) nameEl.textContent = user.name?.split(' ')[0] || 'Me';
        if (emailEl) emailEl.textContent = user.email || user.phone || 'User';
        const photo = user.photoBase64 || user.photoURL;
        if (avatarEl && photo) {
            avatarEl.innerHTML = `<img src="${photo}" alt="User Avatar" style="width:24px;height:24px;border-radius:50%;object-fit:cover;vertical-align:middle;">`;
        }

        // Global Push Notification Listener for Customer Orders
        if (typeof db !== 'undefined' && typeof window.__notifListenerSet === 'undefined') {
            window.__notifListenerSet = true;
            
            // Ask for permission if not already granted
            if (typeof Notification !== 'undefined' && Notification.permission !== "granted" && Notification.permission !== "denied") {
                Notification.requestPermission();
            }

            db.collection('orders').where('customerId', '==', user.uid).onSnapshot(snap => {
                snap.docChanges().forEach(change => {
                    if (change.type === 'modified') {
                        const data = change.doc.data();
                        const status = data.status || 'pending';
                        
                        let msg = "Your order status updated to: " + status.replace('_', ' ');
                        if (status === 'preparing') msg = "👨‍🍳 Kitchen is preparing your order!";
                        if (status === 'out_for_delivery') msg = "🛵 Your order is out for delivery!";
                        if (status === 'delivered') msg = "✅ Order Delivered! Enjoy your meal!";
                        
                        if (typeof Notification !== 'undefined' && Notification.permission === "granted") {
                            const title = "Dosa House";
                            const options = {
                                body: msg,
                                icon: "assets/images/logo_dosa_house.png"
                            };
                            if ('serviceWorker' in navigator) {
                                navigator.serviceWorker.ready.then(reg => {
                                    reg.showNotification(title, options);
                                });
                            } else {
                                new Notification(title, options);
                            }
                        } else {
                            if(window.showToast) window.showToast(msg, 'success');
                        }
                    }
                });
            });
        }
    } else {
        // Guest — hide profile, show login button
        if (profileWrap) profileWrap.style.display = 'none';
        if (loginWrap) loginWrap.style.display = 'block';
        
        const mProfile = document.querySelector('.mobile-profile-link');
        const mLogin = document.querySelector('.mobile-login-link');
        if (mProfile) mProfile.style.display = 'none';
        if (mLogin) mLogin.style.display = 'block';
    }
    return user; // caller can check if user is null to guard actions
}

// requireLogin — show a friendly modal instead of hard redirect
// Call this when guest tries to perform an action that needs login
function requireLogin(message) {
    message = message || 'Please sign in to continue.';
    // Check if modal already exists
    let modal = document.getElementById('__login-gate-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = '__login-gate-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;padding:1rem;font-family:Outfit,sans-serif;';
        modal.innerHTML = `
            <div style="background:white;border-radius:20px;padding:2rem;max-width:380px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
                <div style="font-size:2.5rem;margin-bottom:0.5rem;">🔐</div>
                <h2 style="color:#3E2723;margin-bottom:0.5rem;font-size:1.4rem;">Sign In Required</h2>
                <p style="color:#795548;margin-bottom:1.5rem;font-size:0.95rem;" id="__login-gate-msg">${message}</p>
                <div style="display:flex;gap:0.75rem;">
                    <button onclick="document.getElementById('__login-gate-modal').remove()" style="flex:1;padding:0.8rem;border:2px solid #eee;background:white;border-radius:12px;font-weight:600;cursor:pointer;font-family:inherit;color:#555;">Cancel</button>
                    <button onclick="window.location.href='login.html'" style="flex:1;padding:0.8rem;background:#F57F17;color:white;border:none;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;">Sign In →</button>
                </div>
            </div>`;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    } else {
        document.getElementById('__login-gate-msg').textContent = message;
        modal.style.display = 'flex';
    }
}
