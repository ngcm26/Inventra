// Customer data
const customerData = {
  'singapore-logistics': {
    name: 'Singapore Logistics Pte Ltd',
    contact: 'John Tan',
    address: '123 Business Park\nSingapore 123456',
    email: 'orders@sglogistics.com',
    phone: '+65 6789 1234'
  },
  'malaysia-express': {
    name: 'Malaysia Express',
    contact: 'Ahmad Rahman',
    address: 'Jalan Industri 45\nKuala Lumpur 50000',
    email: 'procurement@myexpress.com',
    phone: '+60 3 1234 5678'
  },
  'vietnam-timber': {
    name: 'Vietnam Timber Co',
    contact: 'Nguyen Van A',
    address: 'District 7, Ho Chi Minh City\nVietnam',
    email: 'orders@vntimber.com',
    phone: '+84 28 1234 5678'
  },
  'australia-timber': {
    name: 'Australia Timber',
    contact: 'Mike Johnson',
    address: '456 Timber Street\nSydney NSW 2000',
    email: 'sales@autimber.com.au',
    phone: '+61 2 1234 5678'
  }
};

// Templates
const templates = {
  standard: { items: [
    { description: 'Standard Wooden Pallets', quantity: 100, price: 25.00 },
    { description: 'Shipping & Handling', quantity: 1, price: 150.00 }
  ]},
  custom: { items: [
    { description: 'Custom Wooden Pallets - Heavy Duty', quantity: 120, price: 297.00 }
  ]},
  bulk: { items: [
    { description: 'Bulk Standard Pallets', quantity: 500, price: 22.50 },
    { description: 'Volume Discount', quantity: 1, price: -500.00 },
    { description: 'Bulk Shipping', quantity: 1, price: 800.00 }
  ]},
  export: { items: [
    { description: 'Export Grade Pallets', quantity: 200, price: 45.00 },
    { description: 'Export Documentation', quantity: 1, price: 250.00 },
    { description: 'International Shipping', quantity: 1, price: 1200.00 }
  ]},
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize dates
  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 30);
  const invoiceDateEl = document.getElementById('invoiceDate');
  const dueDateEl = document.getElementById('dueDate');
  if (invoiceDateEl) invoiceDateEl.value = today.toISOString().split('T')[0];
  if (dueDateEl) dueDateEl.value = dueDate.toISOString().split('T')[0];

  // Wire up actions
  document.getElementById('customerSelect')?.addEventListener('change', updateCustomerInfo);
  document.getElementById('relatedOrder')?.addEventListener('change', updatePreview);
  document.getElementById('invoiceDate')?.addEventListener('change', updatePreview);
  document.getElementById('dueDate')?.addEventListener('change', updatePreview);
  document.getElementById('currency')?.addEventListener('change', updatePreview);
  document.getElementById('paymentTerms')?.addEventListener('change', updatePreview);

  document.getElementById('addItemBtn')?.addEventListener('click', addRow);
  document.getElementById('saveDraftBtn')?.addEventListener('click', saveDraft);
  document.getElementById('downloadBtn')?.addEventListener('click', downloadPDF);
  document.getElementById('generateSendBtn')?.addEventListener('click', generateAndSend);

  document.getElementById('downloadPdfBtn')?.addEventListener('click', downloadPDF);
  document.getElementById('generateBtn')?.addEventListener('click', generateInvoice);
  document.getElementById('sendBtn')?.addEventListener('click', generateAndSend);

  // Delegate table inputs and buttons
  document.getElementById('itemsTableBody')?.addEventListener('input', (e) => {
    const target = e.target;
    if (target.matches('.qty-input') || target.matches('.price-input') || target.matches('td input[type="text"]')) {
      if (target.closest('tr')) calculateRowTotal(target);
      updatePreview();
    }
  });
  document.getElementById('itemsTableBody')?.addEventListener('click', (e) => {
    const target = e.target;
    if (target.matches('.remove-btn')) {
      removeRow(target);
    }
  });

  // Templates click
  document.querySelectorAll('.template-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-template');
      loadTemplate(name);
    });
  });

  // Initial computation
  updatePreview();
  calculateTotals();
});

function updateCustomerInfo() {
  const select = document.getElementById('customerSelect');
  const selectedValue = select?.value || '';
  if (selectedValue && customerData[selectedValue]) {
    const customer = customerData[selectedValue];
    document.getElementById('contactPerson').value = customer.contact;
    document.getElementById('billingAddress').value = customer.address;
    document.getElementById('customerEmail').value = customer.email;
    document.getElementById('customerPhone').value = customer.phone;
    updatePreview();
  }
}

function loadTemplate(templateName) {
  if (!templates[templateName]) return;
  const tbody = document.getElementById('itemsTableBody');
  tbody.innerHTML = '';
  templates[templateName].items.forEach(item => addRowWithData(item.description, item.quantity, item.price));
  calculateTotals();
  updatePreview();
}

function addRow() {
  const tbody = document.getElementById('itemsTableBody');
  const row = tbody.insertRow();
  row.innerHTML = `
    <td><input type="text" placeholder="Product/Service Description" /></td>
    <td><input type="number" value="1" min="1" class="qty-input" /></td>
    <td><input type="number" value="0.00" min="0" step="0.01" class="price-input" /></td>
    <td class="row-total">0.00</td>
    <td><button class="remove-btn" type="button" aria-label="Remove"><i class="fas fa-trash"></i></button></td>
  `;
}

function addRowWithData(description, quantity, price) {
  const tbody = document.getElementById('itemsTableBody');
  const row = tbody.insertRow();
  const total = quantity * price;
  row.innerHTML = `
    <td><input type="text" value="${description}" /></td>
    <td><input type="number" value="${quantity}" min="1" class="qty-input" /></td>
    <td><input type="number" value="${price.toFixed(2)}" min="0" step="0.01" class="price-input" /></td>
    <td class="row-total">${total.toFixed(2)}</td>
    <td><button class="remove-btn" type="button" aria-label="Remove"><i class="fas fa-trash"></i></button></td>
  `;
}

function removeRow(btn) {
  const row = btn.closest('tr');
  row.remove();
  calculateTotals();
  updatePreview();
}

function calculateRowTotal(input) {
  const row = input.closest('tr');
  const qtyInput = row.querySelector('.qty-input');
  const priceInput = row.querySelector('.price-input');
  const totalCell = row.querySelector('.row-total');

  const quantity = parseFloat(qtyInput.value) || 0;
  const price = parseFloat(priceInput.value) || 0;
  const total = quantity * price;
  totalCell.textContent = total.toFixed(2);
  calculateTotals();
}

function calculateTotals() {
  const rows = document.querySelectorAll('#itemsTableBody tr');
  let subtotal = 0;
  rows.forEach(row => {
    const totalText = row.querySelector('.row-total').textContent.trim();
    const amount = parseFloat(totalText.replace(/[$,]/g, '')) || 0;
    subtotal += amount;
  });
  const tax = 0; // No GST configured here
  const shipping = 0;
  const total = subtotal + tax + shipping;

  document.getElementById('previewSubtotal').textContent = subtotal.toFixed(2);
  document.getElementById('previewShipping').textContent = shipping.toFixed(2);
  document.getElementById('previewTotal').textContent = total.toFixed(2);
}

function updatePreview() {
  // Customer
  const customerSelect = document.getElementById('customerSelect');
  const selectedCustomer = customerSelect?.value;
  if (selectedCustomer && customerData[selectedCustomer]) {
    const customer = customerData[selectedCustomer];
    document.getElementById('previewCustomerName').textContent = customer.name;
    document.getElementById('previewCustomerAddress').innerHTML = customer.address.replace('\n', '<br>');
    document.getElementById('previewCustomerEmail').textContent = `Email: ${customer.email}`;
    document.getElementById('previewCustomerPhone').textContent = `Phone: ${customer.phone}`;
  }

  // Invoice info
  document.getElementById('previewInvoiceNumber').textContent = document.getElementById('invoiceNumber').value;
  document.getElementById('previewOrderNumber').textContent = document.getElementById('relatedOrder').value || '-';
  document.getElementById('previewPaymentTerms').textContent = document.getElementById('paymentTerms').value;
  document.getElementById('previewCurrency').textContent = document.getElementById('currency').value;

  // Dates
  const invoiceDate = new Date(document.getElementById('invoiceDate').value);
  const dueDate = new Date(document.getElementById('dueDate').value);
  if (!isNaN(invoiceDate)) {
    document.getElementById('previewInvoiceDate').textContent = invoiceDate.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
  }
  if (!isNaN(dueDate)) {
    document.getElementById('previewDueDate').textContent = dueDate.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
  }

  // Items preview
  const previewBody = document.getElementById('previewItemsBody');
  const itemRows = document.querySelectorAll('#itemsTableBody tr');
  previewBody.innerHTML = '';
  itemRows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const description = inputs[0].value || 'Product/Service';
    const quantity = inputs[1].value || '0';
    const price = parseFloat(inputs[2].value) || 0;
    const total = row.querySelector('.row-total').textContent;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${description}</td>
      <td>${quantity}</td>
      <td>${price.toFixed(2)}</td>
      <td class="amount-cell">${total}</td>
    `;
    previewBody.appendChild(tr);
  });
}

function saveDraft() { alert('Invoice saved as draft successfully!'); }
function downloadPDF() { alert('Invoice PDF download started...'); }

function generateInvoice() {
  const invoiceId = `INV-2025-${String(Math.floor(Math.random()*999)+1).padStart(3,'0')}`;
  document.getElementById('generatedInvoiceId').textContent = invoiceId;
  document.getElementById('invoiceNumber').value = invoiceId;
  updatePreview();
  openModal('successModal');
}

function generateAndSend() {
  generateInvoice();
  setTimeout(() => {
    closeModal('successModal');
    alert('Invoice has been sent to customer via email!');
  }, 1500);
}

function openModal(id) { const el = document.getElementById(id); if (el) el.style.display = 'block'; }
function closeModal(id) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }


