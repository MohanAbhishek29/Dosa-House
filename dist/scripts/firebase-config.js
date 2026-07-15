// ============================================================
// Dosa House — Firebase Configuration
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyA2YgwL5A45L74lIaE63kysVnwck4Si-CM",
    authDomain: "dosa-house-7bd70.firebaseapp.com",
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

// Global Restaurant State
window.restaurantStatus = {
    isEmergencyClosed: false,
    openHour: 9,
    closeHour: 23, // 11 PM
    closeMinute: 59 // 11:59 PM
};

window.isRestaurantOpen = function() {
    if (window.restaurantStatus.isEmergencyClosed) return false;
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    
    // Check if before 9 AM
    if (h < window.restaurantStatus.openHour) return false;
    
    // Check if after 11:59 PM (e.g. exactly 23:59 is open, 24:00+ doesn't exist but let's be safe)
    if (h > window.restaurantStatus.closeHour) return false;
    if (h === window.restaurantStatus.closeHour && m > window.restaurantStatus.closeMinute) return false;
    
    return true;
};

// Listen to emergency close live
db.collection('adminSettings').doc('status').onSnapshot(snap => {
    if (snap.exists) {
        window.restaurantStatus.isEmergencyClosed = snap.data().isEmergencyClosed || false;
        // Trigger a global event so UI can react instantly (e.g. blinking dot)
        window.dispatchEvent(new Event('restaurantStatusChanged'));
    }
});
