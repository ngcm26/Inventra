
document.addEventListener('DOMContentLoaded', () => {
  const query = document.querySelector('#search');
  const rows = document.querySelectorAll('tbody tr');
  if (query){
    query.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      rows.forEach(r => {
        const text = r.innerText.toLowerCase();
        r.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }
  document.querySelectorAll('.toggle-reorder').forEach(btn => {
    btn.addEventListener('click', () => {
      const on = btn.dataset.on === 'true';
      btn.dataset.on = (!on).toString();
      btn.textContent = on ? 'Turn On Auto-Reorder' : 'Turn Off Auto-Reorder';
    });
  });
  const modal = document.querySelector('#deleteModal');
  const openDel = document.querySelector('[data-open="delete"]');
  const closes = document.querySelectorAll('[data-close]');
  if (openDel && modal){
    openDel.addEventListener('click', () => modal.style.display = 'flex');
    closes.forEach(c => c.addEventListener('click', () => modal.style.display = 'none'));
  }
});
