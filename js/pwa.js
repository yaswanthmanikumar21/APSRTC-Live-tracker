(() => {
  function isStandalone() {
    try {
      return window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
    } catch (error) {
      console.warn('Could not detect installed app display mode.', error);
      return false;
    }
  }

  function isCapacitorNative() {
    try {
      return Boolean(
        window.Capacitor &&
        window.Capacitor.isNativePlatform &&
        window.Capacitor.isNativePlatform()
      );
    } catch (error) {
      console.warn('Could not detect the Capacitor runtime.', error);
      return true;
    }
  }

  function isIPhoneSafari() {
    const userAgent = window.navigator.userAgent || '';
    const isIPhone = /iPhone|iPad|iPod/.test(userAgent) ||
      (/Macintosh/.test(userAgent) && window.navigator.maxTouchPoints > 1);
    return isIPhone &&
      /Safari/.test(userAgent) &&
      !/CriOS|FxiOS|EdgiOS|OPiOS/.test(userAgent);
  }

  function createInstallControls() {
    const host = document.querySelector('.hero-copy');
    const searchForm = document.getElementById('searchForm');
    if (!host || !searchForm) {
      return null;
    }

    const controls = document.createElement('div');
    controls.className = 'pwa-install-controls';
    controls.style.display = 'flex';
    controls.style.flexWrap = 'wrap';
    controls.style.alignItems = 'center';
    controls.style.gap = '10px';
    controls.style.margin = '0 0 14px';

    const installButton = document.createElement('button');
    installButton.type = 'button';
    installButton.className = 'secondary-button pwa-install-button';
    installButton.dataset.i18n = 'installApp';
    installButton.textContent = window.t('installApp');
    installButton.style.background = 'var(--surface-soft)';
    installButton.style.border = '1px solid var(--border)';
    installButton.style.borderRadius = '10px';
    installButton.style.color = 'var(--primary)';
    installButton.style.cursor = 'pointer';
    installButton.style.font = 'inherit';
    installButton.style.fontWeight = '700';
    installButton.style.minHeight = '44px';
    installButton.style.padding = '9px 14px';
    installButton.hidden = true;

    const hint = document.createElement('div');
    hint.className = 'pwa-install-hint';
    hint.style.display = 'flex';
    hint.style.flexWrap = 'wrap';
    hint.style.alignItems = 'center';
    hint.style.gap = '8px';
    hint.style.padding = '8px 12px';
    hint.style.border = '1px solid var(--border)';
    hint.style.borderRadius = '10px';
    hint.style.background = 'var(--surface-soft)';
    hint.style.color = 'var(--text)';
    hint.hidden = true;

    const hintText = document.createElement('span');
    hintText.dataset.i18n = 'iosInstallHint';
    hintText.textContent = window.t('iosInstallHint');

    const dismissButton = document.createElement('button');
    dismissButton.type = 'button';
    dismissButton.className = 'pwa-install-hint__dismiss';
    dismissButton.dataset.i18n = 'dismiss';
    dismissButton.dataset.i18nAriaLabel = 'dismissInstallHint';
    dismissButton.textContent = window.t('dismiss');
    dismissButton.setAttribute(
      'aria-label',
      window.t('dismissInstallHint')
    );
    dismissButton.style.border = '0';
    dismissButton.style.background = 'transparent';
    dismissButton.style.color = 'var(--primary)';
    dismissButton.style.cursor = 'pointer';
    dismissButton.style.font = 'inherit';
    dismissButton.style.fontWeight = '700';
    dismissButton.style.minHeight = '36px';
    dismissButton.style.padding = '4px 8px';
    hint.append(hintText, dismissButton);

    dismissButton.addEventListener('click', () => {
      hint.hidden = true;
      try {
        localStorage.setItem('apsrtc-pwa-install-hint-dismissed', 'true');
      } catch (error) {
        console.warn('Could not remember the install hint dismissal.', error);
      }
    });

    host.insertBefore(controls, searchForm);
    controls.append(installButton, hint);
    window.applyLanguage?.(window.getLanguage?.() || 'en');
    return { installButton, hint };
  }

  async function initialize() {
    try {
      const nativeApp = isCapacitorNative();
      if (
        'serviceWorker' in navigator &&
        window.location.protocol === 'https:' &&
        !nativeApp
      ) {
        try {
          await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        } catch (error) {
          console.warn('Could not register the APSRTC Live service worker.', error);
        }
      }

      if (isStandalone() || nativeApp) {
        return;
      }

      const controls = createInstallControls();
      if (!controls) {
        return;
      }

      if (isIPhoneSafari()) {
        try {
          controls.hint.hidden =
            localStorage.getItem('apsrtc-pwa-install-hint-dismissed') === 'true';
        } catch (error) {
          console.warn('Could not read the install hint dismissal.', error);
          controls.hint.hidden = false;
        }
      }

      let installPrompt = null;
      window.addEventListener('beforeinstallprompt', (event) => {
        try {
          event.preventDefault();
          installPrompt = event;
          controls.installButton.hidden = false;
        } catch (error) {
          console.warn('Could not prepare the install prompt.', error);
        }
      });

      controls.installButton.addEventListener('click', async () => {
        try {
          if (!installPrompt) {
            return;
          }

          const prompt = installPrompt;
          installPrompt = null;
          controls.installButton.hidden = true;
          await prompt.prompt();
          await prompt.userChoice;
        } catch (error) {
          console.warn('Could not show the install prompt.', error);
        }
      });

      window.addEventListener('appinstalled', () => {
        controls.installButton.hidden = true;
        controls.hint.hidden = true;
      });
    } catch (error) {
      console.warn('Could not initialize PWA support.', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
