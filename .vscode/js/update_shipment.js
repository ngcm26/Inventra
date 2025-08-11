document.addEventListener('DOMContentLoaded', () => {
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

  // Save button
  const saveBtn = document.getElementById('saveBtn');
  saveBtn?.addEventListener('click', function () {
    this.disabled = true;
    const original = this.innerHTML;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    setTimeout(() => {
      this.disabled = false;
      this.innerHTML = original;
      // Simple toast
      const t = document.createElement('div');
      t.className = 'toast success';
      t.style.cssText = 'position:fixed;right:24px;top:24px;background:#fff;border-left:4px solid #059669;border:1px solid #e2e8f0;border-radius:10px;padding:12px 16px;box-shadow:0 6px 24px rgba(0,0,0,0.15);z-index:1000;';
      t.textContent = 'Shipment updated successfully';
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 2500);
    }, 1200);
  });

  // Sidebar nav active-state handling
  document.querySelectorAll('.nav-item a').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      this.closest('.nav-item')?.classList.add('active');
    });
  });
});


