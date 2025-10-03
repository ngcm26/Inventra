document.addEventListener('DOMContentLoaded', function () {
  try {
    // Animate analytics/KPI cards (if present)
    const cards = document.querySelectorAll('.analytics-card, .kpi-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });

    // Animate table rows (from left) on load and for dynamically added rows
    const tableSelectors = ['.summary-table', '.payment-table', '.inventory-table', '.order-table'];

    function animateRowFromLeft(row, index) {
      if (!row || row.dataset.animDone === '1') return;
      row.style.opacity = '0';
      row.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '1';
        row.style.transform = 'translateX(0)';
        row.dataset.animDone = '1';
      }, 500 + (index || 0) * 100);
    }

    function animateExistingRows(table) {
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach((row, idx) => animateRowFromLeft(row, idx));
    }

    function observeNewRows(table) {
      const tbody = table.querySelector('tbody');
      if (!tbody) return;
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.matches && node.matches('tr')) {
                animateRowFromLeft(node, 0);
              } else if (node.querySelectorAll) {
                node.querySelectorAll('tr').forEach((tr) => animateRowFromLeft(tr, 0));
              }
            }
          });
        });
      });
      observer.observe(tbody, { childList: true, subtree: true });
    }

    document.querySelectorAll(tableSelectors.join(',')).forEach((table) => {
      animateExistingRows(table);
      observeNewRows(table);
    });

    // Animate generic cards/sections on load
    const genericSections = document.querySelectorAll('.section, .card, .card-block, .inventory-management-card, .notifications-card, .sales-chart-card, .order-management-card');
    genericSections.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      setTimeout(() => {
        el.style.transition = 'all 0.4s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100 + index * 60);
    });
  } catch (e) {
    // no-op
  }
});


