const btn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
if (btn) {
  btn.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    btn.dataset.theme = next;
    btn.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
    btn.textContent = next === 'dark' ? '☾' : '☀';
    try { localStorage.setItem('theme', next); } catch {}
  });
}
