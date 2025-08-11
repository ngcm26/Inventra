document.addEventListener('DOMContentLoaded', function() {
    // Set dashboard as active page
    localStorage.setItem('currentPage', 'dashboard');

    // Initialize widgets
    initializeSalesChart();
    renderNotifications();
    renderRecentOrders();
});

function initializeSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Sales',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                borderColor: '#3F7AB0',
                backgroundColor: 'rgba(63, 122, 176, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e2e8f0'
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                x: {
                    grid: {
                        color: '#e2e8f0'
                    },
                    ticks: {
                        color: '#64748b'
                    }
                }
            }
        }
    });
}

function renderNotifications() {
    const container = document.getElementById('dashboard-notifications-list');
    if (!container) return;

    // Pull subjects from the rich inbox dataset on the Inbox page when available.
    // Fallback to AppData if needed.
    const inboxEmails = window.InboxPage?.getEmails ? window.InboxPage.getEmails() : null;
    const baseMessages = Array.isArray(inboxEmails) && inboxEmails.length > 0
        ? inboxEmails.map(e => ({ id: e.id, subject: e.subject, category: e.aiType || 'info', receivedAt: e.date }))
        : (window.AppData?.inboxMessages || []);

    const messages = baseMessages.filter(msg => {
        const when = new Date(msg.receivedAt);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 2); // last 1-2 days
        return when >= cutoff;
    }).sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)).slice(0, 5);

    if (messages.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><h3>No recent notifications</h3><p>Nothing new in the last 2 days.</p></div>';
        return;
    }

    const colorByCategory = {
        delay: 'red',
        quality: 'orange',
        delivery: 'green',
        order: 'blue',
        quote: 'blue',
        info: 'blue'
    };

    container.innerHTML = '';
    messages.forEach(msg => {
        const item = document.createElement('div');
        item.className = 'notification-item';
        const categoryKey = msg.category || 'info';
        item.innerHTML = `
            <div class="notification-content">
                <div class="notification-title-row">
                    <h4 title="${escapeHtml(msg.subject)}">${escapeHtml(msg.subject)}</h4>
                    <span class="ai-label ${categoryKey}">
                        <i class="fas fa-${getAIIcon(categoryKey)}"></i>
                        ${getAILabel(categoryKey)}
                    </span>
                </div>
            </div>
        `;
        item.addEventListener('click', () => {
            try { localStorage.setItem('currentPage', 'inbox'); } catch (_) {}
            window.location.href = `inbox.html?from=dashboard&msg=${encodeURIComponent(msg.id)}`;
        });
        container.appendChild(item);
    });
}

function renderRecentOrders() {
    const tbody = document.getElementById('dashboard-orders-tbody');
    if (!tbody) return;

    const orders = (window.AppData?.orders || []).filter(order => {
        const created = new Date(order.createdAt);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7); // last week
        return created >= cutoff;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No recent orders</h3>
                    <p>No orders in the last week.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = '';
    orders.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="order-id">${order.id}</span></td>
            <td>${escapeHtml(order.customer)}</td>
            <td>${formatShortDate(order.createdAt)}</td>
            <td>${order.items?.length || 0}</td>
            <td><span class="total-amount">$${(order.total || 0).toFixed(2)}</span></td>
            <td><span class="status-pill status-${order.status}">${formatStatus(order.status)}</span></td>
            <td>${formatSource(order.source)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
}

function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
}

function formatShortDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatStatus(status) {
    const statusMap = { new: 'New', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled', packed: 'Packed' };
    return statusMap[status] || status;
}

function formatSource(source) {
    const sourceMap = { web: 'Website', email: 'Email', phone: 'Phone', manual: 'Manual', api: 'API' };
    return sourceMap[source] || source;
}

function formatCategoryLabel(category) {
    const map = {
        quote: { key: 'quote', text: 'quote needed' },
        order: { key: 'order', text: 'incoming order' },
        delay: { key: 'delay', text: 'delay detected' },
        delivery: { key: 'delivery', text: 'delivery' },
        quality: { key: 'quality', text: 'quality alert' },
        info: { key: 'info', text: 'info' }
    };
    return map[category] || { key: 'info', text: 'Info' };
}

// Match inbox page icon mapping for AI labels
function getAIIcon(aiType) {
    const icons = {
        delay: 'clock',
        delivery: 'truck',
        quality: 'exclamation-triangle',
        order: 'shopping-cart',
        quote: 'file-invoice',
        info: 'info-circle'
    };
    return icons[aiType] || 'info-circle';
}

// Match inbox page label text mapping
function getAILabel(aiType) {
    const labels = {
        delay: 'DELAY DETECTED',
        delivery: 'DELIVERY CONFIRMED',
        quality: 'QUALITY ALERT',
        order: 'PURCHASE ORDER',
        quote: 'QUOTE REQUEST',
        info: 'GENERAL INFO'
    };
    return labels[aiType] || 'UNCATEGORIZED';
}
