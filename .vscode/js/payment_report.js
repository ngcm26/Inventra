// Report data (mocked)
const reportData = {
  '30': { cashFlow:{amount:'$284K', change:'+12%', onTime:'87%'}, overdue:{count:5, amount:'$68K', avgDelay:'8 days'}, supplier:{active:12, top:'Vietnam', topRate:'92%'}, automation:{processed:'78%', timeSaved:'15 Hrs', accuracy:'98%'} },
  '60': { cashFlow:{amount:'$542K', change:'+18%', onTime:'85%'}, overdue:{count:8, amount:'$94K', avgDelay:'6 days'}, supplier:{active:15, top:'Malaysia', topRate:'89%'}, automation:{processed:'82%', timeSaved:'28 Hrs', accuracy:'97%'} },
  '90': { cashFlow:{amount:'$796K', change:'+22%', onTime:'83%'}, overdue:{count:12, amount:'$128K', avgDelay:'7 days'}, supplier:{active:18, top:'Australia', topRate:'91%'}, automation:{processed:'85%', timeSaved:'45 Hrs', accuracy:'98%'} },
  '180': { cashFlow:{amount:'$1.42M', change:'+19%', onTime:'84%'}, overdue:{count:21, amount:'$245K', avgDelay:'7 days'}, supplier:{active:22, top:'Vietnam', topRate:'90%'}, automation:{processed:'84%', timeSaved:'90 Hrs', accuracy:'98%'} },
  '365': { cashFlow:{amount:'$3.01M', change:'+24%', onTime:'86%'}, overdue:{count:44, amount:'$510K', avgDelay:'6 days'}, supplier:{active:31, top:'Singapore', topRate:'93%'}, automation:{processed:'86%', timeSaved:'180 Hrs', accuracy:'99%'} },
};

document.addEventListener('DOMContentLoaded', () => {
  // Filters
  document.getElementById('timePeriod')?.addEventListener('change', updateReports);
  document.getElementById('paymentType')?.addEventListener('change', updateReports);
  document.getElementById('statusFilter')?.addEventListener('change', updateReports);
  document.getElementById('partnerFilter')?.addEventListener('change', updateReports);
  document.getElementById('exportBtn')?.addEventListener('click', exportTable);

  // Initial animations
  animateCardsOnLoad();
  animateTableRowsOnLoad();

  updateReports();
});

function updateReports() {
  const period = document.getElementById('timePeriod').value;
  const data = reportData[period] || reportData['30'];

  // Cash Flow
  setText('cashFlowAmount', data.cashFlow.amount);
  setText('cashFlowChange', data.cashFlow.change);
  setText('onTimeRate', data.cashFlow.onTime);

  // Overdue
  setText('overdueCount', data.overdue.count);
  setText('overdueAmount', data.overdue.amount);
  setText('avgDelay', data.overdue.avgDelay);

  // Supplier
  setText('activeSuppliers', data.supplier.active);
  setText('topSupplier', data.supplier.top);
  setText('topSupplierRate', data.supplier.topRate);

  // Automation
  setText('autoProcessed', data.automation.processed);
  setText('timeSaved', data.automation.timeSaved);
  setText('accuracy', data.automation.accuracy);

  // Subtle refresh effect
  document.querySelectorAll('.analytics-card').forEach(card => {
    card.style.opacity = '0.7';
    setTimeout(() => { card.style.opacity = '1'; }, 300);
  });
}

function exportTable() {
  const table = document.getElementById('summaryTable');
  const csv = [];
  const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
  csv.push(headers.join(','));
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  rows.forEach(row => {
    const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent.replace(/[\n,]/g,'').trim());
    csv.push(cells.join(','));
  });
  const blob = new Blob([csv.join('\n')], { type:'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `payment_summary_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  const btn = document.getElementById('exportBtn');
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-circle-check"></i> Exported';
  btn.style.backgroundColor = '#059669';
  setTimeout(() => { btn.innerHTML = original; btn.style.backgroundColor = ''; }, 2000);
}

function animateCardsOnLoad() {
  const cards = document.querySelectorAll('.analytics-card');
  cards.forEach((card, idx) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'all 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, idx * 100);
  });
}

function animateTableRowsOnLoad() {
  const rows = document.querySelectorAll('.summary-table tbody tr');
  rows.forEach((row, idx) => {
    row.style.opacity = '0';
    row.style.transform = 'translateX(-20px)';
    setTimeout(() => {
      row.style.transition = 'all 0.3s ease';
      row.style.opacity = '1';
      row.style.transform = 'translateX(0)';
    }, 500 + idx * 100);
  });
}

function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = String(value); }


