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

      if (!window.supabaseClient) {
        throw new Error('Supabase client is not available.');
      }

      const payload = {
        bus_number: busNumber,
        latitude,
        longitude,
        updated_at: new Date().toISOString(),
        expires_at: expiresAt
      };

      console.log('Preparing bus location update payload', payload);

      try {
        const { data: existingRows, error: selectError } = await window.supabaseClient
          .from('bus_location_shares')
          .select('id')
          .eq('bus_number', busNumber)
          .limit(1);

        if (selectError) {
          throw selectError;
        }

        if (existingRows && existingRows.length > 0) {
          const { data, error } = await window.supabaseClient
            .from('bus_location_shares')
            .update({
              latitude,
              longitude,
              updated_at: payload.updated_at,
              expires_at: expiresAt
            })
            .eq('bus_number', busNumber)
            .select('*')
            .single();

          if (error) {
            throw error;
          }

          return data;
        }

        const { data, error } = await window.supabaseClient
          .from('bus_location_shares')
          .insert(payload)
          .select('*')
          .single();

        if (error) {
          throw error;
        }

        return data;
      } catch (error) {
        const isDuplicateKeyError =
          error?.code === '23505' ||
          error?.details?.includes('duplicate key') ||
          error?.message?.includes('duplicate key') ||
          error?.message?.includes('23505');

        if (!isDuplicateKeyError) {
          throw error;
        }

        const { data, error: updateError } = await window.supabaseClient
          .from('bus_location_shares')
          .update({
            latitude,
            longitude,
            updated_at: payload.updated_at,
            expires_at: expiresAt
          })
          .eq('bus_number', busNumber)
          .select('*')
          .single();

        if (updateError) {
          throw updateError;
        }

        return data;
      }
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
