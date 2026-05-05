// ============================================================
// Dosa House — Firebase Configuration
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyA2YgwL5A45L74lIaE63kysVnwck4Si-CM",
    authDomain: "dosa-house-7bd70.web.app",
    projectId: "dosa-house-7bd70",
    storageBucket: "dosa-house-7bd70.firebasestorage.app",
    messagingSenderId: "54232177389",
    appId: "1:54232177389:web:21803e7a94fe956d588ae4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Global references used across all pages
const db = firebase.firestore();
const auth = firebase.auth();

// Staff emails → roles mapping (used to assign roles on first login)
const STAFF_ROLES = {
    'admin@dosahouse.com': 'admin',
    'kitchen@dosahouse.com': 'kitchen',
    'delivery@dosahouse.com': 'delivery'
};
