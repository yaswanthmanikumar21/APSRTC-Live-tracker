(() => {
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const storageKey = 'apsrtc-live-theme';

  if (!themeToggle) {
    return;
  }

  function setTheme(theme, persist) {
    root.dataset.theme = theme;
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));

    if (persist) {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (error) {
        console.warn('Theme preference could not be saved.', error);
      }
    }
  }

  setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light', false);
  themeToggle.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });
})();
