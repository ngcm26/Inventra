// Utilities: modal open/close reused across pages
function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (!el) return;
  el.style.display = 'block';
  el.setAttribute('aria-hidden', 'false');
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (!el) return;
  el.style.display = 'none';
  el.setAttribute('aria-hidden', 'true');
}

// Generate readable Payment ID e.g., PAY-2025-001
function generatePaymentId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 900 + 100); // 3 digits
  return `PAY-${year}-${rand}`;
}

function formatAmountWithCurrency(amount, currency) {
  if (!amount || isNaN(amount)) return '—';
  const value = Number(amount);
  const positive = value >= 0;
  const formatted = value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const sign = positive ? '+' : '-';
  const abs = Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const prefix = currency === 'USD' ? '$' : currency === 'SGD' ? '$' : currency === 'MYR' ? 'RM' : '';
  return `${sign}${prefix}${abs}`;
}

function formatDateReadable(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return '—'; }
}

// Live preview binding
document.addEventListener('DOMContentLoaded', () => {
  const paymentId = generatePaymentId();
  document.getElementById('previewPaymentId').textContent = paymentId;

  const fields = ['paymentType','referenceId','company','currency','amount','status','dueDate','paymentDate','description'];
  fields.forEach(id => document.getElementById(id)?.addEventListener('input', updatePreview));
  fields.forEach(id => document.getElementById(id)?.addEventListener('change', updatePreview));

  document.getElementById('cancelBtn')?.addEventListener('click', () => {
    if (!confirm('Cancel creating new payment?')) return;
    window.location.href = 'payment.html';
  });

  document.getElementById('createBtn')?.addEventListener('click', () => {
    // Validate essential fields
    const requiredIds = ['paymentType','referenceId','company','currency','amount','status','dueDate'];
    for (const id of requiredIds) {
      const el = document.getElementById(id);
      if (!el || !el.value) {
        alert('Please fill in all required fields.');
        return;
      }
    }

    // Fill confirm modal
    setText('confirmPaymentId', paymentId);
    setText('confirmType', getValue('paymentType'));
    setText('confirmCompany', getValue('company'));
    setText('confirmAmount', formatAmountWithCurrency(getValue('amount'), getValue('currency')));
    setText('confirmDue', formatDateReadable(getValue('dueDate')));
    setText('confirmStatus', getValue('status'));

    openModal('createPaymentModal');
  });

  // Close modal on backdrop click
  window.addEventListener('click', (event) => {
    document.querySelectorAll('.modal').forEach((modal) => {
      if (event.target === modal) closeModal(modal.id);
    });
  });

  // Initial preview
  updatePreview();
});

function updatePreview() {
  const type = getValue('paymentType') || 'Supplier';
  const ref = getValue('referenceId') || '—';
  const company = getValue('company') || '—';
  const currency = getValue('currency') || 'SGD';
  const amount = getValue('amount');
  const status = getValue('status') || 'Pending';
  const due = getValue('dueDate');
  const desc = getValue('description') || '—';

  // Payment ID stays stable for the session
  const pid = document.getElementById('previewPaymentId').textContent || generatePaymentId();
  document.getElementById('previewPaymentId').textContent = pid;

  setText('previewType', type);
  setText('previewCompany', company);
  setText('previewReference', ref);
  setText('previewAmount', formatAmountWithCurrency(amount || 0, currency));
  setText('previewDue', formatDateReadable(due));
  setText('previewDescription', desc);

  const typeBadge = document.getElementById('previewType');
  if (typeBadge) typeBadge.textContent = type;

  const statusBadge = document.getElementById('previewStatus');
  if (statusBadge) {
    statusBadge.className = 'status-badge ' + mapStatusToClass(status);
    statusBadge.textContent = status;
  }
}

function mapStatusToClass(status) {
  switch ((status || '').toLowerCase()) {
    case 'paid': return 'status-paid';
    case 'pending': return 'status-pending';
    case 'overdue': return 'status-overdue';
    case 'received': return 'status-received';
    default: return 'status-pending';
  }
}

function confirmCreatePayment() {
  // Simulate creation and success
  const transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  setText('successTransactionId', transactionId);

  closeModal('createPaymentModal');
  openModal('successModal');
}

function getValue(id) { const el = document.getElementById(id); return el ? el.value : ''; }
function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }


