document.addEventListener('DOMContentLoaded', function() {
  console.log('Shipment Details page loading...');

  // Get shipment ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const shipmentId = urlParams.get('id');

  if (!shipmentId) {
    console.error('No shipment ID provided');
    // Redirect back to overview if no ID
    window.location.href = 'shipping_overview.html';
    return;
  }

  // Mock detailed shipment data
  const detailedShipmentData = {
    'MY-2024-142': {
      id: 'MY-2024-142',
      type: 'Incoming',
      status: 'In Transit',
      priority: 'Standard',
      created: '2025-06-01',
      eta: '15 Jun 2025',
      carrier: 'Malaysia Shipping Co.',
      route: 'Malaysia → Singapore',
      product: {
        name: 'Pinewood Raw Material',
        quantity: '2.4 Tons',
        weight: '2,400 kg',
        dimensions: '2.5m × 1.2m × 0.8m',
        value: '$12,500 USD'
      },
      origin: {
        location: 'Port Klang, Malaysia',
        time: '2025-06-01 09:00'
      },
      current: {
        location: 'Strait of Malacca',
        time: '2025-06-12 14:30'
      },
      destination: {
        location: 'Singapore Port',
        time: '2025-06-15 16:00 (ETA)'
      },
      contacts: {
        shipper: {
          name: 'Malaysia Timber Export Sdn Bhd',
          phone: '+60 3 2345 6789',
          email: 'export@malaytimber.com'
        },
        receiver: {
          name: 'Singapore Wood Industries',
          phone: '+65 6234 5678',
          email: 'procurement@sgwood.com'
        }
      },
      timeline: [
        {
          status: 'completed',
          title: 'Order Placed',
          description: 'Purchase order confirmed and shipment scheduled',
          time: '2025-06-01 09:00',
          location: 'Port Klang, Malaysia'
        },
        {
          status: 'completed',
          title: 'Goods Loaded',
          description: 'Container loaded and sealed for transport',
          time: '2025-06-01 14:30',
          location: 'Port Klang, Malaysia'
        },
        {
          status: 'completed',
          title: 'Departed Origin Port',
          description: 'Vessel departed from Port Klang',
          time: '2025-06-02 08:00',
          location: 'Port Klang, Malaysia'
        },
        {
          status: 'current',
          title: 'In Transit',
          description: 'Currently sailing through Strait of Malacca',
          time: '2025-06-12 14:30',
          location: 'Strait of Malacca'
        },
        {
          status: 'pending',
          title: 'Arrival at Destination',
          description: 'Expected arrival at Singapore Port',
          time: '2025-06-15 16:00 (ETA)',
          location: 'Singapore Port'
        }
      ],
      documents: [
        { name: 'Bill of Lading', type: 'pdf', size: '245 KB' },
        { name: 'Commercial Invoice', type: 'pdf', size: '156 KB' },
        { name: 'Packing List', type: 'pdf', size: '89 KB' },
        { name: 'Certificate of Origin', type: 'pdf', size: '134 KB' }
      ],
      notes: 'Priority shipment for production line. Handle with care - premium grade timber. Contact receiver 24 hours before arrival.',
      lastUpdated: '2025-06-12 14:30'
    },
    'VN-2024-089': {
      id: 'VN-2024-089',
      type: 'Incoming',
      status: 'Delayed',
      priority: 'High',
      created: '2025-05-20',
      eta: '30 May 2025',
      carrier: 'Vietnam Logistics Co.',
      route: 'Vietnam → Singapore → Malaysia',
      product: {
        name: 'Pinewood Raw Material',
        quantity: '30 Units',
        weight: '1,200 kg',
        dimensions: '2.0m × 1.0m × 0.6m',
        value: '$8,750 USD'
      },
      origin: {
        location: 'Ho Chi Minh Port, Vietnam',
        time: '2025-05-20 10:00'
      },
      current: {
        location: 'Ho Chi Minh Port, Vietnam',
        time: '2025-05-25 16:00'
      },
      destination: {
        location: 'Johor Port, Malaysia',
        time: '2025-06-02 10:00 (Revised ETA)'
      },
      contacts: {
        shipper: {
          name: 'Vietnam Wood Export Ltd',
          phone: '+84 28 3456 7890',
          email: 'export@vnwood.vn'
        },
        receiver: {
          name: 'Malaysia Furniture Co.',
          phone: '+60 7 234 5678',
          email: 'supply@myfurniture.my'
        }
      },
      timeline: [
        {
          status: 'completed',
          title: 'Order Placed',
          description: 'Purchase order confirmed',
          time: '2025-05-20 10:00',
          location: 'Ho Chi Minh Port, Vietnam'
        },
        {
          status: 'completed',
          title: 'Goods Prepared',
          description: 'Items prepared for shipment',
          time: '2025-05-21 09:00',
          location: 'Ho Chi Minh Port, Vietnam'
        },
        {
          status: 'current',
          title: 'Port Congestion Delay',
          description: 'Shipment delayed due to port congestion',
          time: '2025-05-25 16:00',
          location: 'Ho Chi Minh Port, Vietnam'
        },
        {
          status: 'pending',
          title: 'Departure Scheduled',
          description: 'New departure date scheduled',
          time: '2025-05-30 08:00 (Scheduled)',
          location: 'Ho Chi Minh Port, Vietnam'
        },
        {
          status: 'pending',
          title: 'Arrival at Destination',
          description: 'Revised arrival at Johor Port',
          time: '2025-06-02 10:00 (Revised ETA)',
          location: 'Johor Port, Malaysia'
        }
      ],
      documents: [
        { name: 'Commercial Invoice', type: 'pdf', size: '178 KB' },
        { name: 'Packing List', type: 'pdf', size: '92 KB' },
        { name: 'Export License', type: 'pdf', size: '123 KB' },
        { name: 'Delay Notification', type: 'pdf', size: '67 KB' }
      ],
      notes: 'DELAYED: Port congestion at Ho Chi Minh causing 5-day delay. Alternative shipping routes being evaluated. Customer has been notified.',
      lastUpdated: '2025-05-25 16:00'
    }
  };

  // Load saved updates from session storage and detailed shipment data
  function loadUpdatesFromStorage() {
    if (typeof Storage !== "undefined") {
      try {
        const savedUpdates = JSON.parse(sessionStorage.getItem('inventra_shipment_updates') || '{}');
        
        // Load detailed shipment data created from manual entry
        const savedDetailed = JSON.parse(sessionStorage.getItem('inventra_detailed_shipments') || '{}');
        if (Object.keys(savedDetailed).length > 0) {
          // Merge with existing detailed data
          Object.assign(detailedShipmentData, savedDetailed);
          console.log('Loaded detailed shipment data from storage:', savedDetailed);
        }
        
        return savedUpdates[shipmentId] || null;
      } catch (e) {
        console.log('Could not load updates from storage');
        return null;
      }
    }
    return null;
  }

  // Get shipment data and apply any updates
  function getShipmentData() {
    // First check if this shipment exists in detailed data (from manual entry)
    const savedDetailed = loadUpdatesFromStorage(); // This also loads detailed shipment data
    
    let shipmentData = detailedShipmentData[shipmentId];
    
    if (!shipmentData) {
      console.log('Shipment not found in detailed data, trying to create from overview data');
      
      // Try to get from overview data and create detailed data
      const overviewData = window.shipmentOverviewData?.find(s => s.id === shipmentId);
      if (overviewData) {
        console.log('Found shipment in overview data, creating detailed data');
        shipmentData = createDetailedDataFromOverview(overviewData);
      }
    }
    
    if (!shipmentData) {
      console.error('Shipment not found:', shipmentId);
      return null;
    }

    // Apply any saved updates
    if (savedDetailed) {
      shipmentData = {
        ...shipmentData,
        status: savedDetailed.status || shipmentData.status,
        eta: savedDetailed.formattedETA || shipmentData.eta,
        lastUpdated: savedDetailed.lastUpdated || shipmentData.lastUpdated,
        current: {
          ...shipmentData.current,
          location: savedDetailed.location || shipmentData.current.location
        },
        notes: savedDetailed.notes || shipmentData.notes
      };
      console.log('Applied saved updates to shipment data');
    }

    return shipmentData;
  }

  // Function to create detailed data from overview data
  function createDetailedDataFromOverview(overviewData) {
    const routeParts = overviewData.route.split(' → ');
    const origin = routeParts[0] || 'Unknown';
    const destination = routeParts[1] || 'Unknown';
    
    return {
      id: overviewData.id,
      type: overviewData.type,
      status: overviewData.status,
      priority: 'Standard',
      created: new Date().toISOString().split('T')[0],
      eta: overviewData.eta,
      carrier: 'TBD',
      route: overviewData.route,
      
      product: {
        name: overviewData.product,
        quantity: overviewData.quantity,
        weight: 'TBD',
        dimensions: 'TBD',
        value: 'TBD'
      },
      
      origin: {
        location: `${origin} Port`,
        time: new Date().toISOString()
      },
      
      current: {
        location: overviewData.status === 'Processing' ? `${origin} Port` : 'In Transit',
        time: new Date().toISOString()
      },
      
      destination: {
        location: `${destination} Port`,
        time: `${overviewData.eta} (ETA)`
      },
      
      contacts: {
        shipper: {
          name: 'TBD',
          phone: 'TBD',
          email: 'TBD'
        },
        receiver: {
          name: 'TBD',
          phone: 'TBD',
          email: 'TBD'
        }
      },
      
      timeline: [
        {
          status: 'completed',
          title: 'Order Placed',
          description: 'Shipment created',
          time: new Date().toLocaleString('en-GB'),
          location: `${origin} Port`
        },
        {
          status: overviewData.status.toLowerCase() === 'processing' ? 'current' : 'completed',
          title: overviewData.status,
          description: `Shipment ${overviewData.status.toLowerCase()}`,
          time: new Date().toLocaleString('en-GB'),
          location: overviewData.status === 'Processing' ? `${origin} Port` : 'In Transit'
        }
      ],
      
      documents: [
        { name: 'Shipment Order', type: 'pdf', size: '125 KB' }
      ],
      
      notes: 'Shipment created from overview data.',
      lastUpdated: overviewData.lastUpdated || new Date().toISOString()
    };
  }

  const shipmentData = getShipmentData();
  
  if (!shipmentData) {
    // Show error message and redirect
    alert('Shipment not found');
    window.location.href = 'shipping_overview.html';
    return;
  }

  // Update page title and breadcrumb
  document.getElementById('shipment-id').textContent = shipmentData.id;
  document.getElementById('page-title').textContent = `Shipment ${shipmentData.id}`;
  document.title = `Shipment ${shipmentData.id} - Inventra`;

  // Update edit button link
  document.getElementById('edit-btn').href = `update_shipment.html?id=${shipmentId}`;

  // Populate status overview
  function populateStatusOverview() {
    const statusCard = document.getElementById('status-card');
    const statusIcon = document.getElementById('status-icon');
    const currentStatus = document.getElementById('current-status');
    const lastUpdated = document.getElementById('last-updated');

    // Set status
    currentStatus.textContent = shipmentData.status;
    
    // Format last updated time
    const lastUpdateTime = new Date(shipmentData.lastUpdated).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    lastUpdated.textContent = `Last updated: ${lastUpdateTime}`;

    // Set status color and icon
    const statusClass = getStatusClass(shipmentData.status);
    statusCard.className = `status-card ${statusClass}`;
    
    const statusConfig = getStatusConfig(shipmentData.status);
    statusIcon.className = `fas ${statusConfig.icon}`;
    statusIcon.parentElement.style.background = statusConfig.color;

    // Update progress bar
    updateProgressBar();
  }

  // Get status configuration
  function getStatusConfig(status) {
    const configs = {
      'delayed': { icon: 'fa-exclamation-triangle', color: '#dc2626' },
      'in transit': { icon: 'fa-truck', color: '#2563eb' },
      'at customs': { icon: 'fa-clipboard-check', color: '#d97706' },
      'delivered': { icon: 'fa-check-circle', color: '#059669' },
      'processing': { icon: 'fa-cog', color: '#6b7280' }
    };
    return configs[status.toLowerCase()] || configs.processing;
  }

  // Get status CSS class
  function getStatusClass(status) {
    const statusMap = {
      'delayed': 'status-delayed',
      'in transit': 'status-processing',
      'at customs': 'status-customs',
      'delivered': 'status-delivered',
      'processing': 'status-processing'
    };
    return statusMap[status.toLowerCase()] || 'status-processing';
  }

  // Update progress bar based on status
  function updateProgressBar() {
    const steps = document.querySelectorAll('.progress-step');
    const currentStepElement = document.getElementById('current-step');
    const currentStepLabel = document.getElementById('current-step-label');

    // Reset all steps
    steps.forEach(step => {
      step.classList.remove('completed', 'active');
    });

    const status = shipmentData.status.toLowerCase();
    
    // Always mark first two steps as completed
    steps[0].classList.add('completed');
    steps[1].classList.add('completed');

    if (status === 'delivered') {
      steps[2].classList.add('completed');
      steps[3].classList.add('completed', 'active');
      currentStepLabel.textContent = 'Delivered';
    } else if (status === 'delayed') {
      steps[2].classList.add('active');
      currentStepLabel.textContent = 'Delayed';
      currentStepElement.querySelector('.step-circle').innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    } else {
      steps[2].classList.add('active');
      currentStepLabel.textContent = shipmentData.status;
    }
  }

  // Populate shipment information
  function populateShipmentInfo() {
    document.getElementById('detail-shipment-id').textContent = shipmentData.id;
    document.getElementById('detail-type').textContent = shipmentData.type;
    document.getElementById('detail-priority').textContent = shipmentData.priority;
    document.getElementById('detail-created').textContent = new Date(shipmentData.created).toLocaleDateString('en-GB');
    document.getElementById('detail-eta').textContent = shipmentData.eta;
    document.getElementById('detail-carrier').textContent = shipmentData.carrier;

    // Set priority badge color
    const priorityBadge = document.getElementById('detail-priority');
    if (shipmentData.priority === 'High') {
      priorityBadge.style.background = '#fef2f2';
      priorityBadge.style.color = '#dc2626';
    } else if (shipmentData.priority === 'Standard') {
      priorityBadge.style.background = '#f1f5f9';
      priorityBadge.style.color = '#334155';
    }
  }

  // Populate route information
  function populateRouteInfo() {
    document.getElementById('origin-location').textContent = shipmentData.origin.location;
    document.getElementById('origin-time').textContent = new Date(shipmentData.origin.time).toLocaleString('en-GB');
    
    document.getElementById('current-location').textContent = shipmentData.current.location;
    document.getElementById('current-time').textContent = new Date(shipmentData.current.time).toLocaleString('en-GB');
    
    document.getElementById('destination-location').textContent = shipmentData.destination.location;
    document.getElementById('destination-time').textContent = shipmentData.destination.time;
  }

  // Populate product details
  function populateProductInfo() {
    document.getElementById('product-name').textContent = shipmentData.product.name;
    document.getElementById('product-quantity').textContent = shipmentData.product.quantity;
    document.getElementById('product-weight').textContent = shipmentData.product.weight;
    document.getElementById('product-dimensions').textContent = shipmentData.product.dimensions;
    document.getElementById('product-value').textContent = shipmentData.product.value;
  }

  // Populate contact information
  function populateContactInfo() {
    // Shipper
    document.getElementById('shipper-name').textContent = shipmentData.contacts.shipper.name;
    document.getElementById('shipper-phone').textContent = shipmentData.contacts.shipper.phone;
    document.getElementById('shipper-email').textContent = shipmentData.contacts.shipper.email;

    // Receiver
    document.getElementById('receiver-name').textContent = shipmentData.contacts.receiver.name;
    document.getElementById('receiver-phone').textContent = shipmentData.contacts.receiver.phone;
    document.getElementById('receiver-email').textContent = shipmentData.contacts.receiver.email;
  }

  // Populate tracking timeline
  function populateTimeline() {
    const timeline = document.getElementById('tracking-timeline');
    timeline.innerHTML = '';

    shipmentData.timeline.forEach(item => {
      const timelineItem = document.createElement('div');
      timelineItem.className = `timeline-item ${item.status}`;
      
      timelineItem.innerHTML = `
        <div class="timeline-content">
          <div class="timeline-title">${item.title}</div>
          <div class="timeline-description">${item.description}</div>
          <div class="timeline-time">${item.time} • ${item.location}</div>
        </div>
      `;
      
      timeline.appendChild(timelineItem);
    });
  }

  // Populate documents
  function populateDocuments() {
    const documentsList = document.getElementById('documents-list');
    documentsList.innerHTML = '';

    shipmentData.documents.forEach(doc => {
      const docElement = document.createElement('div');
      docElement.className = 'document-item';
      
      const iconClass = doc.type === 'pdf' ? 'fa-file-pdf' : 'fa-file';
      
      docElement.innerHTML = `
        <div class="document-icon">
          <i class="fas ${iconClass}"></i>
        </div>
        <div class="document-info">
          <div class="document-name">${doc.name}</div>
          <div class="document-size">${doc.size}</div>
        </div>
      `;
      
      docElement.addEventListener('click', () => {
        // In a real app, this would download or view the document
        alert(`Opening ${doc.name}...`);
      });
      
      documentsList.appendChild(docElement);
    });

    // Populate notes
    document.getElementById('shipment-notes').textContent = shipmentData.notes;
  }

  // Print functionality
  document.getElementById('print-btn').addEventListener('click', () => {
    window.print();
  });

  // Sidebar navigation
  document.querySelectorAll('.nav-item a').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      this.closest('.nav-item')?.classList.add('active');
    });
  });

  // Initialize page
  function initializePage() {
    populateStatusOverview();
    populateShipmentInfo();
    populateRouteInfo();
    populateProductInfo();
    populateContactInfo();
    populateTimeline();
    populateDocuments();
  }

  // Listen for shipment updates
  window.addEventListener('storage', (e) => {
    if (e.key === 'inventra_shipment_updates') {
      console.log('Shipment update detected, refreshing data');
      const updatedData = getShipmentData();
      if (updatedData) {
        shipmentData = updatedData;
        initializePage();
      }
    }
  });

  // Initialize the page
  initializePage();

  console.log('Shipment Details page initialized for:', shipmentId);
});