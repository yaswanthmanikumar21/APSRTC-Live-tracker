(() => {
  let channel = null;
  let refreshTimer = null;
  let pollingTimer = null;
  let lastRefreshAt = 0;
  const refreshIntervalMs = 2000;

  function scheduleRefresh() {
    try {
      if (document.visibilityState !== 'visible' || refreshTimer !== null) {
        return;
      }

      const delay = Math.max(
        0,
        refreshIntervalMs - (Date.now() - lastRefreshAt)
      );
      refreshTimer = window.setTimeout(async () => {
        refreshTimer = null;
        lastRefreshAt = Date.now();
        try {
          await window.refreshVisibleLiveLists?.();
        } catch (error) {
          console.warn('Could not refresh live bus lists.', error);
        }
      }, delay);
    } catch (error) {
      console.warn('Could not schedule a live bus refresh.', error);
    }
  }

  function startPolling() {
    try {
      if (document.visibilityState !== 'visible' || pollingTimer !== null) {
        return;
      }

      pollingTimer = window.setInterval(scheduleRefresh, 20000);
      scheduleRefresh();
    } catch (error) {
      console.warn('Could not start live bus polling.', error);
    }
  }

  function stopPolling() {
    try {
      if (pollingTimer !== null) {
        window.clearInterval(pollingTimer);
        pollingTimer = null;
      }
      if (refreshTimer !== null) {
        window.clearTimeout(refreshTimer);
        refreshTimer = null;
      }
    } catch (error) {
      console.warn('Could not stop live bus polling.', error);
    }
  }

  function handleChange(payload) {
    try {
      const row = payload?.eventType === 'DELETE'
        ? payload.old
        : payload?.new;
      if (!row) {
        return;
      }

      window.handleLiveShareEvent?.(row, payload.eventType);
      scheduleRefresh();
    } catch (error) {
      console.warn('Could not process a live bus update.', error);
    }
  }

  try {
    if (!window.supabaseClient) {
      throw new Error('Supabase client is not available.');
    }

    const channelName = `apsrtc-live-updates-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
    channel = window.supabaseClient
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bus_location_shares'
        },
        handleChange
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('Live bus Realtime channel status:', status);
        }
      });

    document.addEventListener('visibilitychange', () => {
      try {
        if (document.visibilityState === 'visible') {
          startPolling();
        } else {
          stopPolling();
        }
      } catch (error) {
        console.warn('Could not update live bus polling visibility.', error);
      }
    });
    startPolling();
  } catch (error) {
    console.warn('Could not initialize live bus updates.', error);
  }
})();
