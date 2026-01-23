// scripts/orders.js

document.addEventListener('DOMContentLoaded', () => {
    const ordersListEl = document.getElementById('orders-list');
    const tabs = document.querySelectorAll('.tab-btn');
    let currentTab = 'active';

    // 1. Load Orders
    let orders = JSON.parse(localStorage.getItem('dosaHouseOrders') || '[]');

    // 2. Simulate Status Updates (Mock Backend)
    function updateOrderStatuses() {
        let hasUpdates = false;
        const now = new Date();
        // Reload orders from storage to catch new ones
        orders = JSON.parse(localStorage.getItem('dosaHouseOrders') || '[]');

        orders = orders.map(order => {
            const orderTime = new Date(order.date);
            const diffSeconds = (now - orderTime) / 1000;

            if (order.status === 'Pending' && diffSeconds > 10) {
                order.status = 'Preparing';
                hasUpdates = true;
            } else if (order.status === 'Preparing' && diffSeconds > 30) {
                order.status = 'Delivered';
                hasUpdates = true;
            }
            return order;
        });

        if (hasUpdates) {
            localStorage.setItem('dosaHouseOrders', JSON.stringify(orders));
        }
    }

    // Initial check
    updateOrderStatuses();

    // 3. Render Function
    function renderOrders() {
        // Reload orders to ensure we render the latest state (including status updates)
        orders = JSON.parse(localStorage.getItem('dosaHouseOrders') || '[]');

        if (orders.length === 0) {
            ordersListEl.innerHTML = `
                <div class="empty-orders">
                    <h3>No orders found 🍛</h3>
                    <p>Go to the <a href="menu.html">Menu</a> to place your first order!</p>
                </div>
            `;
            return;
        }

        const filteredOrders = orders.filter(order => {
            if (currentTab === 'active') {
                return order.status !== 'Delivered';
            } else {
                return order.status === 'Delivered';
            }
        });

        if (filteredOrders.length === 0) {
            ordersListEl.innerHTML = `
                <div class="empty-orders">
                    <p>No ${currentTab} orders.</p>
                </div>
            `;
            return;
        }

        ordersListEl.innerHTML = filteredOrders.map(order => {
            const dateObj = new Date(order.date);
            const formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let statusClass = 'status-pending';
            if (order.status === 'Preparing') statusClass = 'status-preparing';
            if (order.status === 'Delivered') statusClass = 'status-delivered';

            return `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <div class="order-id">${order.id}</div>
                            <div style="font-size:0.85rem; color:#888;">${formattedDate} • ${order.mode}</div>
                        </div>
                        <div class="order-status ${statusClass}">${order.status}</div>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item-row">
                                <span>${item.qty}x ${item.title}</span>
                                <span>₹${item.price * item.qty}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-footer">
                        <span>Total Paid</span>
                        <span style="font-size: 1.2rem; color: var(--color-text-primary);">₹${order.total}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 4. Tab Logic
    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            tabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.dataset.tab;
            renderOrders();
        });
    });

    // Initial Render
    renderOrders();

    // Auto-refresh for status updates every 5 seconds
    setInterval(() => {
        updateOrderStatuses();
        renderOrders();
    }, 5000); // Check more frequently (5s) for smoother updates
});

    // 5. Clear History Logic (For Demo/Testing)
    const clearBtn = document.getElementById('clear-history-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your order history?')) {
                localStorage.removeItem('dosaHouseOrders');
                renderOrders();
                alert('History Cleared!');
            }
        });
    }
