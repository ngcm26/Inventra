document.addEventListener('DOMContentLoaded', () => {
  const createBtn = document.getElementById('createBtn');

  function showToast({ title = 'Saved', desc = '', type = 'success', timeout = 3500 }) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
      <div>
        <div class="title">${title}</div>
        ${desc ? `<div class="desc">${desc}</div>` : ''}
      </div>
      <button class="close" aria-label="Close">&times;</button>
    `;
    document.body.appendChild(toast);
    const close = () => toast.remove();
    toast.querySelector('.close')?.addEventListener('click', close);
    setTimeout(close, timeout);
  }

  function readValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function validateRequired(fields) {
    for (const field of fields) {
      const el = document.getElementById(field);
      if (!el) continue;
      const value = el.value.trim();
      if (!value) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast({ title: 'Missing field', desc: `Please fill in: ${el.labels?.[0]?.innerText || field}`, type: 'error' });
        return false;
      }
    }
    return true;
  }

  function buildShipmentPayload() {
    return {
      id: readValue('shipmentId'),
      type: readValue('shipmentType'),
      route: {
        origin: readValue('origin'),
        destination: readValue('destination')
      },
      product: readValue('product'),
      quantity: readValue('quantity'),
      expectedDeparture: readValue('expectedDeparture'),
      expectedArrival: readValue('expectedArrival'),
      status: readValue('initialStatus'),
      supplier: readValue('supplier'),
      notes: readValue('notes'),
      extra: {
        containerNumber: readValue('containerNumber'),
        billOfLading: readValue('billOfLading'),
        estimatedCost: parseFloat(readValue('estimatedCost') || '0') || 0,
        currency: readValue('currency') || 'USD',
        priority: readValue('priority') || 'normal',
        insurance: readValue('insurance') || 'no',
        contact: {
          person: readValue('contactPerson'),
          email: readValue('contactEmail'),
          phone: readValue('contactPhone'),
          carrier: readValue('carrierContact')
        }
      },
      createdAt: new Date().toISOString(),
      source: 'manual'
    };
  }

  function saveDraft(payload) {
    try {
      const key = 'inventra.shipments.manualDrafts';
      const drafts = JSON.parse(localStorage.getItem(key) || '[]');
      drafts.unshift(payload);
      localStorage.setItem(key, JSON.stringify(drafts.slice(0, 50)));
      return true;
    } catch (e) {
      console.warn('Failed saving draft', e);
      return false;
    }
  }

  // Click handler for Create Shipment (form submission)
  if (createBtn) {
    createBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const required = [
        'shipmentId', 'shipmentType', 'origin', 'destination', 'product', 'quantity',
        'expectedDeparture', 'expectedArrival', 'initialStatus', 'supplier'
      ];
      if (!validateRequired(required)) return;

      const payload = buildShipmentPayload();
      const ok = saveDraft(payload);
      if (ok) {
        showToast({ title: 'Shipment saved', desc: `Draft ${payload.id} created.`, type: 'success' });
        setTimeout(() => { window.location.href = 'shipping_overview.html'; }, 900);
      } else {
        showToast({ title: 'Save failed', desc: 'Could not save the shipment draft.', type: 'error' });
      }
    });
  }

  // Quick action buttons active-state toggle
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      if (this.classList.contains('active')) return;
      document.querySelectorAll('.action-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      console.log('Action selected:', this.textContent.trim());
    });
  });

  // Mode toggle buttons in header
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const mode = this.textContent.trim();
      console.log('Header mode switched to:', mode);
      if (mode === 'Automation') {
        window.location.href = 'new_shipment_automated.html';
      } else if (mode === 'Manual Entry') {
        console.log('Already on manual entry page');
      }
    });
  });

  // Field-level validations (blur/input border feedback)
  document.querySelectorAll('input[required], select[required]').forEach(field => {
    field.addEventListener('blur', function () {
      this.style.borderColor = this.value.trim() ? '#d1d5db' : '#dc2626';
    });
    field.addEventListener('input', function () {
      if (this.value.trim()) this.style.borderColor = '#d1d5db';
    });
  });

  // Auto-suggest shipment ID placeholder when empty
  const shipmentIdField = document.querySelector('#shipmentId');
  if (shipmentIdField && !shipmentIdField.value) {
    const countries = ['MY', 'VN', 'AU', 'NZ', 'SG'];
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const suggestedId = `${randomCountry}-2024-${randomNumber.toString().padStart(3, '0')}`;
    shipmentIdField.placeholder = `e.g., ${suggestedId}`;
  }

  // Date defaults and constraints: arrival cannot precede departure
  const departureDate = document.getElementById('expectedDeparture');
  const arrivalDate = document.getElementById('expectedArrival');
  if (departureDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    departureDate.min = tomorrow.toISOString().split('T')[0];
    departureDate.addEventListener('change', function () {
      if (!arrivalDate) return;
      if (this.value) {
        arrivalDate.min = this.value;
        if (arrivalDate.value && arrivalDate.value < this.value) arrivalDate.value = '';
      }
    });
  }

  // Sidebar nav active-state handling
  document.querySelectorAll('.nav-item a').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      this.closest('.nav-item')?.classList.add('active');
    });
  });

  // showNotification helper aligned with automation page
  function showNotification(message, type = 'info') {
    showToast({ title: type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info', desc: message, type });
  }
  window.showNotification = showNotification;

  // Keyboard shortcuts: Ctrl+S to submit, Esc to go back
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      createBtn?.click();
    }
    if (e.key === 'Escape') {
      window.location.href = 'shipping_overview.html';
    }
  });
});


