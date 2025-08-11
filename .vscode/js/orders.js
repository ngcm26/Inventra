document.addEventListener('DOMContentLoaded', function() {
    // Set orders as active page for navbar
    localStorage.setItem('currentPage', 'orders');

    // Use shared data if available
    const allOrders = Array.isArray(window.AppData?.orders) ? [...window.AppData.orders] : [];
    // Sort newest first
    allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    let currentPage = 1;
    const pageSize = 10;
    let filtered = [...allOrders];

    // Initialize page
    init();

    function init() {
        renderStats(filtered);
        renderOrders(paginate(filtered, currentPage, pageSize));
        renderPagination(filtered.length, currentPage, pageSize);
        setupEventListeners();
        checkForHighlightedOrder();
    }

    function paginate(list, page, size) {
        const start = (page - 1) * size;
        return list.slice(start, start + size);
    }

    function renderOrders(ordersToRender) {
        const tbody = document.getElementById('orders-tbody');

        if (!ordersToRender || ordersToRender.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>No orders found</h3>
                        <p>No orders match your search criteria.</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = '';
        ordersToRender.forEach(order => {
            const tr = document.createElement('tr');
            tr.dataset.orderId = order.id;

            tr.innerHTML = `
                <td><span class="order-id">${order.id}</span></td>
                <td>${escapeHtml(order.customer)}</td>
                <td>${formatDate(order.createdAt)}</td>
                <td>${order.items?.length || 0}</td>
                <td><span class="total-amount">$${(order.total || 0).toFixed(2)}</span></td>
                <td><span class="status-pill status-${order.status}">${formatStatus(order.status)}</span></td>
                <td>${formatSource(order.source)}</td>
                <td>
                    <a class="btn btn-ghost" href="create-order.html#${order.id}" title="Edit Order">
                        <i class="fa-solid fa-pen"></i> Edit
                    </a>
                </td>
            `;

            tbody.appendChild(tr);
        });
    }

    function renderPagination(totalItems, page, size) {
        const totalPages = Math.max(1, Math.ceil(totalItems / size));
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const numbers = document.getElementById('page-numbers');

        if (!prevBtn || !nextBtn || !numbers) return;

        prevBtn.disabled = page <= 1;
        nextBtn.disabled = page >= totalPages;

        numbers.innerHTML = '';
        const maxPagesToShow = 10; // pretend 1..10
        const startPage = 1;
        const endPage = Math.min(totalPages, maxPagesToShow);
        for (let p = startPage; p <= endPage; p++) {
            const btn = document.createElement('button');
            btn.className = `page-number ${p === page ? 'active' : ''}`;
            btn.textContent = String(p);
            btn.addEventListener('click', () => {
                currentPage = p;
                renderOrders(paginate(filtered, currentPage, pageSize));
                renderPagination(filtered.length, currentPage, pageSize);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            numbers.appendChild(btn);
        }

        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderOrders(paginate(filtered, currentPage, pageSize));
                renderPagination(filtered.length, currentPage, pageSize);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderOrders(paginate(filtered, currentPage, pageSize));
                renderPagination(filtered.length, currentPage, pageSize);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };
    }

    function renderStats(list) {
        const totalOrdersEl = document.getElementById('stat-total-orders');
        if (!totalOrdersEl) return;
        const revenueEl = document.getElementById('stat-revenue');
        const counters = {
            new: document.getElementById('stat-new'),
            processing: document.getElementById('stat-processing'),
            shipped: document.getElementById('stat-shipped'),
            delivered: document.getElementById('stat-delivered'),
            cancelled: document.getElementById('stat-cancelled')
        };

        const last30 = list.filter(o => {
            const d = new Date(o.createdAt);
            const cut = new Date();
            cut.setDate(cut.getDate() - 30);
            return d >= cut;
        });
        totalOrdersEl.textContent = String(last30.length);
        revenueEl.textContent = '$' + last30.reduce((s, o) => s + (o.total || 0), 0).toFixed(2);
        Object.keys(counters).forEach(k => {
            if (counters[k]) counters[k].textContent = String(last30.filter(o => o.status === k).length);
        });
    }

    function setupEventListeners() {
        // New Order button
        const newOrderBtn = document.getElementById('new-order');
        if (newOrderBtn) {
            newOrderBtn.addEventListener('click', function() {
                window.location.href = 'create-order.html';
            });
        }

        // Search functionality
        const searchInput = document.getElementById('search-orders');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase().trim();
                filterOrders(searchTerm);
            });
        }
    }

    function filterOrders(searchTerm) {
        if (!searchTerm) {
            filtered = [...allOrders];
        } else {
            filtered = allOrders.filter(order => 
                order.id.toLowerCase().includes(searchTerm) ||
                order.customer.toLowerCase().includes(searchTerm) ||
                order.status.toLowerCase().includes(searchTerm) ||
                order.source.toLowerCase().includes(searchTerm)
            );
        }
        currentPage = 1;
        renderStats(filtered);
        renderOrders(paginate(filtered, currentPage, pageSize));
        renderPagination(filtered.length, currentPage, pageSize);
    }

    function checkForHighlightedOrder() {
        // Check URL parameters for newly created order
        const urlParams = new URLSearchParams(window.location.search);
        const createdOrderId = urlParams.get('created');

        if (createdOrderId) {
            // Add slight delay to ensure DOM is ready
            setTimeout(() => {
                const orderRow = document.querySelector(`tr[data-order-id="${createdOrderId}"]`);
                if (orderRow) {
                    orderRow.classList.add('highlighted');
                    orderRow.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Remove highlight after 3 seconds
                    setTimeout(() => {
                        orderRow.classList.remove('highlighted');
                    }, 3000);
                }
            }, 100);
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text ?? '';
        return div.innerHTML;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function formatStatus(status) {
        const statusMap = {
            'new': 'New',
            'processing': 'Processing',
            'shipped': 'Shipped',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled',
            'packed': 'Packed'
        };
        return statusMap[status] || status;
    }

    function formatSource(source) {
        const sourceMap = {
            'web': 'Website',
            'email': 'Email',
            'phone': 'Phone',
            'manual': 'Manual',
            'api': 'API'
        };
        return sourceMap[source] || source;
    }

    // Export functions for external access if needed
    window.OrdersPage = {
        refreshOrders: () => {
            renderStats(filtered);
            renderOrders(paginate(filtered, currentPage, pageSize));
            renderPagination(filtered.length, currentPage, pageSize);
        },
        getOrders: () => allOrders,
        filterOrders: filterOrders
    };
});
