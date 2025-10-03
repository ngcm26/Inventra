// Create Order page logic
document.addEventListener('DOMContentLoaded', () => {
  // Mark current page for navbar highlighting
  try { localStorage.setItem('currentPage', 'sale'); } catch (e) {}

  const select = (sel) => document.querySelector(sel);
  const itemsTbody = select('#items-body');
  const addRowBtn = select('#add-row');
  const saveBtn = select('#save-order');
  const toInboxBtn = select('#to-inbox');
  const parseTextBtn = select('#parse-text');

  function newRow(item = {}) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input name="name" placeholder="Item name" value="${item.name || ''}" /></td>
      <td><input name="sku" placeholder="SKU" value="${item.sku || ''}" /></td>
      <td><input name="qty" type="number" min="1" value="${item.qty || item.quantity || ''}" /></td>
      <td><input name="price" type="number" min="0" step="0.01" value="${item.unitPrice || ''}" /></td>
      <td class="row-actions"><button class="btn btn-ghost remove" type="button">Remove</button></td>
    `;
    tr.querySelector('.remove').addEventListener('click', () => {
      tr.remove();
      recalc();
    });
    return tr;
  }

  function collectForm() {
    const orderItems = Array.from(itemsTbody.querySelectorAll('tr'))
      .map((tr) => {
        const get = (n) => tr.querySelector(`[name="${n}"]`).value.trim();
        const qty = parseFloat(get('qty') || '0');
        const unitPrice = parseFloat(get('price') || '0');
        return {
          name: get('name'),
          sku: get('sku'),
          qty,
          unitPrice,
          subtotal: +(qty * unitPrice).toFixed(2),
        };
      })
      .filter((i) => i.name || i.sku);

    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      id: document.querySelector('#orderId').value.trim() || window.InventraAI?.generateId?.() || 'ORD-' + Date.now(),
      customer: document.querySelector('#customerName').value.trim(),
      email: document.querySelector('#customerEmail').value.trim(),
      phone: document.querySelector('#customerPhone').value.trim(),
      address: document.querySelector('#address').value.trim(),
      deliveryDate: document.querySelector('#deliveryDate').value,
      status: 'New',
      createdAt: new Date().toISOString(),
      items: orderItems,
      total: +total.toFixed(2),
      source: 'manual',
    };
  }

  function recalc() {
    const data = collectForm();
    document.querySelector('#total').textContent = `$ ${data.total.toFixed(2)}`;
  }

  addRowBtn.addEventListener('click', () => {
    itemsTbody.appendChild(newRow());
  });
  itemsTbody.addEventListener('input', recalc);

  saveBtn.addEventListener('click', () => {
    const order = collectForm();
    if (!order.customer || !order.items.length) {
      alert('Please add a customer and at least one item.');
      return;
    }
    window.InventraAI?.addOrder?.(order);
    sessionStorage.removeItem('inventra.pendingOrder');
    window.location.href = 'sale.html?created=' + encodeURIComponent(order.id);
  });

  toInboxBtn.addEventListener('click', () => {
    window.location.href = 'inbox.html?intent=import';
  });

  parseTextBtn.addEventListener('click', () => {
    const body = document.querySelector('#emailPaste').value;
    if (!body.trim()) {
      alert('Paste an email first.');
      return;
    }
    const parsed = window.InventraAI?.parseEmailToOrder?.({
      id: 'paste-' + Date.now(),
      subject: 'Pasted Email',
      sender: 'unknown@example.com',
      body,
    });
    if (parsed) {
      sessionStorage.setItem('inventra.pendingOrder', JSON.stringify(parsed));
      window.location.href = 'create-order.html#prefilled';
    } else {
      alert('Parsing failed. Please check the email content.');
    }
  });

  // Prefill support using sessionStorage payload from Inbox
  function prefillFromPending() {
    if (window.location.hash !== '#prefilled') return;
    const raw = sessionStorage.getItem('inventra.pendingOrder');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (!data) return;

      // Basic fields
      const setVal = (sel, val) => {
        const el = document.querySelector(sel);
        if (el && val != null) el.value = String(val);
      };

      setVal('#customerName', data.customer || '');
      setVal('#customerEmail', data.email || '');
      setVal('#customerPhone', data.phone || '');
      setVal('#address', data.address || '');
      setVal('#deliveryDate', data.deliveryDate || '');

      // Items
      itemsTbody.innerHTML = '';
      const items = Array.isArray(data.items) ? data.items : [];
      if (items.length === 0) {
        itemsTbody.appendChild(newRow());
      } else {
        items.forEach((it) => {
          const row = newRow({
            name: it.name || it.type || 'Item',
            sku: it.sku || '',
            qty: it.qty || it.quantity || 1,
            unitPrice: it.unitPrice || it.price || 0,
          });
          itemsTbody.appendChild(row);
        });
      }

      recalc();
    } catch (e) {
      console.error('Failed to prefill create order:', e);
    }
  }

  prefillFromPending();

  // Ensure at least one blank row exists on first load
  if (!itemsTbody.children.length) {
    itemsTbody.appendChild(newRow());
  }
});


