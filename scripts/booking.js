// scripts/booking.js

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('booking-form');
    const successMsg = document.getElementById('booking-success');
    const tableGrid = document.getElementById('table-grid');
    const selectedTableInput = document.getElementById('selected-table-id');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const tableMapContainer = document.getElementById('table-map-container');

    let currentUserId = 'guest_' + Math.floor(Math.random() * 100000);
    let _isGuest = true;
    if (typeof auth !== 'undefined') {
        auth.onAuthStateChanged(user => {
            if (user) {
                currentUserId = user.uid;
                _isGuest = false;
                renderTables(); // Re-render if locks change on auth
            } else {
                currentUserId = 'guest_' + Math.floor(Math.random() * 100000);
                _isGuest = true;
            }
        });
    }

    // Configuration: 10 Tables
    const tables = [
        { id: 'T1', label: '1', seats: 2, type: 'round', zone: 'window' },
        { id: 'T2', label: '2', seats: 2, type: 'round', zone: 'window' },
        { id: 'T3', label: '3', seats: 2, type: 'round', zone: 'window' },
        { id: 'T4', label: '4', seats: 4, type: 'rect-4', zone: 'center' },
        { id: 'T5', label: '5', seats: 4, type: 'rect-4', zone: 'center' },
        { id: 'T6', label: '6', seats: 4, type: 'rect-4', zone: 'center' },
        { id: 'T7', label: '7', seats: 6, type: 'rect-6', zone: 'center' },
        { id: 'T8', label: '8', seats: 4, type: 'rect-4', zone: 'quiet' },
        { id: 'T9', label: '9', seats: 4, type: 'rect-4', zone: 'quiet' },
        { id: 'T10', label: '10', seats: 2, type: 'round', zone: 'quiet' },
    ];

    let liveBookings = [];
    let liveLocks = [];
    let unsubBookings = null;
    let unsubLocks = null;

    window.addEventListener('beforeunload', () => {
        if (!_isGuest && typeof db !== 'undefined') {
            db.collection('tableLocks').doc(currentUserId).delete().catch(() => {});
        }
    });

    if (bookingForm) {
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
            dateInput.min = today;
            if (!timeInput.value) timeInput.value = "19:00";
        }

        renderTables(); // Initial render to show empty tables instantly
        setTimeout(setupRealtime, 1000); // delay to let firebase load

        dateInput.addEventListener('change', setupRealtime);
        timeInput.addEventListener('change', setupRealtime);

        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const tableId = selectedTableInput.value;
            if (!tableId) {
                showToast("Please select a table from the map! \ud83e\ude91", "error");
                tableMapContainer.classList.add('error');
                setTimeout(() => tableMapContainer.classList.remove('error'), 500);
                return;
            }

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const date = dateInput.value;
            const time = timeInput.value;
            const guests = document.getElementById('guests').value;

            const bookingId = '#BK-' + Math.floor(1000 + Math.random() * 9000);
            const booking = {
                id: bookingId, name, phone, date, time, guests, tableId,
                status: 'Confirmed', userId: currentUserId,
                createdAt: typeof firebase !== 'undefined' ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
            };

            const btn = bookingForm.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Confirming...';

            const success = await saveBooking(booking);
            
            if (success) {
                if (!_isGuest && typeof db !== 'undefined') {
                    db.collection('tableLocks').doc(currentUserId).delete().catch(() => {});
                }
                bookingForm.style.display = 'none';
                successMsg.style.display = 'block';
                if (window.showToast) window.showToast("Table Booked Successfully! \ud83c\udf89", "success");
                setTimeout(() => window.location.href = 'orders.html', 3000);
            } else {
                showToast("Sorry! This table was just booked by someone else.", "error");
                btn.disabled = false;
                btn.textContent = 'Confirm Booking';
                renderTables();
            }
        });
    }

    function setupRealtime() {
        const date = dateInput.value;
        if (typeof db === 'undefined') {
            liveBookings = JSON.parse(localStorage.getItem('dosaHouseBookings') || '[]').filter(b => b.date === date);
            renderTables();
            return;
        }

        if (unsubBookings) unsubBookings();
        if (unsubLocks) unsubLocks();

        unsubBookings = db.collection('bookings')
            .where('date', '==', date)
            .onSnapshot(snap => {
                liveBookings = snap.docs.map(d => d.data());
                renderTables();
            });

        unsubLocks = db.collection('tableLocks')
            .where('date', '==', date)
            .onSnapshot(snap => {
                liveLocks = snap.docs.map(d => d.data());
                renderTables();
            });
    }

    function timeToMins(t) {
        if(!t) return 0;
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    }

    function renderTables() {
        if (!tableGrid) return;
        const selectedDate = dateInput.value;
        const selectedTime = timeInput.value;
        const selMins = timeToMins(selectedTime);
        const currentSelection = selectedTableInput.value;
        const now = Date.now();

        const bookedTables = liveBookings.filter(b => {
            const bMins = timeToMins(b.time);
            return Math.abs(bMins - selMins) < 60;
        }).map(b => b.tableId);

        const lockedTables = liveLocks.filter(l => {
            const lMins = timeToMins(l.time);
            const isOverlap = Math.abs(lMins - selMins) < 60;
            const isLockActive = l.lockedUntil > now;
            const isDifferentUser = l.lockedBy !== currentUserId;
            return isOverlap && isLockActive && isDifferentUser;
        }).map(l => l.tableId);

        tableGrid.innerHTML = `
            <div class="floor-col" id="col-window"></div>
            <div class="floor-col" id="col-center"></div>
            <div class="floor-col" id="col-quiet"></div>
        `;

        const cols = {
            window: document.getElementById('col-window'),
            center: document.getElementById('col-center'),
            quiet: document.getElementById('col-quiet')
        };

        tables.forEach(table => {
            const isBooked = bookedTables.includes(table.id);
            const isLocked = !isBooked && lockedTables.includes(table.id);
            const isSelected = table.id === currentSelection;

            const el = document.createElement('div');
            let stateClass = '';
            if(isBooked) stateClass = 'booked';
            else if(isLocked) stateClass = 'locked';
            else if(isSelected) stateClass = 'selected';
            
            el.className = `table-slot table-${table.type} ${stateClass}`;
            el.title = `Table ${table.label} (${table.seats} Seats)`;
            el.innerHTML = `<span>${table.label}</span><small style="font-size:0.7rem">${table.seats}</small>`;

            if (!isBooked && !isLocked) {
                el.onclick = () => {
                    document.querySelectorAll('.table-slot').forEach(t => t.classList.remove('selected'));
                    el.classList.add('selected');
                    selectedTableInput.value = table.id;
                    acquireLock(table.id, selectedDate, selectedTime);
                };
            }
            cols[table.zone].appendChild(el);
        });
    }

    async function acquireLock(tableId, date, time) {
        if (typeof db === 'undefined' || _isGuest) return; // Guests cannot lock tables
        const lockedUntil = Date.now() + (5 * 60 * 1000);
        
        try {
            await db.collection('tableLocks').doc(currentUserId).set({
                tableId, date, time, lockedBy: currentUserId, lockedUntil
            });
        } catch(e) {
            console.error("Failed to acquire lock:", e);
        }
    }

    async function saveBooking(newBooking) {
        if (typeof db === 'undefined') {
            const bookings = JSON.parse(localStorage.getItem('dosaHouseBookings') || '[]');
            const selMins = timeToMins(newBooking.time);
            const conflict = bookings.some(b => b.date === newBooking.date && b.tableId === newBooking.tableId && Math.abs(timeToMins(b.time) - selMins) < 60);
            if (conflict) return false;
            bookings.unshift(newBooking);
            localStorage.setItem('dosaHouseBookings', JSON.stringify(bookings));
            return true;
        }

        try {
            const docRef = db.collection('bookings').doc();
            const tableDayRef = db.collection('tableDays').doc(`${newBooking.tableId}_${newBooking.date}`);
            
            return await db.runTransaction(async (transaction) => {
                const tableDayDoc = await transaction.get(tableDayRef);
                const bookedTimes = tableDayDoc.exists ? tableDayDoc.data().bookedTimes : [];
                
                const selMins = timeToMins(newBooking.time);
                const conflict = bookedTimes.some(t => Math.abs(t - selMins) < 60);
                
                if (conflict) return false;
                
                bookedTimes.push(selMins);
                transaction.set(tableDayRef, { bookedTimes });
                transaction.set(docRef, newBooking);
                return true;
            });
        } catch(e) {
            console.error("Transaction failed: ", e);
            return false;
        }
    }

window.openMyBookings = async function() {
    if (typeof _isGuest !== 'undefined' && _isGuest) {
        if (window.requireLogin) requireLogin('Please sign in to view your bookings.');
        return;
    }
    const modal = document.getElementById('my-bookings-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    setTimeout(() => modal.style.opacity = '1', 10);
    const listEl = document.getElementById('my-bookings-list');
    listEl.innerHTML = '<p style="color:#888; text-align:center;">Loading your bookings...</p>';
    try {
        const snap = await db.collection('bookings').where('userId', '==', currentUserId).get();
        if (snap.empty) {
            listEl.innerHTML = '<p style="color:#888; text-align:center;">You have no table bookings yet.</p>';
            return;
        }
        listEl.innerHTML = '';
        let userBookings = snap.docs.map(d => d.data());
        userBookings.sort((a, b) => {
            const dA = new Date(`${a.date}T${a.time || '00:00'}`);
            const dB = new Date(`${b.date}T${b.time || '00:00'}`);
            return dB - dA;
        });
        
        userBookings.slice(0, 20).forEach(b => {
            const item = document.createElement('div');
            item.style.padding = '1rem';
            item.style.borderBottom = '1px solid #eee';
            item.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                    <strong style="color:var(--color-charcoal); font-size:1.1rem;">Table ${b.tableId.replace('T', '')}</strong>
                    <span style="background:#E8F5E9; color:#2E7D32; padding:0.2rem 0.6rem; border-radius:20px; font-size:0.8rem; font-weight:600;">${b.status}</span>
                </div>
                <div style="color:#666; font-size:0.9rem; display:flex; gap:1rem;">
                    <span>📅 ${b.date}</span>
                    <span>⏰ ${b.time}</span>
                    <span>👥 ${b.guests} Guests</span>
                </div>
            `;
            listEl.appendChild(item);
        });
    } catch(e) {
        console.error(e);
        listEl.innerHTML = '<p style="color:#d32f2f; text-align:center;">Failed to load bookings. Please try again.</p>';
    }
};

window.closeMyBookings = function() {
    const modal = document.getElementById('my-bookings-modal');
    if (!modal) return;
    modal.style.opacity = '0';
    setTimeout(() => modal.style.display = 'none', 300);
};
});
