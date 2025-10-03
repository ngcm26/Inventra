let currentPaymentRow = null;

// Modal helpers
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

// View Receipt
function viewReceipt(paymentId, description, amount, date, company) {
  document.getElementById('receiptPaymentId').textContent = paymentId;
  document.getElementById('receiptDescription').textContent = description;
  document.getElementById('receiptAmount').textContent = amount;
  document.getElementById('receiptDate').textContent = date;
  document.getElementById('receiptCompany').textContent = company;
  document.getElementById('receiptTransactionId').textContent = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  openModal('receiptModal');
}

// Pay Now
function payNow(paymentId, company, amount) {
  const tableRows = document.querySelectorAll('#paymentTable tbody tr');
  tableRows.forEach(row => {
    if (row.cells[0].textContent === paymentId) currentPaymentRow = row;
  });
  document.getElementById('paymentId').textContent = paymentId;
  document.getElementById('paymentCompany').textContent = company;
  document.getElementById('paymentAmount').textContent = amount;
  openModal('paymentModal');
}

// Confirm Payment
function confirmPayment() {
  const transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  document.getElementById('successTransactionId').textContent = transactionId;

  if (currentPaymentRow) {
    const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    currentPaymentRow.cells[6].textContent = currentDate;
    const statusCell = currentPaymentRow.cells[7];
    statusCell.innerHTML = '<span class="status-badge status-paid">Paid</span>';
    currentPaymentRow.setAttribute('data-status', 'Paid');

    const actionCell = currentPaymentRow.cells[8];
    const paymentId = currentPaymentRow.cells[0].textContent;
    const description = currentPaymentRow.cells[3].textContent;
    const amount = currentPaymentRow.cells[4].textContent;
    const company = currentPaymentRow.cells[2].textContent.split(' → ')[1];
    actionCell.innerHTML = `<div class="action-dropdown"><button class="action-btn-sm" onclick="viewReceipt('${paymentId}', '${description}', '${amount}', '${currentDate}', '${company}')">View Receipt</button></div>`;

    // animate
    currentPaymentRow.classList.add('row-paid-animate');
    setTimeout(() => currentPaymentRow.classList.remove('row-paid-animate'), 2000);
  }

  closeModal('paymentModal');
  openModal('successModal');
}

// Print
function printReceipt() { window.print(); }

// Filters
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  const typeFilter = document.getElementById('typeFilter');
  const statusFilter = document.getElementById('statusFilter');
  const tableRows = document.querySelectorAll('#paymentTable tbody tr');

  function filterTable() {
    const searchTerm = (searchInput.value || '').toLowerCase();
    const selectedType = typeFilter.value;
    const selectedStatus = statusFilter.value;
    tableRows.forEach(row => {
      const type = row.getAttribute('data-type');
      const status = row.getAttribute('data-status');
      const text = row.textContent.toLowerCase();
      const matchesSearch = text.includes(searchTerm);
      const matchesType = !selectedType || type === selectedType;
      const matchesStatus = !selectedStatus || status === selectedStatus;
      row.style.display = (matchesSearch && matchesType && matchesStatus) ? '' : 'none';
    });
  }

  searchInput?.addEventListener('input', filterTable);
  typeFilter?.addEventListener('change', filterTable);
  statusFilter?.addEventListener('change', filterTable);

  // Close modal when clicking outside
  window.addEventListener('click', function (event) {
    document.querySelectorAll('.modal').forEach(modal => {
      if (event.target === modal) closeModal(modal.id);
    });
  });
});


