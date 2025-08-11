// Mock payment data
const paymentData = {
  'VN-2024-089': { id: 'PAY-2024-089', supplier: 'Vietnam Timber Co', amount: 18750, status: '12 Days Overdue', dueDate: '2025-05-15', description: 'Pinewood Raw Material - 30 Units' },
  'MY-2024-045': { id: 'PAY-2024-045', supplier: 'Malaysia Express', amount: 12500, status: 'Paid', dueDate: '2025-05-24', description: 'Assembled Pallets - 50 Units' },
  'AU-2024-156': { id: 'PAY-2024-156', supplier: 'Australia Timber', amount: 22400, status: 'Pending', dueDate: '2025-05-25', description: 'LVL Material - 18 Tons' },
};

document.addEventListener('DOMContentLoaded', () => {
  // Pre-populate for demo
  const searchInput = document.getElementById('paymentSearch');
  if (searchInput) searchInput.value = 'VN-2024-089';

  document.getElementById('searchBtn')?.addEventListener('click', searchPayment);
  document.getElementById('saveBtn')?.addEventListener('click', saveChanges);
  document.getElementById('cancelBtn')?.addEventListener('click', cancelUpdate);

  document.getElementById('paymentSearch')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchPayment();
  });
});

function searchPayment() {
  const searchValue = document.getElementById('paymentSearch').value.trim();
  if (!searchValue) { alert('Please enter a Payment ID'); return; }
  const payment = paymentData[searchValue];
  if (!payment) {
    alert('Payment not found. Please check the Payment ID and try again.');
    hideAll();
    return;
  }
  // Fill result
  setText('resultPaymentId', payment.id);
  setText('resultSupplier', payment.supplier);
  setText('resultAmount', `$${payment.amount.toLocaleString()}`);
  setText('resultStatus', payment.status);
  setText('resultDescription', payment.description);

  // Show sections
  show('paymentResult');
  show('pendingChangesAlert');
  show('paymentDetailsForm');
  show('shipmentIntegration');
  show('formActions');

  // Fill form values
  setInputValue('paymentAmount', (payment.amount * 1.027).toFixed(2));
  setInputValue('dueDate', '2025-05-30');
  setSelectValue('priority', 'High');
}

function saveChanges() {
  const paymentId = document.getElementById('resultPaymentId').textContent;
  setText('successPaymentId', paymentId);
  openModal('successModal');
  setTimeout(() => {
    hide('pendingChangesAlert');
    const badge = document.getElementById('resultStatus');
    badge.textContent = 'Updated';
    badge.className = 'status-badge status-paid';
  }, 1200);
}

function cancelUpdate() {
  if (!confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) return;
  hideAll();
  const input = document.getElementById('paymentSearch');
  if (input) input.value = '';
}

// Utilities
function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }
function setInputValue(id, value) { const el = document.getElementById(id); if (el) el.value = value; }
function setSelectValue(id, value) { const el = document.getElementById(id); if (el) el.value = value; }
function show(id) { const el = document.getElementById(id); if (el) el.style.display = id === 'formActions' ? 'block' : 'block'; }
function hide(id) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }
function hideAll() { ['paymentResult','pendingChangesAlert','paymentDetailsForm','shipmentIntegration','formActions'].forEach(hide); }
function openModal(id) { const el = document.getElementById(id); if (el) el.style.display = 'block'; }
function closeModal(id) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }


