const SUPABASE_URL = 'https://fwtgmetudrfqhgtcyfxi.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_ZjjT3XB8Ii8lJmfkl2MTRg_ZWEWDpnM";

if (window.supabase && SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  window.supabaseHelpers = {
    async insertShare({ busNumber, busCode, latitude, longitude, expiresAt }) {
      if (!busNumber) {
        throw new Error('A bus number is required before saving location data.');
      }

      if (!window.supabaseClient) {
        throw new Error('Supabase client is not available.');
      }

      const updatedFields = {
        latitude,
        longitude,
        updated_at: new Date().toISOString(),
        expires_at: expiresAt
      };

      const insertPayload = {
        bus_number: busNumber,
        bus_code: busCode || null,
        ...updatedFields
      };

      console.log('Preparing bus location update payload', {
        busNumber,
        busCode: busCode || null,
        updatedFields
      });

      const updateQuery = window.supabaseClient
        .from('bus_location_shares')
        .update(updatedFields);

      if (busCode) {
        updateQuery.eq('bus_code', busCode);
      } else {
        updateQuery.eq('bus_number', busNumber);
      }

      const { data: updatedRows, error: updateError } = await updateQuery.select('*');

      if (updateError) {
        throw new Error(`Location update failed: ${updateError.message}`);
      }

      const updatedCount = Array.isArray(updatedRows) ? updatedRows.length : 0;
      console.log('insertShare: update result', {
        filter: busCode ? { bus_code: busCode } : { bus_number: busNumber },
        updatedCount,
        updatedRows
      });

      if (updatedCount > 0) {
        return updatedRows[0];
      }

      const { data: insertedRows, error: insertError } = await window.supabaseClient
        .from('bus_location_shares')
        .insert(insertPayload)
        .select('*');

      if (insertError) {
        throw new Error(`Location insert failed: ${insertError.message}`);
      }

      const insertedCount = Array.isArray(insertedRows) ? insertedRows.length : 0;
      console.log('insertShare: insert result', {
        insertedCount,
        insertedRows
      });

      if (insertedCount === 0) {
        throw new Error('Location save failed: Supabase inserted no rows.');
      }

      return insertedRows[0];
    },

    async getBuses() {
      if (!window.supabaseClient) {
        return { data: [], error: new Error('Supabase client is not available.') };
      }

      const { data, error } = await window.supabaseClient
        .from('buses')
        .select('id, bus_number, bus_code, active, route, starting_point, destination, stops')
        .order('bus_number', { ascending: true });

      return { data, error };
    },

    async createBus({ busNumber, route, startingPoint, destination, stops }) {
      if (!busNumber || !route || !startingPoint || !destination) {
        return { data: null, error: new Error('Please provide bus number, route, starting point, and destination.') };
      }

      if (!window.supabaseClient) {
        return { data: null, error: new Error('Supabase client is not available.') };
      }

      const normalizedBusNumber = String(busNumber).trim();
      const normalizedRoute = String(route).trim();
      const normalizedStartingPoint = String(startingPoint).trim();
      const normalizedDestination = String(destination).trim();
      const stopsArray = Array.isArray(stops)
        ? stops
        : String(stops || '')
            .split(',')
            .map((stop) => stop.trim())
            .filter(Boolean);

      const { data: existingBuses, error: existingError } = await window.supabaseClient
        .from('buses')
        .select('id')
        .eq('bus_number', normalizedBusNumber)
        .limit(1);

      if (existingError) {
        return { data: null, error: existingError };
      }

      if (existingBuses && existingBuses.length > 0) {
        return { data: null, error: new Error(`Bus ${normalizedBusNumber} already exists.`) };
      }

      const { data, error } = await window.supabaseClient
        .from('buses')
        .insert({
          bus_number: normalizedBusNumber,
          route: normalizedRoute,
          starting_point: normalizedStartingPoint,
          destination: normalizedDestination,
          stops: stopsArray,
          active: true,
          bus_code: null
        })
        .select('*')
        .single();

      return { data, error };
    },

    async getBusByNumber(busNumber) {
      if (!busNumber || !window.supabaseClient) {
        return { data: [], error: null };
      }

      const searchTerm = String(busNumber).trim();
      const pattern = `%${searchTerm}%`;

      console.log('getBusByNumber: searching buses table with case-insensitive partial match', {
        searchTerm,
        pattern
      });

      const { data, error } = await window.supabaseClient
        .from('buses')
        .select('id, bus_number, bus_code, active, route, starting_point, destination, stops')
        .ilike('bus_number', pattern)
        .order('created_at', { ascending: true })
        .limit(50);

      console.log('getBusByNumber: raw Supabase response', {
        searchTerm,
        data,
        error
      });

      return { data: Array.isArray(data) ? data : [], error };
    },

    async getActiveBusSharesForRoute(busNumber) {
      if (!busNumber || !window.supabaseClient) {
        return { data: [], error: new Error('A bus number is required to lookup active sessions.') };
      }

      console.log('getActiveBusSharesForRoute searching for bus_number:', busNumber);
      const nowTime = Date.now();
      const { data, error } = await window.supabaseClient
        .from('bus_location_shares')
        .select('bus_number, bus_code, latitude, longitude, updated_at, expires_at')
        .eq('bus_number', busNumber)
        .order('updated_at', { ascending: false });

      if (error) {
        return { data: [], error };
      }

      const activeRows = (data || []).filter((row) => {
        if (!row.expires_at || !row.updated_at) {
          return false;
        }

        const expiresAt = new Date(row.expires_at).getTime();
        const updatedAt = new Date(row.updated_at).getTime();
        return expiresAt > nowTime && updatedAt <= nowTime;
      });

      return { data: activeRows, error: null };
    },

    async getActiveBusLocationShares() {
      if (!window.supabaseClient) {
        return { data: [], error: new Error('Supabase client is not available.') };
      }

      const nowTime = Date.now();
      const { data, error } = await window.supabaseClient
        .from('bus_location_shares')
        .select('bus_number, bus_code, latitude, longitude, updated_at, expires_at')
        .order('updated_at', { ascending: false });

      if (error) {
        return { data: [], error };
      }

      const activeRows = (data || []).filter((row) => {
        if (!row.expires_at || !row.updated_at) {
          return false;
        }

        const expiresAt = new Date(row.expires_at).getTime();
        const updatedAt = new Date(row.updated_at).getTime();
        return expiresAt > nowTime && updatedAt <= nowTime;
      });

      return { data: activeRows, error: null };
    },

    async getLatestActiveBusLocation(busNumber, busCode = null) {
      if (!busNumber && !busCode) {
        return { data: null, error: null };
      }

      const nowTime = Date.now();
      const now = new Date(nowTime).toISOString();
      const filterDescription = busCode ? `bus_code=${busCode}` : `bus_number=${busNumber}`;
      console.log('getLatestActiveBusLocation searching for', { busNumber, busCode, filterDescription });

      const query = window.supabaseClient.from('bus_location_shares').select('bus_number, bus_code, latitude, longitude, updated_at, expires_at');

      if (busCode) {
        query.eq('bus_code', busCode);
      } else if (busNumber) {
        query.eq('bus_number', busNumber).order('updated_at', { ascending: false });
      }

      const { data, error } = await query;
      console.log('Supabase select result', { busNumber, busCode, now, data, error });

      if (error) {
        return { data: null, error };
      }

      const activeRows = (Array.isArray(data) ? data : [data]).filter((row) => {
        if (!row || !row.expires_at || !row.updated_at) {
          return false;
        }

        const expiresAt = new Date(row.expires_at).getTime();
        const updatedAt = new Date(row.updated_at).getTime();
        return expiresAt > nowTime && updatedAt <= nowTime;
      });

      const latestRow = activeRows.sort((a, b) => {
        const timeA = new Date(a.updated_at || 0).getTime();
        const timeB = new Date(b.updated_at || 0).getTime();
        return timeB - timeA;
      })[0] || null;

      return { data: latestRow, error: null };
    }

  };
} else {
  window.supabaseClient = null;
  window.supabaseHelpers = null;
}
