// Purchase Order View → Create Order bridge
document.addEventListener('DOMContentLoaded', () => {
  try { localStorage.setItem('currentPage', 'orders'); } catch (e) {}

  const getVal = (id) => (document.getElementById(id)?.value || '').trim();
  const formatCurrency = (num) => {
    const n = Number(num || 0);
    return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  };

  // Initialize basic PO fields and computed values
  function initializePoView() {
    const product = getVal('poProduct') || 'Item';
    const sku = getVal('poSku') || '';
    const qty = parseFloat(getVal('poQty') || '0') || 0;
    const amountRaw = getVal('poAmount');
    const amount = parseFloat((amountRaw || '').replace(/[^0-9.\-]/g, '')) || 0;
    const unitPrice = qty > 0 ? +(amount / qty).toFixed(2) : amount;

    // Derive or reuse a PO id
    const poContainer = document.getElementById('poPage');
    const existingId = poContainer?.dataset.poId;
    const poId = existingId && existingId.length ? existingId : 'PO-' + new Date().toISOString().slice(0,19).replace(/[-:T]/g, '').slice(0,12);
    if (poContainer) poContainer.dataset.poId = poId;

    // Left rail
    const poIdLabel = document.getElementById('poIdLabel');
    const poCreated = document.getElementById('poCreated');
    const poStatusInput = document.getElementById('poStatus');
    const poStatusPill = document.getElementById('poStatusPill');
    if (poIdLabel) poIdLabel.textContent = poId;
    if (poCreated) poCreated.textContent = new Date().toLocaleDateString();
    if (poStatusPill && poStatusInput) {
      const statusText = (poStatusInput.value || 'Pending').trim();
      poStatusPill.textContent = statusText;
    }

    // Line items
    const unitPriceCell = document.getElementById('unitPriceCell');
    const lineTotalCell = document.getElementById('lineTotalCell');
    const itemNameCell = document.getElementById('itemNameCell');
    const skuCell = document.getElementById('skuCell');
    const qtyCell = document.getElementById('qtyCell');
    if (itemNameCell) itemNameCell.textContent = product;
    if (skuCell) skuCell.textContent = sku;
    if (qtyCell) qtyCell.textContent = String(qty || 0);
    if (unitPriceCell) unitPriceCell.textContent = qty > 0 ? formatCurrency(unitPrice) : '—';
    if (lineTotalCell) lineTotalCell.textContent = formatCurrency(amount);

    // Totals
    const subtotalEl = document.getElementById('subtotalValue');
    const taxEl = document.getElementById('taxValue');
    const shippingEl = document.getElementById('shippingValue');
    const grandEl = document.getElementById('grandTotalValue');
    if (subtotalEl) subtotalEl.textContent = formatCurrency(amount);
    if (taxEl && taxEl.textContent === '$0.00') {
      // keep zero by default; no tax logic yet
    }
    if (shippingEl && shippingEl.textContent === '$0.00') {
      // keep zero by default; no shipping logic yet
    }
    if (grandEl) grandEl.textContent = formatCurrency(amount);

    // Wire delete link with current PO id
    const delLink = document.getElementById('delete-po-link');
    if (delLink) delLink.href = `po-delete.html?poId=${encodeURIComponent(poId)}`;
  }

  // Update derived views on input changes
  ['poProduct', 'poSku', 'poQty', 'poAmount', 'poStatus'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', initializePoView);
  });

  initializePoView();

  // Bridge to Create Order
  const toOrderBtn = document.getElementById('create-order-from-po');
  if (toOrderBtn) {
    toOrderBtn.addEventListener('click', () => {
      const product = getVal('poProduct');
      const sku = getVal('poSku');
      const qty = parseFloat(getVal('poQty') || '0') || 0;
      const amountRaw = getVal('poAmount');
      const amount = parseFloat((amountRaw || '').replace(/[^0-9.\-]/g, '')) || 0;
      const unitPrice = qty > 0 ? +(amount / qty).toFixed(2) : amount;

      const pending = {
        id: 'po-' + Date.now(),
        customer: '',
        email: '',
        phone: '',
        address: '',
        deliveryDate: getVal('poExpected') || '',
        items: [
          {
            name: product || 'Item',
            sku: sku || '',
            qty: qty || 1,
            unitPrice: unitPrice || 0,
          },
        ],
        source: 'manual',
      };

      sessionStorage.setItem('inventra.pendingOrder', JSON.stringify(pending));
      window.location.href = 'create-order.html#prefilled';
    });
  }
});


