/**
 * Dosa House - Native Push Notifications
 * Meal-time based random fun Telugu/English quotes!
 */

const NOTIFICATIONS_CONFIG = {
    // 9 AM - Breakfast
    9: [
        "Good morning mowa! 🌞 Ochi oka vedi vedi Ghee Roast tinu!",
        "Tiffin tinnava kanna? 🥺 Mana Dosa House lo Upma Pesarattu waiting!",
        "Morning breakfast manchiga tinte day antha super untundi! Order idly 😋"
    ],
    // 12 PM - Early Lunch / Cravings
    12: [
        "Cravings started? 🤤 It's time for a crispy Masala Dosa!",
        "Podduna tinnadi arigipoyinda? Come let's have a meal! 🍛",
        "Arey mowa, lunch time aindhi. Order petteseyi!"
    ],
    // 1 PM - Lunch Time
    13: [
        "Kanna ontariga unnava? 🥺 Ee time lo evaru vachina raakapoina, mana Masala Dosa untundi!",
        "Lunch time vachesindi! Pulihora tintava ledha Paneer Dosa tintava? 😉",
        "Friends tho unnava? Appudu Dosa House ye correct spot! Book a table."
    ],
    // 4 PM - Evening Snacks
    16: [
        "Thirsty? 🥵 Drink chill chill Badam Milk!",
        "Evening snacks ki em tintav? Onion Pakoda and Filter Coffee order cheddama? ☕",
        "Bayata varsham paduthunte... vedi vedi bajji or punugulu aithe 🤌"
    ],
    // 6 PM - Dinner Pre-Cravings
    18: [
        "Alisipoyava work chesi? Oka manchi Dosa to refresh avvu! 🤩",
        "Dinner em plan chesav mowa? Dosa House open aindhi ga! 🛖"
    ],
    // 8 PM - Prime Dinner
    20: [
        "Night ayyindi... manchi Butter Masala Dosa kotteddhama? 🧈",
        "Family tho dinner plan ah? Fast ga Dosa House lo table book chey! 👨‍👩‍👧‍👦",
        "Kanna, eeroju night emaina special order chesko! You deserve it."
    ],
    // 9 PM - Late Dinner
    21: [
        "Inka tinaleda? Memu unnam ga! Order now and get it hot! 🔥",
        "Nidra ravadam leda? Leka aakali vesthunda? 🤔 Order Dosa!"
    ],
    // 12 AM - Midnight
    0: [
        "Diet repati nundi le mowa! 🤫 Evala Oka Butter Dosa esko!",
        "Mid-night cravings? 🤤 Swiggy/Zomato lo mana Dosa House vethuku!"
    ]
};

// State to track if we already sent a notification for a specific hour today
const LAST_NOTIFIED_KEY = 'dosaHouse_lastNotified';

function requestNotificationPermission() {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "default") {
        setTimeout(() => {
            Notification.requestPermission();
        }, 3000); // Wait 3 seconds before asking
    }
}

function checkAndSendNotification() {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentDate = now.toDateString();
    
    // Check if we have dialogues for this hour
    if (NOTIFICATIONS_CONFIG[currentHour]) {
        try {
            const lastData = JSON.parse(localStorage.getItem(LAST_NOTIFIED_KEY) || '{}');
            
            // If we haven't notified for this specific hour today
            if (lastData.date !== currentDate || lastData.hour !== currentHour) {
                
                // Pick a random dialogue for this hour
                const dialogues = NOTIFICATIONS_CONFIG[currentHour];
                const randomMsg = dialogues[Math.floor(Math.random() * dialogues.length)];
                
                // Send the Native Notification
                new Notification("Dosa House 🛖", {
                    body: randomMsg,
                    icon: "assets/images/logo_dosa_house.png",
                    badge: "assets/images/logo_dosa_house.png",
                    vibrate: [200, 100, 200]
                });
                
                // Save state so we don't spam them again in this hour
                localStorage.setItem(LAST_NOTIFIED_KEY, JSON.stringify({
                    date: currentDate,
                    hour: currentHour
                }));
            }
        } catch (e) {
            console.error("Error in push notification logic:", e);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Only run if not on login/admin pages to avoid annoying staff
    const path = window.location.pathname;
    if (!path.includes('admin') && !path.includes('login') && !path.includes('kitchen') && !path.includes('delivery')) {
        requestNotificationPermission();
        
        // Check immediately on load
        checkAndSendNotification();
        
        // Then check every minute
        setInterval(checkAndSendNotification, 60000);
    }
});
