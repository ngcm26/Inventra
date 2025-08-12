document.addEventListener('DOMContentLoaded', () => {
  // Set current page for navigation
  try { 
    if (typeof Storage !== "undefined") {
      localStorage.setItem('currentPage', 'shipment'); 
    }
  } catch (e) {
    console.log('LocalStorage not available');
  }

  // Initialize global shipment data if it doesn't exist
  const DEFAULT_OVERVIEW_SHIPMENTS = [
    {
      id: 'MY-2024-142',
      type: 'Incoming',
      route: 'Malaysia → Singapore',
      product: 'Pinewood Raw Material',
      quantity: '2.4 Tons',
      eta: '15 Jun 2025',
      status: 'In Transit',
      statusClass: 'status-processing',
      lastUpdated: new Date('2025-06-10').toISOString()
    },
    {
      id: 'VN-2024-089',
      type: 'Incoming',
      route: 'Vietnam → Singapore → Malaysia',
      product: 'Pinewood Raw Material',
      quantity: '30 Units',
      eta: '30 May 2025',
      status: 'Delayed',
      statusClass: 'status-delayed',
      lastUpdated: new Date('2025-05-25').toISOString()
    }
  ];

  if (!window.shipmentOverviewData) {
    window.shipmentOverviewData = [...DEFAULT_OVERVIEW_SHIPMENTS];
  }

  const createBtn = document.getElementById('createBtn');
  const saveDraftBtn = document.getElementById('saveDraftBtn');

  // Progress tracking
  function updateProgress() {
    const steps = document.querySelectorAll('.progress-step');
    const requiredFields1 = ['shipmentId', 'shipmentType', 'origin', 'destination', 'product', 'quantity', 'expectedDeparture', 'expectedArrival', 'initialStatus', 'supplier'];
    const additionalFields = ['containerNumber', 'billOfLading', 'estimatedCost', 'priority'];
    const contactFields = ['contactPerson', 'contactEmail', 'contactPhone'];

    // Check step 1 completion
    const step1Complete = requiredFields1.every(fieldId => {
      const field = document.getElementById(fieldId);
      return field && field.value.trim();
    });

    // Check step 2 completion (any field filled)
    const step2Complete = additionalFields.some(fieldId => {
      const field = document.getElementById(fieldId);
      return field && field.value.trim();
    });

    // Check step 3 completion (any field filled)
    const step3Complete = contactFields.some(fieldId => {
      const field = document.getElementById(fieldId);
      return field && field.value.trim();
    });

    // Update progress indicators
    steps[0].classList.toggle('active', true);
    steps[0].classList.toggle('completed', step1Complete);
    
    steps[1].classList.toggle('active', step1Complete);
    steps[1].classList.toggle('completed', step2Complete);
    
    steps[2].classList.toggle('active', step1Complete);
    steps[2].classList.toggle('completed', step3Complete);
  }

  // Toast notification function
  function showToast({ title = 'Saved', desc = '', type = 'success', timeout = 3500 }) {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    toast.innerHTML = `
      <i class="fas ${iconMap[type] || iconMap.info}"></i>
      <div>
        <div class="title">${title}</div>
        ${desc ? `<div class="desc">${desc}</div>` : ''}
      </div>
      <button class="close" aria-label="Close">&times;</button>
    `;

    // Add toast styles
    toast.style.cssText = `
      position: fixed;
      right: 24px;
      top: 24px;
      z-index: 1000;
      background: #fff;
      color: #1e293b;
      border-left: 4px solid ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#3F7AB0'};
      box-shadow: 0 6px 24px rgba(0,0,0,0.15);
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 320px;
      font-family: 'DM Sans', sans-serif;
      animation: slideIn 0.3s ease-out;
    `;

    // Add styles for internal elements
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .toast .title { font-weight: 700; }
      .toast .desc { color: #64748b; font-size: 13px; }
      .toast .close { 
        background: none; 
        border: none; 
        color: #94a3b8; 
        cursor: pointer; 
        margin-left: auto; 
        font-size: 16px; 
      }
    `;
    if (!document.getElementById('toast-styles')) {
      style.id = 'toast-styles';
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    
    const close = () => toast.remove();
    toast.querySelector('.close')?.addEventListener('click', close);
    setTimeout(close, timeout);
  }

  // Get form field value helper
  function readValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  // Validate required fields
  function validateRequired(fields) {
    for (const field of fields) {
      const el = document.getElementById(field);
      if (!el) continue;
      const value = el.value.trim();
      if (!value) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const fieldName = el.labels?.[0]?.innerText?.replace('*', '') || field;
        showToast({ 
          title: 'Missing Required Field', 
          desc: `Please fill in: ${fieldName}`, 
          type: 'error' 
        });
        return false;
      }
    }
    return true;
  }

  // Build complete shipment payload
  function buildShipmentPayload() {
    const originCountry = readValue('origin');
    const destinationCountry = readValue('destination');
    
    // Create route string
    const countryNames = {
      'malaysia': 'Malaysia',
      'vietnam': 'Vietnam',
      'australia': 'Australia',
      'new-zealand': 'New Zealand',
      'singapore': 'Singapore'
    };

    const originName = countryNames[originCountry] || originCountry;
    const destinationName = countryNames[destinationCountry] || destinationCountry;
    const route = `${originName} → ${destinationName}`;

    // Format ETA for display
    const etaDate = readValue('expectedArrival');
    let formattedETA = '';
    if (etaDate) {
      const date = new Date(etaDate);
      formattedETA = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }

    // Map status for display
    const statusMap = {
      'processing': 'Processing',
      'in-transit': 'In Transit',
      'at-customs': 'At Customs'
    };
    const status = statusMap[readValue('initialStatus')] || readValue('initialStatus');

    // Map status to CSS class
    function getStatusClass(status) {
      const statusClassMap = {
        'processing': 'status-processing',
        'in transit': 'status-processing',
        'at customs': 'status-processing',
        'delayed': 'status-delayed',
        'delivered': 'status-delivered'
      };
      return statusClassMap[status.toLowerCase()] || 'status-processing';
    }

    return {
      // Basic overview data (for shipment table)
      id: readValue('shipmentId'),
      type: readValue('shipmentType').charAt(0).toUpperCase() + readValue('shipmentType').slice(1),
      route: route,
      product: readValue('product'),
      quantity: readValue('quantity'),
      eta: formattedETA,
      status: status,
      statusClass: getStatusClass(status),
      lastUpdated: new Date().toISOString(),
      
      // Detailed data (for shipment details page)
      detailedData: {
        id: readValue('shipmentId'),
        type: readValue('shipmentType').charAt(0).toUpperCase() + readValue('shipmentType').slice(1),
        status: status,
        priority: readValue('priority').charAt(0).toUpperCase() + readValue('priority').slice(1),
        created: new Date().toISOString().split('T')[0],
        eta: formattedETA,
        carrier: readValue('supplier'),
        route: route,
        
        product: {
          name: readValue('product'),
          quantity: readValue('quantity'),
          weight: 'TBD', // Could be calculated or entered separately
          dimensions: 'TBD',
          value: readValue('estimatedCost') ? `${readValue('estimatedCost')} ${readValue('currency')}` : 'TBD'
        },
        
        origin: {
          location: `${originName} Port`,
          time: readValue('expectedDeparture') ? new Date(readValue('expectedDeparture')).toISOString() : new Date().toISOString()
        },
        
        current: {
          location: status === 'Processing' ? `${originName} Port` : 'In Transit',
          time: new Date().toISOString()
        },
        
        destination: {
          location: `${destinationName} Port`,
          time: readValue('expectedArrival') ? `${formattedETA} (ETA)` : 'TBD'
        },
        
        contacts: {
          shipper: {
            name: readValue('supplier'),
            phone: readValue('contactPhone') || 'TBD',
            email: readValue('contactEmail') || 'TBD'
          },
          receiver: {
            name: readValue('carrierContact') || 'TBD',
            phone: 'TBD',
            email: 'TBD'
          }
        },
        
        timeline: [
          {
            status: 'completed',
            title: 'Order Placed',
            description: 'Shipment created manually',
            time: new Date().toLocaleString('en-GB'),
            location: `${originName} Port`
          },
          {
            status: status.toLowerCase() === 'processing' ? 'current' : 'completed',
            title: status,
            description: status === 'Processing' ? 'Preparing shipment for departure' : 
                        status === 'In Transit' ? 'Shipment in transit' : 'At customs clearance',
            time: new Date().toLocaleString('en-GB'),
            location: status === 'Processing' ? `${originName} Port` : 
                     status === 'In Transit' ? 'In Transit' : 'Customs Facility'
          }
        ],
        
        documents: [
          { name: 'Shipment Order', type: 'pdf', size: '125 KB' },
          ...(readValue('billOfLading') ? [{ name: 'Bill of Lading', type: 'pdf', size: '98 KB' }] : []),
          ...(readValue('containerNumber') ? [{ name: 'Container Details', type: 'pdf', size: '67 KB' }] : [])
        ],
        
        notes: [readValue('notes'), readValue('specialInstructions')].filter(Boolean).join(' | ') || 'No additional notes.',
        lastUpdated: new Date().toISOString(),
        
        // Additional fields
        containerNumber: readValue('containerNumber'),
        billOfLading: readValue('billOfLading'),
        estimatedCost: readValue('estimatedCost'),
        currency: readValue('currency'),
        insurance: readValue('insurance')
      }
    };
  }

  // Save shipment to overview data and detailed data
  function saveShipmentData(payload) {
    try {
      console.log('=== SAVE SHIPMENT START ===');
      console.log('Saving shipment data:', payload);
      
      // Load existing data from sessionStorage first
      let existingOverviewData = [];
      if (typeof Storage !== "undefined") {
        try {
          existingOverviewData = JSON.parse(sessionStorage.getItem('inventra_shipment_overview') || '[]');
          console.log('Loaded existing overview data from sessionStorage:', existingOverviewData);
          console.log('Existing shipment count:', existingOverviewData.length);
        } catch (e) {
          console.error('Failed to load existing overview data:', e);
        }
      }
      
      // Update window data and ensure defaults persist
      const filtered = existingOverviewData.filter(s => s.id !== 'AU-12345');
      const merged = [...filtered];
      DEFAULT_OVERVIEW_SHIPMENTS.forEach(base => {
        if (!merged.some(s => s.id === base.id)) merged.push(base);
      });
      window.shipmentOverviewData = merged;
      
      // Check if shipment already exists
      const existingIndex = window.shipmentOverviewData.findIndex(s => s.id === payload.id);
      
      if (existingIndex >= 0) {
        // Update existing
        console.log('Updating existing shipment at index:', existingIndex);
        window.shipmentOverviewData[existingIndex] = payload;
      } else {
        // Add new shipment to the beginning of the array
        console.log('Adding new shipment to overview data');
        window.shipmentOverviewData.unshift(payload);
      }

      console.log('Updated overview data after adding shipment:', window.shipmentOverviewData);
      console.log('New total shipments in overview:', window.shipmentOverviewData.length);

      // Save detailed data for shipment details page
      let existingDetailedData = {};
      if (typeof Storage !== "undefined") {
        try {
          existingDetailedData = JSON.parse(sessionStorage.getItem('inventra_detailed_shipments') || '{}');
        } catch (e) {
          console.error('Failed to load existing detailed data:', e);
        }
      }
      
      window.detailedShipmentData = existingDetailedData;
      window.detailedShipmentData[payload.id] = payload.detailedData;

      // Save to sessionStorage for persistence
      if (typeof Storage !== "undefined") {
        try {
          console.log('Saving to sessionStorage...');
          console.log('Data to save - overview:', window.shipmentOverviewData);
          console.log('Data to save - count:', window.shipmentOverviewData.length);
          
          sessionStorage.setItem('inventra_shipment_overview', JSON.stringify(window.shipmentOverviewData));
          sessionStorage.setItem('inventra_detailed_shipments', JSON.stringify(window.detailedShipmentData));
          sessionStorage.setItem('inventra_new_shipment_created', payload.id);
          
          // Verify the save immediately
          const verifyOverview = JSON.parse(sessionStorage.getItem('inventra_shipment_overview') || '[]');
          console.log('VERIFICATION: Saved overview data contains:', verifyOverview.length, 'shipments');
          console.log('VERIFICATION: Shipment IDs in storage:', verifyOverview.map(s => s.id));
          
          if (verifyOverview.length !== window.shipmentOverviewData.length) {
            console.error('MISMATCH: Storage save failed! Expected', window.shipmentOverviewData.length, 'got', verifyOverview.length);
            return false;
          }
          
        } catch (e) {
          console.error('Failed to save to sessionStorage:', e);
          return false;
        }
      }

      console.log('=== SAVE SHIPMENT SUCCESS ===');
      console.log('Final shipment count:', window.shipmentOverviewData.length);
      return true;
    } catch (e) {
      console.error('=== SAVE SHIPMENT FAILED ===', e);
      return false;
    }
  }

  // Save draft functionality
  function saveDraft(payload) {
    try {
      if (typeof Storage !== "undefined") {
        const key = 'inventra_shipment_drafts';
        const drafts = JSON.parse(sessionStorage.getItem(key) || '[]');
        
        // Remove existing draft with same ID
        const filteredDrafts = drafts.filter(d => d.id !== payload.id);
        
        // Add current draft to beginning
        filteredDrafts.unshift({
          ...payload,
          isDraft: true,
          savedAt: new Date().toISOString()
        });
        
        // Keep only last 20 drafts
        sessionStorage.setItem(key, JSON.stringify(filteredDrafts.slice(0, 20)));
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Failed to save draft:', e);
      return false;
    }
  }

  // Create Shipment button handler
  if (createBtn) {
    createBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const requiredFields = [
        'shipmentId', 'shipmentType', 'origin', 'destination', 'product', 'quantity',
        'expectedDeparture', 'expectedArrival', 'initialStatus', 'supplier'
      ];
      
      if (!validateRequired(requiredFields)) return;

      // Check if shipment ID already exists
      const shipmentId = readValue('shipmentId');
      
      // Load existing data first to check for duplicates
      let existingShipments = [];
      if (typeof Storage !== "undefined") {
        try {
          existingShipments = JSON.parse(sessionStorage.getItem('inventra_shipment_overview') || '[]');
        } catch (e) {
          console.log('Could not load existing shipments for duplicate check');
        }
      }
      
      if (existingShipments.find(s => s.id === shipmentId)) {
        showToast({ 
          title: 'Duplicate Shipment ID', 
          desc: `Shipment ${shipmentId} already exists. Please use a different ID.`, 
          type: 'error' 
        });
        document.getElementById('shipmentId').focus();
        return;
      }

      const payload = buildShipmentPayload();
      const success = saveShipmentData(payload);
      
      if (success) {
        showToast({ 
          title: 'Shipment Created Successfully', 
          desc: `${payload.id} has been added to the system.`, 
          type: 'success' 
        });
        
        // Clear form
        document.querySelectorAll('input, select, textarea').forEach(field => {
          if (field.type !== 'button') {
            field.value = '';
          }
        });
        
        // Redirect to overview page
        setTimeout(() => {
          window.location.href = 'shipping_overview.html';
        }, 1500);
      } else {
        showToast({ 
          title: 'Save Failed', 
          desc: 'Could not create the shipment. Please try again.', 
          type: 'error' 
        });
      }
    });
  }

  // Save Draft button handler
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const shipmentId = readValue('shipmentId');
      if (!shipmentId) {
        showToast({ 
          title: 'Shipment ID Required', 
          desc: 'Please enter a shipment ID before saving as draft.', 
          type: 'error' 
        });
        document.getElementById('shipmentId').focus();
        return;
      }

      const payload = buildShipmentPayload();
      const success = saveDraft(payload);
      
      if (success) {
        showToast({ 
          title: 'Draft Saved', 
          desc: `${payload.id} saved as draft.`, 
          type: 'success' 
        });
      } else {
        showToast({ 
          title: 'Save Failed', 
          desc: 'Could not save draft.', 
          type: 'error' 
        });
      }
    });
  }

  // Quick action buttons active-state toggle
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      if (this.classList.contains('active')) return;
      document.querySelectorAll('.action-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Mode toggle buttons in header
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const mode = this.textContent.trim();
      if (mode === 'Automation') {
        window.location.href = 'new_shipment_automated.html';
      }
    });
  });

  // Field validation on blur
  document.querySelectorAll('input[required], select[required]').forEach(field => {
    field.addEventListener('blur', function () {
      this.style.borderColor = this.value.trim() ? '#d1d5db' : '#dc2626';
      updateProgress();
    });
    field.addEventListener('input', function () {
      if (this.value.trim()) this.style.borderColor = '#d1d5db';
      updateProgress();
    });
  });

  // Auto-suggest shipment ID
  const shipmentIdField = document.querySelector('#shipmentId');
  if (shipmentIdField && !shipmentIdField.value) {
    const countries = ['MY', 'VN', 'AU', 'NZ', 'SG'];
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const suggestedId = `${randomCountry}-2025-${randomNumber.toString().padStart(3, '0')}`;
    shipmentIdField.placeholder = `e.g., ${suggestedId}`;
  }

  // Date validation: arrival cannot precede departure
  const departureDate = document.getElementById('expectedDeparture');
  const arrivalDate = document.getElementById('expectedArrival');
  
  if (departureDate && arrivalDate) {
    // Set minimum departure date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    departureDate.min = tomorrow.toISOString().split('T')[0];
    
    departureDate.addEventListener('change', function () {
      if (this.value) {
        arrivalDate.min = this.value;
        if (arrivalDate.value && arrivalDate.value < this.value) {
          arrivalDate.value = '';
          showToast({ 
            title: 'Invalid Date', 
            desc: 'Arrival date cannot be before departure date.', 
            type: 'error' 
          });
        }
      }
    });
  }

  // Sidebar navigation
  document.querySelectorAll('.nav-item a').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      this.closest('.nav-item')?.classList.add('active');
    });
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      createBtn?.click();
    }
    if (e.key === 'Escape') {
      window.location.href = 'shipping_overview.html';
    }
  });

  // Initialize progress
  updateProgress();

  // Add global debugging function
  window.debugShipments = function() {
    console.log('=== SHIPMENT DEBUG INFO ===');
    console.log('Window data:', window.shipmentOverviewData?.length || 0, 'shipments');
    
    if (typeof Storage !== "undefined") {
      try {
        const stored = JSON.parse(sessionStorage.getItem('inventra_shipment_overview') || '[]');
        console.log('SessionStorage data:', stored.length, 'shipments');
        console.log('Stored shipment IDs:', stored.map(s => s.id));
        console.log('Full stored data:', stored);
      } catch (e) {
        console.log('Failed to read sessionStorage:', e);
      }
    }
    console.log('=== END DEBUG INFO ===');
  };

  console.log('New Shipment Manual page initialized');
  console.log('Run debugShipments() in console to check shipment data');
});