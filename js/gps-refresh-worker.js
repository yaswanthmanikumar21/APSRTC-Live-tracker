let refreshTimer = null;

self.addEventListener('message', (event) => {
  if (event.data?.type === 'stop') {
    clearInterval(refreshTimer);
    refreshTimer = null;
    return;
  }

  if (event.data?.type === 'start' && refreshTimer === null) {
    refreshTimer = setInterval(() => {
      self.postMessage({
        type: 'gps-refresh-check',
        timestamp: Date.now()
      });
    }, 15000);
  }
});
