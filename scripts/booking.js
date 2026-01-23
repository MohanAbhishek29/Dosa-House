// scripts/booking.js

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('booking-form');
    const successMsg = document.getElementById('booking-success');

    if (bookingForm) {
        // Set Default Date to Today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
            dateInput.min = today;
        }

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Gather Data
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value;

            const booking = {
                id: '#BK-' + Math.floor(1000 + Math.random() * 9000),
                name,
                phone,
                date,
                time,
                guests,
                status: 'Confirmed'
            };

            // 2. Save to LocalStorage
            saveBooking(booking);

            // 3. Show Success
            bookingForm.style.display = 'none';
            successMsg.style.display = 'block';

            // 4. Redirect
            setTimeout(() => {
                window.location.href = 'orders.html';
            }, 3000);
        });
    }

    function saveBooking(booking) {
        const existingBookings = JSON.parse(localStorage.getItem('dosaHouseBookings') || '[]');
        existingBookings.unshift(booking);
        localStorage.setItem('dosaHouseBookings', JSON.stringify(existingBookings));
    }
});
