(() => {
  let backgroundGeolocation = null;
  let watcherId = null;
  let startPromise = null;
  let watcherGeneration = 0;
  let lastPositionCallbackAt = 0;

  function isNative() {
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

  function getPlugin() {
    if (!backgroundGeolocation) {
      backgroundGeolocation =
        window.Capacitor.registerPlugin('BackgroundGeolocation');
    }
    return backgroundGeolocation;
  }

  function reportError(error, onError) {
    try {
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

      onError(error?.message || String(error || 'Location tracking failed.'));
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
