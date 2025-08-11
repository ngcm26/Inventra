document.addEventListener('DOMContentLoaded', () => {
  const emailListEl = document.getElementById('auto-email-list');
  const processAllBtn = document.getElementById('processAllBtn');
  const refreshInboxBtn = document.getElementById('refreshInboxBtn');
  const progressFill = document.getElementById('progressFill');
  const progressStatus = document.getElementById('progressStatus');

  const sampleEmails = [
    {
      id: 'VN-2024-089',
      company: 'Vietnam Timber Co',
      subject: 'Shipment Notice #VN-2024-089 - Pinewood Raw Material',
      preview: 'Dear NGS Team, Please find attached shipment documents for pinewood raw materials order #VN-2024-089. Departure: Dec 15, 2024...',
      receivedAgo: '2 minutes ago',
      status: 'processing'
    },
    {
      id: 'MY-2024-045',
      company: 'Malaysia Express Logistics',
      subject: 'Shipping Confirmation - MY-2024-045',
      preview: 'Shipment for assembled pallets has been dispatched. 50 units en route to Singapore warehouse...',
      receivedAgo: '1 hour ago',
      status: 'completed'
    }
  ];

  function showToast({ title = 'Notice', desc = '', type = 'success', timeout = 3500 }) {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : (type === 'error' ? 'exclamation-triangle' : 'info-circle')}"></i>
      <div><div class="title">${title}</div>${desc ? `<div class="desc">${desc}</div>` : ''}</div>
      <button class="close" aria-label="Close">&times;</button>
    `;
    document.body.appendChild(el);
    const close = () => el.remove();
    el.querySelector('.close')?.addEventListener('click', close);
    setTimeout(close, timeout);
  }

  // Provide a showNotification compatible helper matching requested API
  function showNotification(message, type = 'info') {
    showToast({ title: type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info', desc: message, type });
  }
  // Make global as requested
  window.showNotification = showNotification;

  // Ensure a spin keyframes exists for inline spinners
  if (!document.getElementById('auto-shipment-spin-kf')) {
    const style = document.createElement('style');
    style.id = 'auto-shipment-spin-kf';
    style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }

  function renderEmails(emails) {
    emailListEl.innerHTML = '';
    emails.forEach(email => {
      const item = document.createElement('div');
      item.className = `email-item ${email.status}`;
      item.innerHTML = `
        <div class="email-header">
          <div class="email-company">${escapeHtml(email.company)}</div>
          <div class="email-time">${escapeHtml(email.receivedAgo)}</div>
        </div>
        <div class="email-subject">${escapeHtml(email.subject)}</div>
        <div class="email-preview">${escapeHtml(email.preview)}</div>
        <div class="email-status ${email.status}">${email.status === 'processing' ? 'Processing' : 'Completed'}</div>
      `;
      // Click interaction: visual highlight and log
      item.addEventListener('click', () => {
        document.querySelectorAll('.email-item').forEach(e => e.style.boxShadow = 'none');
        item.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
        item.style.transform = 'translateY(-2px)';
        setTimeout(() => { item.style.transform = 'translateY(0)'; }, 180);
        console.log('Selected email from:', email.company);
      });
      emailListEl.appendChild(item);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
  }

  function simulateProgress(callback) {
    let pct = 0;
    progressStatus.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
    const timer = setInterval(() => {
      pct = Math.min(100, pct + Math.floor(10 + Math.random() * 20));
      progressFill.style.width = pct + '%';
      if (pct >= 100) {
        clearInterval(timer);
        progressStatus.innerHTML = '<i class="fas fa-check-circle"></i> Processing complete!';
        callback?.();
      }
    }, 300);
  }

  function processEmail(email) {
    simulateProgress(() => {
      // Create a shipment draft record based on email subject/id
      const payload = {
        id: email.id,
        type: 'incoming',
        route: { origin: 'vietnam', destination: 'singapore' },
        product: 'Pinewood Raw Material',
        quantity: 'N/A',
        expectedDeparture: '',
        expectedArrival: '',
        status: 'processing',
        supplier: email.company,
        notes: email.subject,
        createdAt: new Date().toISOString(),
        source: 'ai_email_extraction'
      };
      try {
        const key = 'inventra.shipments.autoDrafts';
        const drafts = JSON.parse(localStorage.getItem(key) || '[]');
        drafts.unshift(payload);
        localStorage.setItem(key, JSON.stringify(drafts.slice(0, 100)));
        showToast({ title: 'AI created shipment draft', desc: `Draft ${payload.id} saved.`, type: 'success' });
      } catch (e) {
        showToast({ title: 'Failed to save draft', desc: 'Local storage error.', type: 'error' });
      }
    });
  }

  function processAll() {
    // Button spinner and disable
    if (processAllBtn) {
      processAllBtn.disabled = true;
      processAllBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" style="animation: spin 1s linear infinite;">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
        Processing...
      `;
    }
    simulateProgress(() => {
      // Flip first processing email to completed visually
      const processingItem = document.querySelector('.email-item.processing');
      if (processingItem) {
        processingItem.classList.remove('processing');
        processingItem.classList.add('completed');
        const statusEl = processingItem.querySelector('.email-status');
        if (statusEl) { statusEl.classList.remove('processing'); statusEl.classList.add('completed'); statusEl.textContent = 'Completed'; }
      }
      sampleEmails.filter(e => e.status === 'processing').forEach(processEmail);
      // Reset button
      if (processAllBtn) {
        processAllBtn.disabled = false;
        processAllBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          Process all pending emails
        `;
      }
      showNotification('Shipment processed successfully!', 'success');
    });
  }

  function refreshInbox() {
    if (refreshInboxBtn) {
      refreshInboxBtn.disabled = true;
      refreshInboxBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" style="animation: spin 1s linear infinite;">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
        Refreshing...
      `;
      setTimeout(() => {
        refreshInboxBtn.disabled = false;
        refreshInboxBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          Refresh Inbox
        `;
        showNotification('Inbox refreshed!', 'info');
        renderEmails(sampleEmails);
      }, 1500);
    }
  }

  processAllBtn?.addEventListener('click', (e) => { e.preventDefault(); processAll(); });
  refreshInboxBtn?.addEventListener('click', (e) => { e.preventDefault(); refreshInbox(); });

  // Mode toggle functionality for .mode-btn buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const mode = this.textContent.trim();
      console.log('Mode switched to:', mode);
      if (mode === 'Manual Entry') {
        window.location.href = 'new_shipment_manual.html';
      } else if (mode === 'Automation') {
        console.log('Already on automation page');
      }
    });
  });

  // Quick action buttons active state handling
  const actionBtns = document.querySelectorAll('.action-btn');
  actionBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      if (this.classList.contains('active')) return;
      actionBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      console.log('Action selected:', this.textContent.trim());
    });
  });

  // Progressive fill for the status bar on load (visual)
  if (progressFill && progressStatus) {
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 2;
      progressFill.style.width = progress + '%';
      if (progress >= 100) {
        clearInterval(progressInterval);
        progressStatus.style.color = '#10b981';
      }
    }, 50);
  }

  // Navigation active state in sidebar
  document.querySelectorAll('.nav-item a').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      this.closest('.nav-item')?.classList.add('active');
    });
  });

  // Initial render
  renderEmails(sampleEmails);
  console.log('New Shipment - Automation page loaded successfully!');
});


