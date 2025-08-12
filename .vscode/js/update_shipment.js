document.addEventListener('DOMContentLoaded', () => {
  // Get shipment ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const shipmentId = urlParams.get('id') || 'VN-2024-089'; // Default fallback

  console.log('Loading update page for shipment:', shipmentId);

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

  // Load data from sessionStorage
  function loadDataFromStorage() {
    if (typeof Storage !== "undefined") {
      try {
        // Load overview data
        const savedOverview = JSON.parse(sessionStorage.getItem('inventra_shipment_overview') || '[]');
        if (savedOverview.length > 0) {
          const filtered = savedOverview.filter(s => s.id !== 'AU-12345');
          const merged = [...filtered];
          DEFAULT_OVERVIEW_SHIPMENTS.forEach(base => {
            if (!merged.some(s => s.id === base.id)) merged.push(base);
          });
          window.shipmentOverviewData = merged;
        }

        // Load detailed shipment data
        const savedDetailed = JSON.parse(sessionStorage.getItem('inventra_detailed_shipments') || '{}');
        if (Object.keys(savedDetailed).length > 0) {
          window.detailedShipmentData = savedDetailed;
        }

        // Load existing updates
        const savedUpdates = JSON.parse(sessionStorage.getItem('inventra_shipment_updates') || '{}');
        if (Object.keys(savedUpdates).length > 0) {
          window.shipmentUpdates = savedUpdates;
        }
      } catch (e) {
        console.log('Could not load data from storage');
      }
    }
  }

  // Load all data first
  loadDataFromStorage();

  // Find shipment data
  function findShipmentData() {
    // First try to find in overview data
    let shipment = window.shipmentOverviewData?.find(s => s.id === shipmentId);
    
    if (!shipment) {
      console.log('Shipment not found in overview data');
      return null;
    }

    // Try to get more detailed data if available
    if (window.detailedShipmentData && window.detailedShipmentData[shipmentId]) {
      const detailed = window.detailedShipmentData[shipmentId];
      // Merge overview and detailed data
      shipment = {
        ...shipment,
        carrier: detailed.carrier || shipment.carrier || '',
        containerNumber: detailed.containerNumber || '',
        billOfLading: detailed.billOfLading || '',
        estimatedCost: detailed.estimatedCost || '',
        currency: detailed.currency || 'USD',
        priority: detailed.priority || 'Standard',
        insurance: detailed.insurance || 'No',
        contacts: detailed.contacts || {},
        notes: detailed.notes || '',
        specialInstructions: detailed.specialInstructions || ''
      };
    }

    // Apply any existing updates
    if (window.shipmentUpdates && window.shipmentUpdates[shipmentId]) {
      const updates = window.shipmentUpdates[shipmentId];
      shipment = {
        ...shipment,
        status: updates.status || shipment.status,
        location: updates.location || '',
        eta: updates.eta || shipment.eta,
        reason: updates.reason || '',
        contact: updates.contact || shipment.carrier || '',
        notes: updates.notes || shipment.notes || ''
      };
    }

    return shipment;
  }

  // Get current shipment data
  const currentShipment = findShipmentData();

  if (!currentShipment) {
    alert(`Shipment ${shipmentId} not found. Redirecting to overview.`);
    window.location.href = 'shipping_overview.html';
    return;
  }

  console.log('Found shipment data:', currentShipment);

  // Update page title and shipment ID field
  document.title = `Update Shipment ${shipmentId} - Inventra`;
  
  // Set the shipment ID in the form
  const shipIdField = document.getElementById('shipId');
  if (shipIdField) {
    shipIdField.value = shipmentId;
  }

  // Populate form with current shipment data
  function populateForm() {
    // Status
    const statusSelect = document.getElementById('statusSelect');
    if (statusSelect && currentShipment.status) {
      // Map display status to form values
      const statusMap = {
        'Delayed': 'Delayed',
        'In Transit': 'In Transit', 
        'At Customs': 'At Customs',
        'Delivered': 'Delivered',
        'Processing': 'Processing'
      };
      
      const formStatus = statusMap[currentShipment.status] || currentShipment.status;
      statusSelect.value = formStatus;
    }

    // Location
    const locationField = document.getElementById('location');
    if (locationField && currentShipment.location) {
      locationField.value = currentShipment.location;
    }

    // ETA
    const etaField = document.getElementById('eta');
    if (etaField && currentShipment.eta) {
      // Try to parse the ETA and set the datetime-local field
      try {
        const etaDate = new Date(currentShipment.eta);
        if (!isNaN(etaDate.getTime())) {
          etaField.value = etaDate.toISOString().slice(0, 16);
        }
      } catch (e) {
        console.log('Could not parse ETA date:', currentShipment.eta);
      }
    }

    // Reason (for delays)
    const reasonField = document.getElementById('reason');
    if (reasonField && currentShipment.reason) {
      reasonField.value = currentShipment.reason;
    }

    // Contact
    const contactField = document.getElementById('contact');
    if (contactField) {
      contactField.value = currentShipment.contact || currentShipment.carrier || '';
    }

    // Notes
    const notesField = document.getElementById('notes');
    if (notesField && currentShipment.notes) {
      notesField.value = currentShipment.notes;
    }

    console.log('Form populated with shipment data');
  }

  // Populate the form
  populateForm();

  // Update alert banner based on shipment status
  function updateAlertBanner() {
    const alertBanner = document.querySelector('.alert-banner');
    if (alertBanner && currentShipment.status === 'Delayed') {
      alertBanner.style.display = 'flex';
    } else if (alertBanner) {
      alertBanner.style.display = 'none';
    }
  }

  updateAlertBanner();

  // Quick actions active state
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      if (this.classList.contains('active')) return;
      document.querySelectorAll('.action-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Status tag reflects status select
  const statusSelect = document.getElementById('statusSelect');
  const statusTag = document.getElementById('status-tag');
  
  function updateStatusTag() {
    if (!statusSelect || !statusTag) return;
    
    const val = statusSelect.value.toLowerCase();
    statusTag.textContent = statusSelect.value;
    statusTag.className = 'status-tag';
    const map = {
      delayed: ['#fef2f2', '#fecaca', '#b91c1c'],
      'in transit': ['#eff6ff', '#bfdbfe', '#1d4ed8'],
      'at customs': ['#fffbeb', '#fde68a', '#b45309'],
      delivered: ['#ecfdf5', '#bbf7d0', '#059669'],
      processing: ['#f1f5f9', '#e2e8f0', '#334155']
    };
    const c = map[val] || map.processing;
    statusTag.style.background = c[0];
    statusTag.style.borderColor = c[1];
    statusTag.style.color = c[2];
  }
  
  statusSelect?.addEventListener('change', updateStatusTag);
  updateStatusTag();

  // File upload interactions
  const fileUpload = document.getElementById('file-upload');
  const fileInput = document.getElementById('file-input');
  const fileList = document.getElementById('file-list');
  
  fileUpload?.addEventListener('click', () => fileInput?.click());
  
  fileInput?.addEventListener('change', function () {
    fileList.innerHTML = '';
    Array.from(this.files || []).forEach(file => {
      const item = document.createElement('div');
      item.className = 'file-item';
      item.innerHTML = `<span>${file.name} (${Math.ceil(file.size/1024)} KB)</span><button class="remove-file">Remove</button>`;
      item.querySelector('.remove-file')?.addEventListener('click', () => item.remove());
      fileList.appendChild(item);
    });
  });

  // Function to get current shipment data
  function getCurrentShipmentData() {
    const status = document.getElementById('statusSelect')?.value || currentShipment.status;
    const location = document.getElementById('location')?.value || '';
    const eta = document.getElementById('eta')?.value || '';
    const reason = document.getElementById('reason')?.value || '';
    const contact = document.getElementById('contact')?.value || '';
    const notes = document.getElementById('notes')?.value || '';
    
    // Format ETA for display
    let formattedETA = '';
    if (eta) {
      const etaDate = new Date(eta);
      formattedETA = etaDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }

    return {
      id: shipmentId, // Use the dynamic shipment ID
      status: status,
      location: location,
      eta: eta,
      formattedETA: formattedETA,
      reason: reason,
      contact: contact,
      notes: notes,
      lastUpdated: new Date().toISOString()
    };
  }

  // Function to get status CSS class
  function getStatusClass(status) {
    const statusMap = {
      'delayed': 'status-delayed',
      'in transit': 'status-processing',
      'at customs': 'status-processing',
      'delivered': 'status-delivered',
      'processing': 'status-processing'
    };
    return statusMap[status.toLowerCase()] || 'status-processing';
  }

  // Function to save shipment data and update overview data directly
  function saveShipmentData(shipmentData) {
    console.log('Saving shipment data:', shipmentData);
    
    // Initialize updates tracker
    if (!window.shipmentUpdates) {
      window.shipmentUpdates = {};
    }
    
    // Save to updates tracker
    window.shipmentUpdates[shipmentData.id] = shipmentData;
    
    // Update the overview data directly
    if (window.shipmentOverviewData) {
      const shipmentIndex = window.shipmentOverviewData.findIndex(s => s.id === shipmentData.id);
      
      if (shipmentIndex >= 0) {
        // Update existing shipment
        const existingShipment = window.shipmentOverviewData[shipmentIndex];
        window.shipmentOverviewData[shipmentIndex] = {
          ...existingShipment,
          status: shipmentData.status,
          statusClass: getStatusClass(shipmentData.status),
          eta: shipmentData.formattedETA || existingShipment.eta,
          lastUpdated: shipmentData.lastUpdated
        };
        
        console.log('Updated shipment in overview data:', window.shipmentOverviewData[shipmentIndex]);
      } else {
        console.log('Shipment not found in overview data');
      }
    } else {
      console.log('Overview data not found');
    }
    
    // Also store in a cross-page variable
    if (typeof Storage !== "undefined") {
      try {
        const existingUpdates = JSON.parse(sessionStorage.getItem('inventra_shipment_updates') || '{}');
        existingUpdates[shipmentData.id] = shipmentData;
        sessionStorage.setItem('inventra_shipment_updates', JSON.stringify(existingUpdates));
        console.log('Saved to sessionStorage');
      } catch (e) {
        console.log('SessionStorage not available');
      }
    }
    
    return true;
  }

  // Function to create success notification
  function showSuccessNotification(message) {
    // Remove any existing toasts
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.style.cssText = `
      position: fixed;
      right: 24px;
      top: 24px;
      background: #fff;
      border-left: 4px solid #059669;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 16px;
      box-shadow: 0 6px 24px rgba(0,0,0,0.15);
      z-index: 1000;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      color: #1e293b;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation keyframes
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Auto remove with slide out animation
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Function to update KPIs based on shipment changes
  function updateOverviewKPIs() {
    if (window.updateKPIDisplay) {
      window.updateKPIDisplay();
    }
  }

  // Save button with enhanced functionality
  const saveBtn = document.getElementById('saveBtn');
  saveBtn?.addEventListener('click', function (e) {
    e.preventDefault();
    
    // Validate required fields
    const statusSelect = document.getElementById('statusSelect');
    
    if (!statusSelect || !statusSelect.value) {
      alert('Please select a status before saving.');
      return;
    }
    
    // Disable button and show loading state
    this.disabled = true;
    const originalHTML = this.innerHTML;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    // Get current form data
    const shipmentData = getCurrentShipmentData();
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Save the data
        const success = saveShipmentData(shipmentData);
        
        if (success) {
          // Update KPIs
          updateOverviewKPIs();
          
          // Show success notification
          showSuccessNotification('Shipment updated successfully! Changes will appear in overview.');
          
          // Log the update for debugging
          console.log('Shipment update saved:', {
            id: shipmentData.id,
            newStatus: shipmentData.status,
            newETA: shipmentData.formattedETA,
            location: shipmentData.location,
            timestamp: new Date().toLocaleString()
          });
          
          // Create a custom event to notify other pages
          const updateEvent = new CustomEvent('shipmentUpdated', {
            detail: shipmentData
          });
          window.dispatchEvent(updateEvent);
          
          // Set a flag for the overview page
          if (typeof Storage !== "undefined") {
            try {
              sessionStorage.setItem('lastUpdatedShipment', shipmentData.id);
            } catch (e) {
              console.log('SessionStorage not available');
            }
          }
          
          // Optionally redirect to overview after a delay - DISABLED popup
          setTimeout(() => {
            // Automatically redirect without confirmation popup
            window.location.href = 'shipping_overview.html';
          }, 1500);
          
        } else {
          throw new Error('Failed to save shipment data');
        }
        
      } catch (error) {
        console.error('Error saving shipment:', error);
        showErrorNotification('Failed to save shipment. Please try again.');
      } finally {
        // Reset button state
        this.disabled = false;
        this.innerHTML = originalHTML;
      }
    }, 1200);
  });

  // Function to show error notification
  function showErrorNotification(message) {
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.style.cssText = `
      position: fixed;
      right: 24px;
      top: 24px;
      background: #fff;
      border-left: 4px solid #dc2626;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 16px;
      box-shadow: 0 6px 24px rgba(0,0,0,0.15);
      z-index: 1000;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      color: #1e293b;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Sidebar nav active-state handling
  document.querySelectorAll('.nav-item a').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      this.closest('.nav-item')?.classList.add('active');
    });
  });

  // Load saved data if available
  function loadSavedData() {
    if (typeof Storage !== "undefined") {
      try {
        const savedUpdates = JSON.parse(sessionStorage.getItem('inventra_shipment_updates') || '{}');
        
        if (savedUpdates[shipmentId]) {
          const savedData = savedUpdates[shipmentId];
          
          // Populate form with saved data
          if (savedData.status && statusSelect) statusSelect.value = savedData.status;
          if (savedData.location) document.getElementById('location').value = savedData.location;
          if (savedData.eta) document.getElementById('eta').value = savedData.eta;
          if (savedData.reason) document.getElementById('reason').value = savedData.reason;
          if (savedData.contact) document.getElementById('contact').value = savedData.contact;
          if (savedData.notes) document.getElementById('notes').value = savedData.notes;
          
          updateStatusTag();
          console.log('Loaded saved data for shipment:', shipmentId);
        }
      } catch (e) {
        console.log('Could not load saved data');
      }
    }
  }

  // Initialize with current shipment data if available
  loadSavedData();

  // Auto-save functionality (optional)
  let autoSaveTimeout;
  const formInputs = document.querySelectorAll('#statusSelect, #location, #eta, #reason, #contact, #notes');
  
  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(() => {
        console.log('Auto-saving draft...');
        // You could implement draft saving here
      }, 2000);
    });
  });

  console.log('Update shipment page initialized');
});