document.addEventListener('DOMContentLoaded', function() {
  console.log('Shipping Overview page loading...');

  // Set current page for navigation
  try { 
    if (typeof Storage !== "undefined") {
      localStorage.setItem('currentPage', 'shipment'); 
    }
  } catch (e) {
    console.log('LocalStorage not available');
  }

  // Add global debugging functions immediately at the top
  window.debugShipments = function() {
    console.log('=== SHIPMENT DEBUG INFO ===');
    console.log('Window data:', window.shipmentOverviewData?.length || 0, 'shipments');
    console.log('Window shipment IDs:', window.shipmentOverviewData?.map(s => s.id) || []);
    
    if (typeof Storage !== "undefined") {
      try {
        const stored = JSON.parse(sessionStorage.getItem('inventra_shipment_overview') || '[]');
        console.log('SessionStorage data:', stored.length, 'shipments');
        console.log('Stored shipment IDs:', stored.map(s => s.id));
        console.log('Full stored data:', stored);
        
        // Check other storage keys
        const updates = JSON.parse(sessionStorage.getItem('inventra_shipment_updates') || '{}');
        console.log('Stored updates:', Object.keys(updates));
        
        const detailed = JSON.parse(sessionStorage.getItem('inventra_detailed_shipments') || '{}');
        console.log('Stored detailed shipments:', Object.keys(detailed));
        
        // Check all inventra keys
        const inventraKeys = Object.keys(sessionStorage).filter(key => key.includes('inventra'));
        console.log('All inventra storage keys:', inventraKeys);
        
      } catch (e) {
        console.log('Failed to read sessionStorage:', e);
      }
    }
    console.log('=== END DEBUG INFO ===');
  };

  // Add function to manually clear storage
  window.clearShipmentStorage = function() {
    if (typeof Storage !== "undefined") {
      const keys = Object.keys(sessionStorage).filter(key => key.includes('inventra'));
      keys.forEach(key => sessionStorage.removeItem(key));
      console.log('Cleared storage keys:', keys);
      location.reload();
    }
  };

  // Add function to manually add a test shipment
  window.addTestShipment = function() {
    const testShipment = {
      id: 'TEST-' + Date.now(),
      type: 'Incoming',
      route: 'Test → Location',
      product: 'Test Product',
      quantity: '1 Unit',
      eta: new Date().toLocaleDateString('en-GB'),
      status: 'Processing',
      statusClass: 'status-processing',
      lastUpdated: new Date().toISOString()
    };
    
    window.shipmentOverviewData.unshift(testShipment);
    sessionStorage.setItem('inventra_shipment_overview', JSON.stringify(window.shipmentOverviewData));
    console.log('Added test shipment:', testShipment.id);
    refreshShipmentData();
  };

  console.log('Debug functions available:');
  console.log('- debugShipments() - Check current shipment data');
  console.log('- clearShipmentStorage() - Reset all data');
  console.log('- addTestShipment() - Add a test shipment');

  // Initialize shipment overview data
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

  console.log('Initial shipment overview data:', window.shipmentOverviewData);

  // Load updates from sessionStorage on page load
  function loadUpdatesFromStorage() {
    if (typeof Storage !== "undefined") {
      try {
        // Load shipment updates first
        const savedUpdates = JSON.parse(sessionStorage.getItem('inventra_shipment_updates') || '{}');
        console.log('Loaded updates from storage:', savedUpdates);
        
        // Load new shipments from manual entry - THIS IS CRITICAL
        const savedOverview = JSON.parse(sessionStorage.getItem('inventra_shipment_overview') || '[]');
        console.log('Raw sessionStorage data:', sessionStorage.getItem('inventra_shipment_overview'));
        
        if (savedOverview.length > 0) {
          console.log('Found saved overview data with', savedOverview.length, 'shipments:', savedOverview);
          console.log('Shipment IDs from storage:', savedOverview.map(s => s.id));

          // Remove the specific shipment AU-12345 if present and ensure defaults exist
          const filtered = savedOverview.filter(s => s.id !== 'AU-12345');
          let merged = [...filtered];
          DEFAULT_OVERVIEW_SHIPMENTS.forEach(base => {
            if (!merged.some(s => s.id === base.id)) merged.push(base);
          });

          // Update the overview data and persist
          window.shipmentOverviewData = merged; // Create new array to avoid reference issues
          try {
            sessionStorage.setItem('inventra_shipment_overview', JSON.stringify(window.shipmentOverviewData));
          } catch (e) {
            console.log('Failed to persist cleaned overview data');
          }

          console.log('Updated window.shipmentOverviewData to:', window.shipmentOverviewData);
          console.log('Final window shipment IDs:', window.shipmentOverviewData.map(s => s.id));
        } else {
          console.log('No saved overview data found, keeping default data');
          console.log('Default data shipment IDs:', window.shipmentOverviewData.map(s => s.id));
        }
        
        // Load detailed shipment data
        const savedDetailed = JSON.parse(sessionStorage.getItem('inventra_detailed_shipments') || '{}');
        if (Object.keys(savedDetailed).length > 0) {
          window.detailedShipmentData = savedDetailed;
          // Remove AU-12345 detailed record if present and persist
          if (window.detailedShipmentData['AU-12345']) {
            delete window.detailedShipmentData['AU-12345'];
            try {
              sessionStorage.setItem('inventra_detailed_shipments', JSON.stringify(window.detailedShipmentData));
            } catch (e) {
              console.log('Failed to persist cleaned detailed shipment data');
            }
          }
          console.log('Loaded detailed shipment data:', Object.keys(window.detailedShipmentData));
        }
        
        if (Object.keys(savedUpdates).length > 0) {
          // Apply saved updates to overview data
          Object.keys(savedUpdates).forEach(shipmentId => {
            const updatedData = savedUpdates[shipmentId];
            const shipmentIndex = window.shipmentOverviewData.findIndex(s => s.id === shipmentId);
            
            if (shipmentIndex >= 0) {
              // Update the shipment data
              window.shipmentOverviewData[shipmentIndex] = {
                ...window.shipmentOverviewData[shipmentIndex],
                status: updatedData.status,
                statusClass: getStatusClass(updatedData.status),
                eta: updatedData.formattedETA || window.shipmentOverviewData[shipmentIndex].eta,
                lastUpdated: updatedData.lastUpdated
              };
              console.log('Applied update to shipment:', shipmentId);
            }
          });
          
          // Store in window.shipmentUpdates for compatibility
          window.shipmentUpdates = savedUpdates;
        }
        
        // Check for newly created shipments
        const newShipmentId = sessionStorage.getItem('inventra_new_shipment_created');
        if (newShipmentId) {
          sessionStorage.removeItem('inventra_new_shipment_created');
          console.log('New shipment detected:', newShipmentId);
          
          // Show notification for new shipment
          setTimeout(() => {
            showNewShipmentNotification(newShipmentId);
          }, 500);
        }
        
        console.log('Final shipment overview data after loading:', window.shipmentOverviewData);
        console.log('Final count after loading:', window.shipmentOverviewData.length);
        
      } catch (e) {
        console.log('Could not load updates from storage', e);
      }
    }
  }

  // Call this immediately when page loads
  loadUpdatesFromStorage();

  // Function to map status to CSS class
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

  // Function to update KPIs based on current shipment data
  function updateKPIDisplay() {
    const shipments = window.shipmentOverviewData || [];
    console.log('Updating KPIs with shipments:', shipments);
    
    // Calculate KPIs
    const activeShipments = shipments.filter(s => 
      !['delivered', 'cancelled'].includes(s.status.toLowerCase())
    ).length;
    
    const delayedShipments = shipments.filter(s => 
      s.status.toLowerCase() === 'delayed'
    ).length;
    
    const deliveredOnTime = shipments.filter(s => {
      if (s.status.toLowerCase() === 'delivered') {
        return Math.random() > 0.2; // Simulate 80% on-time rate
      }
      return false;
    }).length;
    
    const totalCompleted = shipments.filter(s => 
      s.status.toLowerCase() === 'delivered'
    ).length;
    
    const onTimeRate = totalCompleted > 0 ? 
      Math.round((deliveredOnTime / totalCompleted) * 100) : 87;
    
    // Estimate pallets (mock calculation)
    const palletsInTransit = shipments.reduce((total, shipment) => {
      if (!['delivered', 'cancelled'].includes(shipment.status.toLowerCase())) {
        if (shipment.quantity.includes('Tons')) {
          const tons = parseFloat(shipment.quantity);
          return total + Math.round(tons * 10);
        } else if (shipment.quantity.includes('Units')) {
          const units = parseFloat(shipment.quantity);
          return total + Math.round(units / 5);
        }
      }
      return total;
    }, 0);

    // Update KPI displays
    const kpiCards = document.querySelectorAll('.kpi-card');
    
    if (kpiCards[0]) {
      const activeShipmentsValue = kpiCards[0].querySelector('.kpi-value');
      if (activeShipmentsValue) {
        activeShipmentsValue.textContent = activeShipments;
        animateValueChange(activeShipmentsValue);
      }
    }
    
    if (kpiCards[1]) {
      const onTimeRateValue = kpiCards[1].querySelector('.kpi-value');
      if (onTimeRateValue) {
        onTimeRateValue.textContent = `${onTimeRate}%`;
        animateValueChange(onTimeRateValue);
      }
    }
    
    if (kpiCards[2]) {
      const delaysValue = kpiCards[2].querySelector('.kpi-value');
      if (delaysValue) {
        delaysValue.textContent = delayedShipments;
        animateValueChange(delaysValue);
      }
    }
    
    if (kpiCards[3]) {
      const palletsValue = kpiCards[3].querySelector('.kpi-value');
      if (palletsValue) {
        palletsValue.textContent = palletsInTransit || 156;
        animateValueChange(palletsValue);
      }
    }

    console.log('KPIs updated:', { activeShipments, delayedShipments, onTimeRate, palletsInTransit });
  }

  // Function to animate value changes
  function animateValueChange(element) {
    element.style.transform = 'scale(1.1)';
    element.style.color = '#3F7AB0';
    element.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.color = '';
    }, 300);
  }

  // Function to update the shipments table
  function updateShipmentsTable() {
    console.log('Updating shipments table...');
    const tableBody = document.querySelector('.order-table tbody');
    if (!tableBody) {
      console.log('Table body not found');
      return;
    }

    // Clear and rebuild table
    tableBody.innerHTML = '';
    
    // Sort shipments by last updated (most recent first)
    const sortedShipments = [...window.shipmentOverviewData].sort((a, b) => 
      new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0)
    );

    console.log('Building table with shipments:', sortedShipments);

    sortedShipments.forEach(shipment => {
      const row = document.createElement('tr');
      
      // Check if this shipment was recently updated
      const lastUpdatedShipment = typeof Storage !== "undefined" ? 
        sessionStorage.getItem('lastUpdatedShipment') : null;
      const isRecentlyUpdated = lastUpdatedShipment === shipment.id || 
        (window.shipmentUpdates && 
         window.shipmentUpdates[shipment.id] && 
         (Date.now() - new Date(shipment.lastUpdated).getTime()) < 300000); // 5 minutes
      
      if (isRecentlyUpdated) {
        row.classList.add('recently-updated');
        console.log('Marking shipment as recently updated:', shipment.id);
      }
      
      row.innerHTML = `
        <td>
          ${shipment.id}
          ${isRecentlyUpdated ? '<span class="updated-indicator" title="Recently Updated">●</span>' : ''}
        </td>
        <td>${shipment.type}</td>
        <td>${shipment.route}</td>
        <td>${shipment.product}</td>
        <td>${shipment.quantity}</td>
        <td>${shipment.eta}</td>
        <td>
          <span class="status-pill ${shipment.statusClass}">
            ${shipment.status}
          </span>
        </td>
      `;
      
      // Add click handler for row
      row.addEventListener('click', () => {
        if (shipment.id) {
          window.location.href = `shipment_details.html?id=${shipment.id}`;
        }
      });
      
      // Add hover effect
      row.style.cursor = 'pointer';
      row.addEventListener('mouseenter', () => {
        row.style.backgroundColor = '#f8fafc';
      });
      row.addEventListener('mouseleave', () => {
        row.style.backgroundColor = '';
      });
      
      tableBody.appendChild(row);
    });

    // Add animations for newly updated rows - DISABLED
    // setTimeout(() => {
    //   document.querySelectorAll('.recently-updated').forEach(row => {
    //     row.style.animation = 'highlightRow 2s ease-in-out';
    //   });
    // }, 100);

    // Clear the recently updated flag
    if (typeof Storage !== "undefined") {
      try {
        sessionStorage.removeItem('lastUpdatedShipment');
      } catch (e) {
        console.log('Could not clear lastUpdatedShipment flag');
      }
    }
  }

  // Function to show new shipment notification
  function showNewShipmentNotification(shipmentId) {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 24px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #059669;
      border-radius: 10px;
      padding: 12px 16px;
      box-shadow: 0 6px 24px rgba(0,0,0,0.15);
      z-index: 1000;
      font-family: 'DM Sans', sans-serif;
      max-width: 300px;
      animation: slideInFromRight 0.5s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <i class="fas fa-plus-circle" style="color: #059669;"></i>
        <strong style="color: #1e293b;">New Shipment Created</strong>
      </div>
      <div style="color: #64748b; font-size: 13px;">
        ${shipmentId} has been added to your shipments
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutToRight 0.5s ease-in';
      setTimeout(() => notification.remove(), 500);
    }, 4000);
  }

  // Function to refresh data
  function refreshShipmentData() {
    console.log('Refreshing shipment data...');
    loadUpdatesFromStorage(); // Reload from storage
    updateShipmentsTable();
    updateKPIDisplay();
    // showUpdateNotification(); // Removed per user request
  }

  // Add CSS animations
  function addAnimationStyles() {
    if (!document.getElementById('overview-animations')) {
      const style = document.createElement('style');
      style.id = 'overview-animations';
      style.textContent = `
        @keyframes highlightRow {
          0% { background-color: rgba(59, 130, 246, 0.1); }
          50% { background-color: rgba(59, 130, 246, 0.2); }
          100% { background-color: transparent; }
        }
        
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutToRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .recently-updated {
          border-left: 3px solid #059669 !important;
        }
        
        .updated-indicator {
          color: #059669;
          font-size: 12px;
          margin-left: 4px;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .order-table tbody tr {
          transition: all 0.2s ease;
        }
        
        .kpi-value {
          transition: all 0.3s ease;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Quick actions active state
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      if (this.classList.contains('active')) return;
      document.querySelectorAll('.action-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Sidebar navigation active state
  document.querySelectorAll('.nav-item a').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      this.closest('.nav-item')?.classList.add('active');
    });
  });

  // Make updateKPIDisplay available globally for the update page
  window.updateKPIDisplay = updateKPIDisplay;

  // Listen for shipment update events
  window.addEventListener('shipmentUpdated', (event) => {
    console.log('Received shipment update event:', event.detail);
    refreshShipmentData();
  });

  // Listen for storage events (if using sessionStorage in other tabs)
  window.addEventListener('storage', (e) => {
    if (e.key === 'inventra_shipment_updates') {
      console.log('Storage event detected, refreshing data');
      refreshShipmentData();
    }
  });

  // Add manual refresh button
  const cardHeader = document.querySelector('.card-header h3');
  if (cardHeader) {
    const refreshBtn = document.createElement('button');
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    refreshBtn.style.cssText = `
      background: none;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 8px;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-left: auto;
    `;
    refreshBtn.title = 'Refresh shipment data';
    
    refreshBtn.addEventListener('click', () => {
      refreshBtn.style.transform = 'rotate(360deg)';
      refreshBtn.style.transition = 'transform 0.5s ease';
      setTimeout(() => {
        refreshBtn.style.transform = '';
        refreshShipmentData();
      }, 500);
    });
    
    refreshBtn.addEventListener('mouseenter', () => {
      refreshBtn.style.backgroundColor = '#f8fafc';
      refreshBtn.style.borderColor = '#cbd5e1';
    });
    
    refreshBtn.addEventListener('mouseleave', () => {
      refreshBtn.style.backgroundColor = '';
      refreshBtn.style.borderColor = '#e2e8f0';
    });
    
    cardHeader.parentElement.style.display = 'flex';
    cardHeader.parentElement.style.alignItems = 'center';
    cardHeader.parentElement.appendChild(refreshBtn);
  }

  // Initialize everything
  addAnimationStyles();
  refreshShipmentData();
  
  // Periodic refresh removed - no more automatic animations every few seconds
  // The data will only update when user manually navigates or refreshes

  // Store page load time
  window.pageLoadTime = Date.now();

});