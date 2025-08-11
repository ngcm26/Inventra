document.addEventListener('DOMContentLoaded', () => {
  // Quick actions active-state
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      if (this.classList.contains('active')) return;
      document.querySelectorAll('.action-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Signature pad
  const canvas = document.getElementById('signature-pad');
  const clearBtn = document.getElementById('clear-signature');
  const saveBtn = document.getElementById('save-signature');
  const statusEl = document.getElementById('signature-status');
  const ctx = canvas.getContext('2d');
  let drawing = false;
  function pos(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x, y };
  }
  function start(e) { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); }
  function move(e) { if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke(); e.preventDefault(); }
  function end() { drawing = false; }
  canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', move); canvas.addEventListener('mouseup', end); canvas.addEventListener('mouseleave', end);
  canvas.addEventListener('touchstart', start, { passive: false }); canvas.addEventListener('touchmove', move, { passive: false }); canvas.addEventListener('touchend', end);

  clearBtn?.addEventListener('click', () => { ctx.clearRect(0, 0, canvas.width, canvas.height); statusEl.textContent = 'Signature cleared'; statusEl.style.color = '#ef4444'; });
  saveBtn?.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    statusEl.textContent = 'Signature saved';
    statusEl.style.color = '#16a34a';
    // Optionally store to localStorage
    try { localStorage.setItem('inventra.lastSignature', dataURL); } catch (_) {}
  });

  // Receipt actions
  document.getElementById('updateDashboardBtn')?.addEventListener('click', () => {
    toast('Dashboard updated with delivery status', 'success');
  });
  document.getElementById('sendReceiptBtn')?.addEventListener('click', () => {
    toast('Receipt sent to recipient email', 'success');
  });

  function toast(message, type = 'info') {
    const el = document.createElement('div');
    el.className = 'toast';
    el.style.cssText = 'position:fixed;right:24px;top:24px;background:#fff;color:#1e293b;border-left:4px solid #3F7AB0;border:1px solid #e2e8f0;border-radius:10px;padding:12px 16px;box-shadow:0 6px 24px rgba(0,0,0,0.15);z-index:1000;';
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }
});


