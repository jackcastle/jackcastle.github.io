// Runs inline in <head> to set theme before paint and prevent FOUC.
// Reads localStorage, falls back to dark.
(function () {
  try {
    const stored = localStorage.getItem('theme');
    const theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = 'dark';
  }
})();
