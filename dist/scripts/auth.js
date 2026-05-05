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
                // Always check STAFF_ROLES first — overrides any Firestore value
                const staffRole = user.email ? STAFF_ROLES[user.email] : null;

                const userDoc = await db.collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                    const data = userDoc.data();
                    // If staff email, always use correct role (fix old 'customer' role)
                    const role = staffRole || data.role || 'customer';
                    if (staffRole && data.role !== staffRole) {
                        // Update wrong role in Firestore silently
                        db.collection('users').doc(user.uid).update({ role: staffRole });
                    }
                    resolve({ uid: user.uid, email: user.email || data.email || null, phone: user.phoneNumber || data.phone || null, name: user.displayName || data.name || 'Customer', ...data, role });
                } else {
                    const role = staffRole || 'customer';
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
                alert('Database Error: ' + e.message + '\n\nPlease check your Firebase Firestore Security Rules (Test Mode might have expired).');
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
