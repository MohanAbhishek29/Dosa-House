// scripts/booking.js

// scripts/booking.js

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('booking-form');
    const successMsg = document.getElementById('booking-success');
    const tableGrid = document.getElementById('table-grid');
    const selectedTableInput = document.getElementById('selected-table-id');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const tableMapContainer = document.getElementById('table-map-container');

    // Configuration: 10 Tables with Zones and Shapes
    const tables = [
        // Window Seats (Left Col) - Round, 2 Seater
        { id: 'T1', label: '1', seats: 2, type: 'round', zone: 'window' },
        { id: 'T2', label: '2', seats: 2, type: 'round', zone: 'window' },
        { id: 'T3', label: '3', seats: 2, type: 'round', zone: 'window' },

        // Center Family Tables (Middle Col) - Rect, 4 Seater
        { id: 'T4', label: '4', seats: 4, type: 'rect-4', zone: 'center' },
        { id: 'T5', label: '5', seats: 4, type: 'rect-4', zone: 'center' },
        { id: 'T6', label: '6', seats: 4, type: 'rect-4', zone: 'center' },
        { id: 'T7', label: '7', seats: 6, type: 'rect-6', zone: 'center' }, // Large family

        // Quiet Corner (Right Col) - Rect, 4 Seater
        { id: 'T8', label: '8', seats: 4, type: 'rect-4', zone: 'quiet' },
        { id: 'T9', label: '9', seats: 4, type: 'rect-4', zone: 'quiet' },
        { id: 'T10', label: '10', seats: 2, type: 'round', zone: 'quiet' },
    ];

    if (bookingForm) {
        // Set Default Date
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
            dateInput.min = today;

            // Default Time if empty
            if (!timeInput.value) timeInput.value = "19:00";
        }

        // Render Tables Initial
        renderTables();

        // Re-render on Date/Time change to show availability
        dateInput.addEventListener('change', renderTables);
        timeInput.addEventListener('change', renderTables);

        // Form Submission
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const tableId = selectedTableInput.value;
            if (!tableId) {
                alert("Please select a table from the map! 🪑");
                tableMapContainer.classList.add('error');
                setTimeout(() => tableMapContainer.classList.remove('error'), 500);
                return;
            }

            // 1. Gather Data
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const date = dateInput.value;
            const time = timeInput.value;
            const guests = document.getElementById('guests').value;

            const booking = {
                id: '#BK-' + Math.floor(1000 + Math.random() * 9000),
                name,
                phone,
                date,
                time,
                guests,
                tableId,
                status: 'Confirmed'
            };

            // 2. Save
            if (saveBooking(booking)) {
                // 3. Success
                bookingForm.style.display = 'none';
                successMsg.style.display = 'block';

                // 4. Redirect
                setTimeout(() => {
                    window.location.href = 'orders.html';
                }, 3000);
            } else {
                alert("Sorry! This table was just booked. Please select another.");
                renderTables();
            }
        });
    }

    function renderTables() {
        if (!tableGrid) return;

        const selectedDate = dateInput.value;
        const selectedTime = timeInput.value;
        const bookedTables = getBookedTables(selectedDate, selectedTime);
        const currentSelection = selectedTableInput.value;

        // Reset Grid layout helpers
        tableGrid.innerHTML = `
            <div class="floor-col" id="col-window"></div>
            <div class="floor-col" id="col-center"></div>
            <div class="floor-col" id="col-quiet"></div>
        `;

        const colWindow = document.getElementById('col-window');
        const colCenter = document.getElementById('col-center');
        const colQuiet = document.getElementById('col-quiet');

        tables.forEach(table => {
            const isBooked = bookedTables.includes(table.id);
            const isSelected = table.id === currentSelection;

            const el = document.createElement('div');
            // Add shape class: table-round, table-rect-4, etc.
            el.className = `table-slot table-${table.type} ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`;
            el.title = `Table ${table.label} (${table.seats} Seats)`;
            el.innerHTML = `
                <span>${table.label}</span>
                <small style="font-size:0.7rem">${table.seats}</small>
            `;

            if (!isBooked) {
                el.onclick = () => {
                    // Deselect previous
                    document.querySelectorAll('.table-slot').forEach(t => t.classList.remove('selected'));
                    // Select new
                    el.classList.add('selected');
                    selectedTableInput.value = table.id;
                };
            }

            // Distribute to columns based on zone
            if (table.zone === 'window') colWindow.appendChild(el);
            else if (table.zone === 'center') colCenter.appendChild(el);
            else colQuiet.appendChild(el);
        });
    }

    function getBookedTables(date, time) {
        const bookings = JSON.parse(localStorage.getItem('dosaHouseBookings') || '[]');
        // Simple logic: Block if Same Date AND Time is within +/- 1 hour (assuming 1 hour slot)
        // For simplicity in this demo, we check exact Time string match or just Date match if Time is not specific enough.
        // Let's used exact match for now + Date.

        return bookings
            .filter(b => b.date === date && b.time === time) // Very strict slot
            .map(b => b.tableId);
    }

    function saveBooking(newBooking) {
        const bookings = JSON.parse(localStorage.getItem('dosaHouseBookings') || '[]');

        // Double Check Conflict
        const conflict = bookings.some(b =>
            b.date === newBooking.date &&
            b.time === newBooking.time &&
            b.tableId === newBooking.tableId
        );

        if (conflict) return false;

        bookings.unshift(newBooking);
        localStorage.setItem('dosaHouseBookings', JSON.stringify(bookings));
        return true;
    }
});
