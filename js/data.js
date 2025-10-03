// Shared mock data for Inbox and Orders used across pages
// Exposes window.AppData with inboxMessages and orders

(function initSharedAppData() {
  const now = new Date();

  // Helper to create ISO string for N days/hours ago
  function daysAgo(n) {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d.toISOString();
  }

  function hoursAgo(n) {
    const d = new Date(now);
    d.setHours(d.getHours() - n);
    return d.toISOString();
  }

  const inboxMessages = [
    {
      id: 'MSG-1009',
      subject: 'RE: Shipment Update - Container MSKU7890123',
      sender: 'Malay Timber Logistics',
      email: 'logistics@malaytimber.com',
      category: 'delay',
      snippet: 'Malaysian hardwood pallets delayed by 3 days due to port congestion in Port Klang.',
      receivedAt: hoursAgo(2),
      isNew: true
    },
    {
      id: 'MSG-1008',
      subject: 'Quality Control Report - Batch HW-MIX-QR01',
      sender: 'Inventory Bot',
      email: 'alerts@inventra.ai',
      category: 'quality',
      snippet: 'Jurong Warehouse stock below threshold. 85 units remaining. Auto-reorder pending approval.',
      receivedAt: hoursAgo(6),
      isNew: true
    },
    {
      id: 'MSG-1007',
      subject: 'Container Arrival Notification - TEUS Container MSKU7890456',
      sender: 'Singapore Ports',
      email: 'updates@pagesingaporeports.com',
      category: 'delivery',
      snippet: '500 oak pallets delivered to Tuas Port. Gate-in recorded at 09:24 SGT.',
      receivedAt: hoursAgo(8),
      isNew: false
    },
    {
      id: 'MSG-1006',
      subject: 'Monthly Pallet Order - Kuehne + Nagel',
      sender: 'Global Logistics',
      email: 'procurement@globallogistics.sg',
      category: 'order',
      snippet: 'Client order requires custom 1100x1100mm pallets with ISPM-15 certification for export to AU.',
      receivedAt: hoursAgo(30),
      isNew: false
    },
    {
      id: 'MSG-1005',
      subject: 'Custom Pallet Quote Request - Schenker Singapore',
      sender: 'Pacific Freight',
      email: 'ops@pacificfreight.sg',
      category: 'quote',
      snippet: 'Requesting pricing and lead time for 200 standard Euro pallets, delivery to Changi South.',
      receivedAt: daysAgo(1),
      isNew: false
    },
    {
      id: 'MSG-1004',
      subject: 'Quality Alert: Moisture Levels High',
      sender: 'QA Sensor Network',
      email: 'qa@sensors.inventra.ai',
      category: 'quality',
      snippet: 'Detected elevated moisture in batch HW-MIX-HD. Recommend re-drying before shipment.',
      receivedAt: daysAgo(2),
      isNew: false
    }
  ];

  // Orders dataset (recent, last ~30 days)
  const orders = [
    {
      id: 'ORD-1024',
      customer: 'DHL Supply Chain',
      createdAt: daysAgo(2),
      items: [
        { name: 'Euro Pallets', quantity: 200 },
        { name: 'Heat-treated Pallets', quantity: 150 }
      ],
      total: 15750.0,
      status: 'shipped',
      source: 'web',
      expectedDelivery: daysAgo(0) // today
    },
    {
      id: 'ORD-1023',
      customer: 'Schenker Singapore',
      createdAt: daysAgo(3),
      items: [ { name: 'Custom 1100x1100mm', quantity: 50 } ],
      total: 8500.0,
      status: 'processing',
      source: 'email',
      expectedDelivery: daysAgo(-2) // in 2 days
    },
    {
      id: 'ORD-1022',
      customer: 'Kuehne + Nagel',
      createdAt: daysAgo(5),
      items: [
        { name: 'Standard 1200x800mm', quantity: 300 },
        { name: 'ISPM-15 Certified', quantity: 250 }
      ],
      total: 22350.0,
      status: 'new',
      source: 'phone',
      expectedDelivery: daysAgo(-1)
    },
    {
      id: 'ORD-1021',
      customer: 'FedEx Singapore',
      createdAt: daysAgo(6),
      items: [
        { name: 'Hardwood Mix', quantity: 75 },
        { name: 'Export Grade', quantity: 125 }
      ],
      total: 12800.0,
      status: 'delivered',
      source: 'web',
      expectedDelivery: daysAgo(1)
    },
    {
      id: 'ORD-1020',
      customer: 'UPS Supply Chain',
      createdAt: daysAgo(8),
      items: [ { name: 'Standard Euro Pallets', quantity: 400 } ],
      total: 18400.0,
      status: 'packed',
      source: 'manual',
      expectedDelivery: daysAgo(3)
    }
  ];

  // Add more static orders to simulate multiple pages
  const extraCustomers = [
    'Nippon Express',
    'Sinotrans',
    'Yusen Logistics',
    'DB Cargo',
    'CJ Logistics',
    'GEODIS',
    'Agility Logistics',
    'Kerry Logistics'
  ];
  for (let i = 0; i < 20; i++) {
    const created = new Date(now);
    created.setDate(created.getDate() - (9 + i));
    const expected = new Date(created);
    expected.setDate(expected.getDate() + 5);
    orders.push({
      id: `ORD-9${(i + 100).toString()}`,
      customer: extraCustomers[i % extraCustomers.length],
      createdAt: created.toISOString(),
      items: [ { name: 'Standard 1200x800mm', quantity: 100 + (i % 5) * 50 } ],
      total: 5000 + (i % 7) * 1250,
      status: ['new', 'processing', 'shipped', 'delivered', 'cancelled'][i % 5],
      source: ['web', 'email', 'phone', 'manual', 'api'][i % 5],
      expectedDelivery: expected.toISOString()
    });
  }

  window.AppData = window.AppData || {};
  window.AppData.inboxMessages = inboxMessages;
  window.AppData.orders = orders;
})();


