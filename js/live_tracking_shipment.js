document.addEventListener('DOMContentLoaded', () => {
  const refreshBtn = document.getElementById('refreshLocationBtn');
  const lastUpdated = document.getElementById('last-updated');
  const etaBadge = document.getElementById('eta-badge');
  const progressFill = document.getElementById('progress-fill');
  const progressPct = document.getElementById('progress-percentage');
  const updatesList = document.getElementById('updates-list');
  const zoomIn = document.getElementById('zoom-in');
  const zoomOut = document.getElementById('zoom-out');
  const mapLoading = document.getElementById('map-loading');
  const mapEl = document.getElementById('map-canvas');
  let mapInstance = null;
  let mapMarker = null;

  // Google Maps init callback (called by script tag via callback=initMap)
  window.initMap = function initMap() {
    if (!mapEl) return;
    mapInstance = new google.maps.Map(mapEl, {
      center: { lat: 1.3521, lng: 103.8198 }, // Singapore
      zoom: 8,
      disableDefaultUI: true,
      styles: [
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] }
      ]
    });
    mapMarker = new google.maps.Marker({
      position: { lat: 1.3521, lng: 103.8198 },
      map: mapInstance,
      title: 'Current Location'
    });
    mapLoading?.remove();
  };

  // Quick actions active-state handling (shared pattern)
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      if (this.classList.contains('active')) return;
      document.querySelectorAll('.action-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Refresh location handler
  refreshBtn?.addEventListener('click', function () {
    this.disabled = true;
    this.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:16px;height:16px;animation:spin 1s linear infinite"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg> Refreshing...';
    setTimeout(() => {
      const now = new Date();
      lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      etaBadge.textContent = 'ETA: 1 hr 45 min';
      // prepend an update
      const update = document.createElement('div');
      update.className = 'update-item';
      update.innerHTML = '<div class="update-icon info"><i class="fas fa-info-circle"></i></div><div class="update-content"><div class="update-time">just now:</div><div class="update-text">GPS ping received near Tuas Checkpoint</div></div>';
      updatesList.prepend(update);
      // Move marker slightly east each refresh for demo
      if (mapInstance && mapMarker) {
        const pos = mapMarker.getPosition();
        const next = { lat: pos.lat(), lng: pos.lng() + 0.01 };
        mapMarker.setPosition(next);
        mapInstance.panTo(next);
      }
      this.disabled = false;
      this.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:16px;height:16px;"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg> Refresh Location';
    }, 1200);
  });

  // Zoom controls
  let zoom = 8;
  zoomIn?.addEventListener('click', () => {
    zoom = Math.min(18, zoom + 1);
    if (mapInstance) mapInstance.setZoom(zoom);
    flashBadge(`Zoom: ${zoom}`);
  });
  zoomOut?.addEventListener('click', () => {
    zoom = Math.max(3, zoom - 1);
    if (mapInstance) mapInstance.setZoom(zoom);
    flashBadge(`Zoom: ${zoom}`);
  });

  function flashBadge(text) {
    etaBadge.textContent = text;
    etaBadge.style.background = '#3b82f6';
    setTimeout(() => { etaBadge.textContent = 'Calculating...'; etaBadge.style.background = '#0ea5e9'; }, 800);
  }

  // Progress ticker
  let pct = 75;
  setInterval(() => {
    pct = Math.min(99, pct + 1);
    progressFill.style.width = pct + '%';
    progressPct.textContent = pct + '% Complete';
  }, 5000);

  // Sidebar nav active-state handling
  document.querySelectorAll('.nav-item a').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      this.closest('.nav-item')?.classList.add('active');
    });
  });
});


