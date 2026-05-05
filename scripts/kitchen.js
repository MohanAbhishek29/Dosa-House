// Kitchen Display System — Firebase Real-time
// Flow: Admin accepts (status=accepted) → Kitchen sees → Kitchen marks ready (status=ready)

let unsubscribe = null;

// Auth check
document.addEventListener('DOMContentLoaded', async () => {
    // Quick auth check — kitchen only
    const user = await requireAuth(['kitchen']);
    if (!user) return;
    startKitchenListener();
});

function startKitchenListener() {
    const ordersGrid = document.getElementById('orders-grid');

    // Listen for orders with status: accepted OR preparing
    unsubscribe = db.collection('orders')
        .where('status', 'in', ['accepted', 'preparing'])
        .orderBy('createdAt', 'asc')
        .onSnapshot(snapshot => {
            const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderKitchenBoard(orders);
            updateKitchenStats(snapshot);
        }, err => {
            console.error('Kitchen listener error:', err);
        });
}

function renderKitchenBoard(orders) {
    const grid = document.getElementById('orders-grid');

    if (orders.length === 0) {
        grid.innerHTML = `
            <div class="empty-kitchen">
                <h2>😴 No Active Orders</h2>
                <p>Waiting for new tickets...</p>
            </div>`;
        document.getElementById('count-pending').textContent = '0';
        document.getElementById('count-preparing').textContent = '0';
        return;
    }

    const accepted = orders.filter(o => o.status === 'accepted');
    const preparing = orders.filter(o => o.status === 'preparing');

    document.getElementById('count-pending').textContent = accepted.length;
    document.getElementById('count-preparing').textContent = preparing.length;

    grid.innerHTML = orders.map(order => createTicketHTML(order)).join('');
}

function createTicketHTML(order) {
    const time = order.createdAt?.toDate
        ? order.createdAt.toDate().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        : '--:--';

    const items = (order.items || []).map(i =>
        `<li>${i.quantity}x ${i.title}</li>`
    ).join('');

    let actionBtn = '';
    if (order.status === 'accepted') {
        actionBtn = `<button class="btn-action btn-accept" onclick="startPreparing('${order.id}')">🍳 Start Preparing</button>`;
    } else if (order.status === 'preparing') {
        actionBtn = `<button class="btn-action btn-ready" onclick="markReady('${order.id}')">✅ Mark Ready</button>`;
    }

    const statusBadge = order.status === 'accepted'
        ? `<span style="background:#E65100;color:white;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.75rem;font-weight:700;">NEW</span>`
        : `<span style="background:#1565C0;color:white;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.75rem;font-weight:700;">COOKING</span>`;

    return `
        <div class="ticket ticket-${order.status}">
            <div class="ticket-header">
                <span class="ticket-id">${order.orderId || order.id}</span>
                <span class="ticket-time">${time}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
                <div class="ticket-type">${order.orderType === 'takeaway' ? '🛍️ Takeaway' : '🛵 Delivery'}</div>
                ${statusBadge}
            </div>
            <div style="font-size:0.85rem;color:#aaa;margin-bottom:0.5rem;">👤 ${order.customerName || 'Customer'}</div>
            <ul class="ticket-items">${items}</ul>
            <div class="ticket-actions">${actionBtn}</div>
        </div>
    `;
}

async function startPreparing(orderId) {
    try {
        await db.collection('orders').doc(orderId).update({
            status: 'preparing',
            preparingAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (e) {
        console.error('Error updating status:', e);
        alert('Error! Try again.');
    }
}

async function markReady(orderId) {
    try {
        await db.collection('orders').doc(orderId).update({
            status: 'packaging',
            readyAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (e) {
        console.error('Error updating status:', e);
        alert('Error! Try again.');
    }
}

function updateKitchenStats(snapshot) {
    // Count completed today (delivered orders — shown separately)
    db.collection('orders')
        .where('status', '==', 'delivered')
        .get()
        .then(snap => {
            document.getElementById('count-completed').textContent = snap.size;
        });
}
