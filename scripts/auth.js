// ============================================================
// Dosa House — Auth Helper (included on every page)
// ============================================================

// Get current logged-in user + their role from Firestore
function getCurrentUser() {
    return new Promise((resolve) => {
        auth.onAuthStateChanged(async (user) => {
            if (!user) { resolve(null); return; }

            try {
                const userDoc = await db.collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                    resolve({ uid: user.uid, email: user.email, name: user.displayName || userDoc.data().name, ...userDoc.data() });
                } else {
                    // First time login — create user document
                    const role = STAFF_ROLES[user.email] || 'customer';
                    const userData = {
                        name: user.displayName || user.email.split('@')[0],
                        email: user.email,
                        role: role,
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

// Require login. Redirect if not logged in or wrong role.
async function requireAuth(allowedRoles) {
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect based on actual role
        const redirectMap = { admin: 'admin.html', kitchen: 'kitchen.html', delivery: 'delivery.html', customer: 'index.html' };
        window.location.href = redirectMap[user.role] || 'index.html';
        return null;
    }
    return user;
}

// Logout
async function logoutUser() {
    await auth.signOut();
    window.location.href = 'login.html';
}
