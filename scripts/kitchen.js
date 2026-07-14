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
    // Removed orderBy to avoid composite index requirement
    unsubscribe = db.collection('orders')
        .where('status', 'in', ['accepted', 'preparing'])
        .onSnapshot(snapshot => {
            let orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort client-side by createdAt (asc = oldest first)
            orders.sort((a, b) => {
                const ta = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
                const tb = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
                return ta - tb;
            });
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
        actionBtn = `<button class="btn-action btn-ready" onclick="markReady('${order.id}', '${order.orderType}')">✅ Mark Finished</button>`;
    }

    const statusBadge = order.status === 'accepted'
        ? `<span style="background:#E65100;color:white;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.75rem;font-weight:700;">NEW</span>`
        : `<span style="background:#1565C0;color:white;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.75rem;font-weight:700;">COOKING</span>`;

    let ticketTypeStr = '🛵 Delivery';
    if (order.orderType === 'takeaway') ticketTypeStr = '🛍️ Takeaway';
    if (order.orderType === 'dine_in') ticketTypeStr = `🪑 Dine In - Table ${order.tableNumber || ''}`;

    return `
        <div class="ticket ticket-${order.status}">
            <div class="ticket-header">
                <span class="ticket-id">${order.orderId || order.id}</span>
                <span class="ticket-time">${time}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
                <div class="ticket-type">${ticketTypeStr}</div>
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

async function markReady(orderId, orderType) {
    try {
        await db.collection('orders').doc(orderId).update({
            status: orderType === 'dine_in' ? 'served' : 'packaging',
            readyAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (e) {
        console.error('Error updating status:', e);
        alert('Error! Try again.');
    }
}

let todayCompletedOrders = [];
let statsListenerSet = false;

function updateKitchenStats() {
    if (statsListenerSet) return;
    statsListenerSet = true;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Fetch all orders created today to avoid composite index requirements
    db.collection('orders')
        .where('createdAt', '>=', startOfDay)
        .onSnapshot(snap => {
            const completedStatuses = ['packaging', 'sent_to_delivery', 'out_for_delivery', 'delivered', 'served'];
            todayCompletedOrders = snap.docs
                .map(d => d.data())
                .filter(o => completedStatuses.includes(o.status));
            
            document.getElementById('count-completed').textContent = todayCompletedOrders.length;
        });
}

window.openKitchenSummary = function() {
    const modal = document.getElementById('summary-modal');
    const content = document.getElementById('summary-content');
    
    if (todayCompletedOrders.length === 0) {
        content.innerHTML = '<p style="color:#aaa;">No orders completed today yet.</p>';
        modal.style.display = 'flex';
        return;
    }

    const itemCounts = {};
    todayCompletedOrders.forEach(order => {
        if (order.items) {
            order.items.forEach(item => {
                if (!itemCounts[item.title]) itemCounts[item.title] = 0;
                itemCounts[item.title] += (item.quantity || 1);
            });
        }
    });

    let html = `
        <div style="display:flex; justify-content:space-between; margin-bottom:1rem; font-size:1.2rem;">
            <span>Total Orders:</span>
            <span style="font-weight:bold; color:#F57F17;">${todayCompletedOrders.length}</span>
        </div>
        <h3 style="color:#aaa; border-bottom:1px solid #333; padding-bottom:0.5rem; margin-bottom:1rem;">Items Cooked Today</h3>
        <ul style="list-style:none; padding:0; margin:0;">
    `;

    Object.entries(itemCounts)
        .sort((a, b) => b[1] - a[1]) // Sort by quantity (highest first)
        .forEach(([title, qty]) => {
            html += `
                <li style="display:flex; justify-content:space-between; padding:0.6rem 0; border-bottom:1px solid #222;">
                    <span style="font-size:1.05rem;">${title}</span>
                    <span style="background:#333; color:#4CAF50; padding:0.2rem 0.8rem; border-radius:6px; font-weight:800;">${qty}x</span>
                </li>
            `;
        });
    
    html += `</ul>`;
    content.innerHTML = html;
    modal.style.display = 'flex';
}
