(() => {
  const allowedBusTypes = new Set(['ordinary', 'metro_express']);

  function isActiveShare(row, now) {
    if (!row?.expires_at || !row.updated_at) {
      return false;
    }

    const expiresAt = new Date(row.expires_at).getTime();
    const updatedAt = new Date(row.updated_at).getTime();
    return expiresAt > now && updatedAt <= now;
  }

  async function getActiveShares(query) {
    if (!window.supabaseClient) {
      throw new Error('Supabase client is not available.');
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    const now = Date.now();
    return (data || []).filter((row) => isActiveShare(row, now));
  }

  async function getActiveBusSharesForRoute(busNumber) {
    if (!busNumber || !window.supabaseClient) {
      return {
        data: [],
        error: new Error('A bus number is required to lookup active sessions.')
      };
    }

    try {
      const data = await getActiveShares(
        window.supabaseClient
          .from('bus_location_shares')
          .select('bus_number, bus_code, bus_type, latitude, longitude, updated_at, expires_at, capacity_status')
          .eq('bus_number', busNumber)
          .order('updated_at', { ascending: false })
      );
      return { data, error: null };
    } catch (error) {
      return { data: [], error };
    }
  }

  async function getActiveBusLocationShares() {
    if (!window.supabaseClient) {
      throw new Error('Supabase client is not available.');
    }

    return getActiveShares(
      window.supabaseClient
        .from('bus_location_shares')
        .select('bus_number, bus_code, bus_type, latitude, longitude, updated_at, expires_at')
        .order('updated_at', { ascending: false })
    );
  }

  async function getActiveBusTypesForNumbers(busNumbers) {
    const numbers = [...new Set(busNumbers.filter(Boolean))];
    if (!numbers.length) {
      return new Map();
    }
    if (!window.supabaseClient) {
      throw new Error('Supabase client is not available.');
    }

    const rows = await getActiveShares(
      window.supabaseClient
        .from('bus_location_shares')
        .select('bus_number, bus_type, updated_at, expires_at')
        .in('bus_number', numbers)
        .order('updated_at', { ascending: false })
    );
    const typesByNumber = new Map();
    const seenNumbers = new Set();
    rows.forEach((row) => {
      if (!seenNumbers.has(row.bus_number)) {
        seenNumbers.add(row.bus_number);
        typesByNumber.set(
          row.bus_number,
          allowedBusTypes.has(row.bus_type) ? row.bus_type : null
        );
      }
    });
    return typesByNumber;
  }

  async function getLatestActiveBusLocation(busNumber, busCode = null) {
    if (!window.supabaseClient || (!busNumber && !busCode)) {
      return { data: null, error: null };
    }

    let query = window.supabaseClient
      .from('bus_location_shares')
      .select('bus_number, bus_code, bus_type, latitude, longitude, updated_at, expires_at, capacity_status')
      .order('updated_at', { ascending: false });
    if (busCode) {
      query = query.eq('bus_code', busCode);
    } else {
      query = query.eq('bus_number', busNumber);
    }

    try {
      const activeRows = await getActiveShares(query);
      return { data: activeRows[0] || null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function setShareBusType(busCode, busNumber, busType) {
    if (!allowedBusTypes.has(busType)) {
      console.warn('Bus type was not updated because the selected type is invalid.');
      return;
    }

    if (!window.supabaseClient) {
      console.warn('Bus type was not updated because Supabase is unavailable.');
      return;
    }

    try {
      let query = window.supabaseClient
        .from('bus_location_shares')
        .update({ bus_type: busType });
      if (busCode) {
        query = query.eq('bus_code', busCode);
      } else {
        query = query.eq('bus_number', busNumber);
      }

      const { error } = await query;
      if (error) {
        console.warn('Could not save the bus type for this sharing session.', error);
      }
    } catch (error) {
      console.warn('Could not save the bus type for this sharing session.', error);
    }
  }

  window.busTypeHelpers = {
    getActiveBusSharesForRoute,
    getActiveBusLocationShares,
    getActiveBusTypesForNumbers,
    getLatestActiveBusLocation
  };
  window.setShareBusType = setShareBusType;
})();
