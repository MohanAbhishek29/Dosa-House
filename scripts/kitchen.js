// Kitchen Display System Logic

// DOM Elements
const ordersGrid = document.getElementById('orders-grid');
const countPending = document.getElementById('count-pending');
const countPreparing = document.getElementById('count-preparing');
const countCompleted = document.getElementById('count-completed');
const alertSound = document.getElementById('alert-sound');

// State
let orders = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    renderBoard();
    updateStats();
});

// Listen for updates from other tabs (Customer View)
window.addEventListener('storage', (e) => {
    if (e.key === 'dosaHouseOrders') {
        const oldLen = orders.length; // Approximate check
        loadOrders();
        renderBoard();
        updateStats();

        // Simple check for new orders (length increased)
        if (orders.length > oldLen) {
            playAlert();
        }
    }
});

function loadOrders() {
    const stored = localStorage.getItem('dosaHouseOrders');
    orders = stored ? JSON.parse(stored) : [];
}

function saveOrders() {
    localStorage.setItem('dosaHouseOrders', JSON.stringify(orders));
    // Trigger storage event for other tabs to pick up status changes
    // (Note: storage event doesn't fire on the same window, which is fine)
}

function playAlert() {
    if (alertSound) {
        alertSound.currentTime = 0;
        alertSound.play().catch(e => console.log('Audio play blocked:', e));
    }
}

function updateStatus(orderId, newStatus) {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        saveOrders();
        renderBoard();
        updateStats();
    }
}

function archiveOrder(orderId) {
    // For KDS, "Clear" might mean setting to 'Delivered/Completed' and hiding, 
    // or removing from the details list but keeping in stats.
    // Let's set to 'Delivered' (if not already) and keep in array for history,
    // but maybe filter them out visually or move to separate list?
    // Current plan: Just update status to 'Delivered' which removes it from active board views typically,
    // OR just visually remove it.
    // Let's mark as 'Delivered' in data.

    updateStatus(orderId, 'Delivered');
}

function renderBoard() {
    ordersGrid.innerHTML = '';

    // Filter active orders (Pending, Preparing, Ready)
    // We hide 'Delivered' from the main board to keep it clean, or maybe show 'Ready' until cleared.
    const activeOrders = orders.filter(o =>
        ['Pending', 'Preparing', 'Ready'].includes(o.status)
    );

    if (activeOrders.length === 0) {
        ordersGrid.innerHTML = `
            <div class="empty-kitchen">
                <h2>No Active Orders</h2>
                <p>Waiting for new tickets...</p>
            </div>
        `;
        return;
    }

    // Sort: Pending first, then Preparing, then Ready. Within that, Oldest first.
    // Map status to priority value
    const priority = { 'Pending': 1, 'Preparing': 2, 'Ready': 3 };

    activeOrders.sort((a, b) => {
        // First by Status Priority
        if (priority[a.status] !== priority[b.status]) {
            return priority[a.status] - priority[b.status];
        }
        // Then by Date (Oldest first)
        return new Date(a.date) - new Date(b.date);
    });

    activeOrders.forEach(order => {
        const ticket = createTicketElement(order);
        ordersGrid.appendChild(ticket);
    });
}

function createTicketElement(order) {
    const div = document.createElement('div');
    div.className = `ticket ticket-${order.status.toLowerCase()}`;
    div.dataset.id = order.id;
    if (order.mode) div.dataset.mode = order.mode;

    // Time Formatting
    const time = new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Items List
    const itemsHtml = order.items.map(item => `<li>${item.qty}x ${item.title}</li>`).join('');

    // Action Buttons based on Status
    let actionsHtml = '';
    if (order.status === 'Pending') {
        actionsHtml = `
            <button class="btn-action btn-accept" onclick="updateStatus('${order.id}', 'Preparing')">Accept</button>
        `;
    } else if (order.status === 'Preparing') {
        actionsHtml = `
            <button class="btn-action btn-ready" onclick="updateStatus('${order.id}', 'Ready')">Mark Ready</button>
        `;
    } else if (order.status === 'Ready') {
        actionsHtml = `
            <button class="btn-action btn-clear" onclick="archiveOrder('${order.id}')">Clear</button>
        `;
    }

    div.innerHTML = `
        <div class="ticket-header">
            <span class="ticket-id">${order.id}</span>
            <span class="ticket-time">${time}</span>
        </div>
        <div class="ticket-type">${order.mode || 'Dine-in'}</div>
        <ul class="ticket-items">
            ${itemsHtml}
        </ul>
        <div class="ticket-actions">
            ${actionsHtml}
        </div>
    `;

    return div;
}

function updateStats() {
    const pending = orders.filter(o => o.status === 'Pending').length;
    const preparing = orders.filter(o => o.status === 'Preparing').length;
    // Completed today includes Ready + Delivered
    const completed = orders.filter(o => ['Ready', 'Delivered'].includes(o.status)).length;

    countPending.textContent = pending;
    countPreparing.textContent = preparing;
    countCompleted.textContent = completed;
}
