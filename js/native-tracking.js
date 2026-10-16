(() => {
  let backgroundGeolocation = null;
  let watcherId = null;
  let startPromise = null;
  let watcherGeneration = 0;
  let lastPositionCallbackAt = 0;
  let pluginSource = null;
  let pluginResolutionAttempted = false;
  let pluginResolutionError = null;
  let statusBanner = null;
  let statusTimeout = null;
  let statusReported = false;

  function showNativeStatus(message) {
    try {
      if (!statusBanner) {
        statusBanner = document.createElement('div');
        statusBanner.setAttribute('role', 'status');
        statusBanner.style.position = 'fixed';
        statusBanner.style.left = '12px';
        statusBanner.style.right = '12px';
        statusBanner.style.bottom = '12px';
        statusBanner.style.zIndex = '10000';
        statusBanner.style.padding = '10px 14px';
        statusBanner.style.borderRadius = '10px';
        statusBanner.style.background = '#1b2833';
        statusBanner.style.color = '#ffffff';
        statusBanner.style.font = '14px/1.4 system-ui, sans-serif';
        statusBanner.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.25)';
        document.body.appendChild(statusBanner);
      }

      statusBanner.textContent = message;
      statusBanner.hidden = false;
      if (statusTimeout !== null) {
        window.clearTimeout(statusTimeout);
      }
      statusTimeout = window.setTimeout(() => {
        statusBanner.hidden = true;
        statusTimeout = null;
      }, 8000);
    } catch (error) {
      console.warn('Could not show native tracking status.', error);
    }
  }

  function isNativePlatform() {
    try {
      return Boolean(
        window.Capacitor &&
        window.Capacitor.isNativePlatform &&
        window.Capacitor.isNativePlatform()
      );
    } catch (error) {
      console.warn('Could not determine whether this is a native app.', error);
      return false;
    }
  }

  function isNative() {
    if (!isNativePlatform()) {
      return false;
    }

    try {
      getPlugin();
      if (!statusReported) {
        showNativeStatus(
          pluginSource === 'registerPlugin'
            ? 'Native tracking: using registerPlugin'
            : 'Native tracking: using Capacitor.Plugins'
        );
        statusReported = true;
      }
      return true;
    } catch (error) {
      showNativeStatus(pluginResolutionError
        ? `Native tracking error: ${pluginResolutionError.message || String(pluginResolutionError)}`
        : 'Native tracking: plugin not found, using browser GPS');
      statusReported = true;
      console.warn('Background geolocation plugin is unavailable.', error);
      return false;
    }
  }

  function getPlugin() {
    if (!pluginResolutionAttempted) {
      pluginResolutionAttempted = true;
      try {
        if (typeof window.Capacitor?.registerPlugin === 'function') {
          backgroundGeolocation =
            window.Capacitor.registerPlugin('BackgroundGeolocation');
          pluginSource = 'registerPlugin';
        } else if (window.Capacitor?.Plugins?.BackgroundGeolocation) {
          backgroundGeolocation =
            window.Capacitor.Plugins.BackgroundGeolocation;
          pluginSource = 'Capacitor.Plugins';
        }
      } catch (error) {
        pluginResolutionError = error;
      }
    }
    if (!backgroundGeolocation) {
      throw pluginResolutionError ||
        new Error('BackgroundGeolocation plugin was not found.');
    }
    return backgroundGeolocation;
  }

  function reportError(error, onError) {
    try {
      const message = error?.message || String(error || 'Location tracking failed.');
      showNativeStatus(`Native tracking error: ${message}`);
      if (error?.code === 'NOT_AUTHORIZED') {
        onError(
          'Please set location access to “All the time” in your app settings to keep sharing while the screen is locked.',
          async () => {
            try {
              await getPlugin().openSettings();
            } catch (settingsError) {
              console.warn('Could not open app location settings.', settingsError);
            }
          }
        );
        return;
      }

      onError(message);
    } catch (callbackError) {
      console.warn('Could not report a background location error.', callbackError);
    }
  }

  async function start(onPosition, onError) {
    if (!isNative()) {
      return;
    }
    while (startPromise) {
      await startPromise;
    }
    if (watcherId) {
      return;
    }

    const currentGeneration = ++watcherGeneration;
    lastPositionCallbackAt = 0;

    startPromise = (async () => {
      try {
        const plugin = getPlugin();
        const id = await plugin.addWatcher(
          {
            backgroundTitle: 'APSRTC Live',
            backgroundMessage: 'Sharing this bus location with riders',
            requestPermissions: true,
            stale: false
          },
          (location, error) => {
            try {
              if (error) {
                reportError(error, onError);
                return;
              }
              if (!location) {
                return;
              }

              const now = Date.now();
              if (now - lastPositionCallbackAt < 5000) {
                return;
              }
              lastPositionCallbackAt = now;
              onPosition({
                coords: {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  accuracy: location.accuracy,
                  heading: location.bearing,
                  speed: location.speed
                },
                timestamp: location.time
              });
            } catch (callbackError) {
              showNativeStatus(
                `Native tracking error: ${callbackError?.message || String(callbackError)}`
              );
              console.warn('Could not handle a background location update.', callbackError);
            }
          }
        );

        if (currentGeneration !== watcherGeneration) {
          await plugin.removeWatcher({ id });
          return;
        }
        watcherId = id;
      } catch (error) {
        reportError(error, onError);
      } finally {
        startPromise = null;
      }
    })();

    return startPromise;
  }

  async function stop() {
    watcherGeneration += 1;
    const id = watcherId;
    watcherId = null;
    if (!id) {
      return;
    }

    try {
      await getPlugin().removeWatcher({ id });
    } catch (error) {
      console.warn('Could not stop background location tracking.', error);
    }
  }

  window.NativeTracking = { isNative, start, stop };
})();
