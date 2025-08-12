document.addEventListener('DOMContentLoaded', () => {
  try { localStorage.setItem('currentPage', 'orders'); } catch (e) {}

  const tbody = document.querySelector('.orders-table tbody');
  const search = document.getElementById('search-orders');

  // Mock dataset for POs (can be replaced later with real data source)
  const pos = [
    {
      id: 'PO-7537',
      product: 'Skid Pallets',
      sku: '7537',
      supplier: 'Malay Timber Logistics',
      email: 'logistics@malaytimber.com',
      qty: 43,
      status: 'delayed'
    },
    {
      id: 'PO-8012',
      product: 'Euro Pallets',
      sku: 'EU-1200x800',
      supplier: 'DHL Supply Chain',
      email: 'procurement@dhl.com',
      qty: 120,
      status: 'processing'
    },
    {
      id: 'PO-7920',
      product: 'Hardwood Mix',
      sku: 'HW-MIX',
      supplier: 'Kuehne + Nagel',
      email: 'orders@kn.com',
      qty: 75,
      status: 'new'
    }
  ];

  function statusClass(s) {
    switch ((s || '').toLowerCase()) {
      case 'new': return 'status-new';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      case 'delayed': return 'status-processing';
      default: return 'status-new';
    }
  }

  function render(list) {
    if (!tbody) return;
    tbody.innerHTML = '';
    list.forEach(po => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="order-id">${po.id}</span></td>
        <td>
          <div class="item-title">${escapeHtml(po.product)}</div>
          <div class="item-sub">SKU ${escapeHtml(po.sku)}</div>
        </td>
        <td>
          <div>${escapeHtml(po.supplier)}</div>
          <div class="supplier-sub">${escapeHtml(po.email)}</div>
        </td>
        <td>${po.qty}</td>
        <td><span class="status-pill ${statusClass(po.status)}">${escapeHtml(po.status)}</span></td>
        <td>
          <a class="btn btn-ghost" href="po-view.html?poId=${encodeURIComponent(po.id)}"><i class="fa-solid fa-eye"></i> View</a>
          <a class="btn btn-ghost" href="po-delete.html?poId=${encodeURIComponent(po.id)}" style="color:#DC2626;border-color:#FCA5A5"><i class="fa-solid fa-trash"></i> Delete</a>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
  }

  function filter(term) {
    const q = (term || '').toLowerCase();
    const filtered = !q ? pos : pos.filter(po =>
      po.id.toLowerCase().includes(q) ||
      po.product.toLowerCase().includes(q) ||
      po.sku.toLowerCase().includes(q) ||
      po.supplier.toLowerCase().includes(q) ||
      po.email.toLowerCase().includes(q) ||
      String(po.qty).includes(q) ||
      String(po.status).toLowerCase().includes(q)
    );
    render(filtered);
  }

  if (search) {
    search.addEventListener('input', e => filter(e.target.value));
  }

  render(pos);
});


