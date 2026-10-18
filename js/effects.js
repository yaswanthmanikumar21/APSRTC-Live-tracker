(() => {
  const markerAnimations = new WeakMap();

  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (error) {
      console.warn('Could not check reduced-motion preference.', error);
      return false;
    }
  }

  function distanceInMeters(start, end) {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const latitudeDifference = toRadians(end[0] - start[0]);
    const longitudeDifference = toRadians(end[1] - start[1]);
    const startLatitude = toRadians(start[0]);
    const endLatitude = toRadians(end[0]);
    const haversine = Math.sin(latitudeDifference / 2) ** 2 +
      Math.cos(startLatitude) *
      Math.cos(endLatitude) *
      Math.sin(longitudeDifference / 2) ** 2;
    return 6371000 * 2 * Math.atan2(
      Math.sqrt(haversine),
      Math.sqrt(1 - haversine)
    );
  }

  function moveBusMarkerSmoothly(marker, destination, onComplete = null) {
    try {
      if (!marker || !Array.isArray(destination) || prefersReducedMotion()) {
        marker?.setLatLng(destination);
        onComplete?.();
        return;
      }

      const previousAnimation = markerAnimations.get(marker);
      if (previousAnimation !== undefined) {
        window.cancelAnimationFrame(previousAnimation);
        markerAnimations.delete(marker);
      }

      const origin = marker.getLatLng();
      const start = [origin.lat, origin.lng];
      if (distanceInMeters(start, destination) > 500) {
        marker.setLatLng(destination);
        onComplete?.();
        return;
      }

      const startedAt = performance.now();
      const duration = 1000;
      const animate = (timestamp) => {
        try {
          const progress = Math.min(1, (timestamp - startedAt) / duration);
          marker.setLatLng([
            start[0] + (destination[0] - start[0]) * progress,
            start[1] + (destination[1] - start[1]) * progress
          ]);
          if (progress < 1) {
            markerAnimations.set(
              marker,
              window.requestAnimationFrame(animate)
            );
          } else {
            marker.setLatLng(destination);
            markerAnimations.delete(marker);
            onComplete?.();
          }
        } catch (error) {
          console.warn('Could not animate the bus marker; moving it directly.', error);
          try {
            marker.setLatLng(destination);
          } catch (setPositionError) {
            console.warn('Could not move the bus marker to its latest position.', setPositionError);
          }
          markerAnimations.delete(marker);
        }
      };

      markerAnimations.set(marker, window.requestAnimationFrame(animate));
    } catch (error) {
      console.warn('Could not animate the bus marker; moving it directly.', error);
      try {
        marker?.setLatLng(destination);
        onComplete?.();
      } catch (setPositionError) {
        console.warn('Could not move the bus marker to its latest position.', setPositionError);
      }
    }
  }

  function flashLiveUpdate(element) {
    try {
      if (!element || prefersReducedMotion()) {
        return;
      }
      element.classList.remove('live-update-flash');
      void element.offsetWidth;
      element.classList.add('live-update-flash');
    } catch (error) {
      console.warn('Could not highlight the latest live update.', error);
    }
  }

  document.addEventListener('pointerdown', (event) => {
    try {
      if (event.button !== 0 || !navigator.vibrate) {
        return;
      }
      if (event.target.closest('button, .bus-card, .session-button')) {
        navigator.vibrate(10);
      }
    } catch (error) {
      console.warn('Could not trigger tap feedback.', error);
    }
  });

  window.moveBusMarkerSmoothly = moveBusMarkerSmoothly;
  window.flashLiveUpdate = flashLiveUpdate;
})();
