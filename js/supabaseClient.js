const SUPABASE_URL = 'https://fwtgmetudrfqhgtcyfxi.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_ZjjT3XB8Ii8lJmfkl2MTRg_ZWEWDpnM";

if (window.supabase && SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  window.supabaseHelpers = {
    async insertShare({ busNumber, latitude, longitude, expiresAt }) {
      if (!busNumber) {
        throw new Error('A bus number is required before saving location data.');
      }

      if (!SUPABASE_PUBLISHABLE_KEY || SUPABASE_PUBLISHABLE_KEY.includes('YOUR_')) {
        throw new Error('Supabase publishable key is not configured. Update js/supabaseClient.js.');
      }

      const payload = {
        bus_number: busNumber,
        latitude,
        longitude,
        updated_at: new Date().toISOString(),
        expires_at: expiresAt
      };

      console.log('Supabase upsert payload', payload);

      const response = await fetch(`${SUPABASE_URL}/rest/v1/bus_location_shares?on_conflict=bus_number&select=*`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation,resolution=merge-duplicates'
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      let resultData = null;

      try {
        resultData = responseText ? JSON.parse(responseText) : null;
      } catch (error) {
        resultData = null;
      }

      console.log('Supabase upsert result', { status: response.status, data: resultData, responseText });

      if (!response.ok) {
        throw new Error(`Supabase upsert failed with status ${response.status}: ${responseText}`);
      }

      return Array.isArray(resultData) ? resultData[0] ?? null : resultData ?? null;
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

    async getBusByNumber(busNumber) {
      if (!busNumber || !window.supabaseClient) {
        return { data: null, error: null };
      }

      const { data, error } = await window.supabaseClient
        .from('buses')
        .select('id, bus_number, bus_code, active, route, starting_point, destination, stops')
        .eq('bus_number', busNumber)
        .maybeSingle();

      return { data, error };
    },

    async getLatestActiveBusLocation(busNumber) {
      if (!busNumber) {
        return { data: null, error: null };
      }

      const nowTime = Date.now();
      const now = new Date(nowTime).toISOString();
      console.log('Supabase select query started', {
        busNumber,
        now,
        query: 'bus_location_shares'
      });

      const { data, error } = await window.supabaseClient
        .from('bus_location_shares')
        .select('bus_number, latitude, longitude, updated_at, expires_at')
        .eq('bus_number', busNumber)
        .order('updated_at', { ascending: false });

      console.log('Supabase select result', { busNumber, now, data, error });

      if (error) {
        return { data: null, error };
      }

      const activeRows = (data || []).filter((row) => {
        if (!row.expires_at || !row.updated_at) {
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
