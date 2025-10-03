document.addEventListener('DOMContentLoaded', () => {
  // Set current page for navigation
  try { 
    if (typeof Storage !== "undefined") {
      localStorage.setItem('currentPage', 'shipment'); 
    }
  } catch (e) {
    console.log('LocalStorage not available');
  }

  // Quick actions active-state
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      if (this.classList.contains('active')) return;
      document.querySelectorAll('.action-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Signature pad functionality
  const canvas = document.getElementById('signature-pad');
  const clearBtn = document.getElementById('clear-signature');
  const saveBtn = document.getElementById('save-signature');
  const statusEl = document.getElementById('signature-status');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let drawing = false;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;

    function getPosition(e) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      return { x, y };
    }

    function startDrawing(e) {
      drawing = true;
      const pos = getPosition(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      e.preventDefault();
    }

    function draw(e) {
      if (!drawing) return;
      const pos = getPosition(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
      e.preventDefault();
    }

    function stopDrawing() {
      drawing = false;
      ctx.beginPath();
    }

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Touch events for mobile
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    // Clear signature
    clearBtn?.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      statusEl.textContent = 'Signature cleared';
      statusEl.style.color = '#ef4444';
    });

    // Save signature
    saveBtn?.addEventListener('click', () => {
      const dataURL = canvas.toDataURL('image/png');
      statusEl.textContent = 'Signature saved successfully';
      statusEl.style.color = '#16a34a';
      
      // Optionally store to sessionStorage (avoid localStorage as per requirements)
      try { 
        if (typeof Storage !== "undefined") {
          sessionStorage.setItem('inventra.lastSignature', dataURL);
        }
      } catch (e) {
        console.log('SessionStorage not available');
      }
    });
  }

  // Receipt action buttons
  document.getElementById('updateDashboardBtn')?.addEventListener('click', () => {
    showToast('Dashboard updated with delivery status', 'success');
  });

  document.getElementById('sendReceiptBtn')?.addEventListener('click', () => {
    showToast('Receipt sent to recipient email', 'success');
  });

  // Toast notification function
  function showToast(message, type = 'info') {
    // Remove any existing toasts
    document.querySelectorAll('.toast').forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const borderColor = type === 'success' ? '#059669' : 
                       type === 'error' ? '#dc2626' : '#3F7AB0';
    
    toast.style.cssText = `
      position: fixed;
      right: 24px;
      top: 24px;
      background: #fff;
      color: #1e293b;
      border-left: 4px solid ${borderColor};
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 16px;
      box-shadow: 0 6px 24px rgba(0,0,0,0.15);
      z-index: 1000;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation styles if not already present
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
    }, 2500);
  }

  // Sidebar navigation active state
  document.querySelectorAll('.nav-item a').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      this.closest('.nav-item')?.classList.add('active');
    });
  });

  console.log('Generate Receipt page initialized');
});