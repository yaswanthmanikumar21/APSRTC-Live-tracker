(() => {
  function normalizeStopName(value) {
    return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
  }

  function getBusStops(bus) {
    const stops = Array.isArray(bus?.stops)
      ? bus.stops
      : typeof bus?.stops === 'string'
        ? bus.stops.split(',')
        : [];
    return [
      bus?.starting_point ?? bus?.startingPoint,
      ...stops,
      bus?.destination
    ]
      .map((stop) => String(stop || '').trim().replace(/\s+/g, ' '))
      .filter(Boolean);
  }

  function matchTrip(bus, from, to) {
    const normalizedFrom = normalizeStopName(from);
    const normalizedTo = normalizeStopName(to);
    if (!normalizedFrom || !normalizedTo || normalizedFrom === normalizedTo) {
      return null;
    }

    const stops = getBusStops(bus);
    const fromIndex = stops.findIndex(
      (stop) => normalizeStopName(stop) === normalizedFrom
    );
    const toIndex = stops.findIndex(
      (stop, index) => index > fromIndex &&
        normalizeStopName(stop) === normalizedTo
    );
    if (fromIndex < 0 || toIndex < 0) {
      return null;
    }

    return {
      stopsBetween: Math.max(0, toIndex - fromIndex - 1)
    };
  }

  async function getLastSeenBusShare(busNumber, busCode = null) {
    if (!window.supabaseClient || !busNumber) {
      return {
        data: null,
        error: new Error('Supabase client and bus number are required.')
      };
    }

    let query = window.supabaseClient
      .from('bus_location_shares')
      .select('updated_at')
      .eq('bus_number', busNumber)
      .order('updated_at', { ascending: false })
      .limit(1);
    if (busCode) {
      query = query.eq('bus_code', busCode);
    }
    const { data, error } = await query;
    if (error) {
      return { data: null, error };
    }
    return {
      data: Array.isArray(data) ? data[0] || null : data || null,
      error: null
    };
  }

  window.TripTools = Object.freeze({
    normalizeStopName,
    getBusStops,
    matchTrip,
    getLastSeenBusShare
  });
})();
