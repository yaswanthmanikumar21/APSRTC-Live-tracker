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

      const payload = {
        bus_number: busNumber,
        bus_code: busCode || null,
        latitude,
        longitude,
        updated_at: new Date().toISOString(),
        expires_at: expiresAt
      };

      console.log('Preparing bus location update payload', payload);

      // If busCode is provided, always operate by bus_code only.
      try {
        if (busCode) {
          // Try updating the row(s) for this bus_code first
          const { data: updatedRows, error: updateError } = await window.supabaseClient
            .from('bus_location_shares')
            .update({
              bus_number: busNumber,
              bus_code: busCode || null,
              latitude,
              longitude,
              updated_at: payload.updated_at,
              expires_at: expiresAt
            })
            .eq('bus_code', busCode)
            .select('*');

          if (updateError) {
            throw updateError;
          }

          console.log('insertShare: updatedRows (by bus_code) count =', Array.isArray(updatedRows) ? updatedRows.length : (updatedRows ? 1 : 0));

          if (Array.isArray(updatedRows) && updatedRows.length > 0) {
            // Return the first updated row (there should normally be one)
            return updatedRows[0];
          }

          // No existing row for this bus_code -> try inserting a new one
          try {
            const { data: inserted, error: insertError } = await window.supabaseClient
              .from('bus_location_shares')
              .insert(payload)
              .select('*');

            if (insertError) {
              throw insertError;
            }

            console.log('insertShare: inserted rows count (by bus_code) =', Array.isArray(inserted) ? inserted.length : (inserted ? 1 : 0));
            return Array.isArray(inserted) ? inserted[0] : inserted;
          } catch (insErr) {
            // If insert failed due to duplicate race, try update again silently
            const isDuplicateKeyError =
              insErr?.code === '23505' ||
              insErr?.details?.includes('duplicate key') ||
              insErr?.message?.includes('duplicate key') ||
              insErr?.message?.includes('23505');

            if (!isDuplicateKeyError) {
              throw insErr;
            }

            // Retry update after duplicate key indicates a concurrent insert happened
            const { data: finalUpdated, error: finalUpdateError } = await window.supabaseClient
              .from('bus_location_shares')
              .update({
                bus_number: busNumber,
                bus_code: busCode || null,
                latitude,
                longitude,
                updated_at: payload.updated_at,
                expires_at: expiresAt
              })
              .eq('bus_code', busCode)
              .select('*');

            if (finalUpdateError) {
              throw finalUpdateError;
            }

            console.log('insertShare: finalUpdated (after duplicate) count =', Array.isArray(finalUpdated) ? finalUpdated.length : (finalUpdated ? 1 : 0));
            return Array.isArray(finalUpdated) ? finalUpdated[0] : finalUpdated;
          }
        }

        // No busCode provided: try to find the most recent session for this bus_number and update it,
        // otherwise insert a new share row tied to the bus_number.
        const { data: existingRows, error: selectError } = await window.supabaseClient
          .from('bus_location_shares')
          .select('id, bus_code')
          .eq('bus_number', busNumber)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (selectError) {
          throw selectError;
        }

        console.log('insertShare: existingRows (by bus_number) count =', Array.isArray(existingRows) ? existingRows.length : (existingRows ? 1 : 0));

        if (Array.isArray(existingRows) && existingRows.length > 0) {
          // Update the most recent session (by id) rather than updating all rows for the route
          const targetId = existingRows[0].id;

          const { data: updated, error: updateErr } = await window.supabaseClient
            .from('bus_location_shares')
            .update({
              bus_number: busNumber,
              bus_code: existingRows[0].bus_code || null,
              latitude,
              longitude,
              updated_at: payload.updated_at,
              expires_at: expiresAt
            })
            .eq('id', targetId)
            .select('*');

          if (updateErr) {
            throw updateErr;
          }

          console.log('insertShare: updated rows count (by id) =', Array.isArray(updated) ? updated.length : (updated ? 1 : 0));
          return Array.isArray(updated) ? updated[0] : updated;
        }

        // No existing session found for this bus_number -> insert a new row
        const { data: insertedNew, error: insertNewError } = await window.supabaseClient
          .from('bus_location_shares')
          .insert(payload)
          .select('*');

        if (insertNewError) {
          // If insert failed due to duplicate key, try to update by bus_number as a fallback
          const isDuplicateKey =
            insertNewError?.code === '23505' ||
            insertNewError?.details?.includes('duplicate key') ||
            insertNewError?.message?.includes('duplicate key') ||
            insertNewError?.message?.includes('23505');

          if (!isDuplicateKey) {
            throw insertNewError;
          }

          // Retry: update most recent row for bus_number
          const { data: retryRows, error: retryErr } = await window.supabaseClient
            .from('bus_location_shares')
            .update({
              bus_number: busNumber,
              bus_code: null,
              latitude,
              longitude,
              updated_at: payload.updated_at,
              expires_at: expiresAt
            })
            .eq('bus_number', busNumber)
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(1);

          if (retryErr) {
            throw retryErr;
          }

          console.log('insertShare: retry updated rows count (by bus_number) =', Array.isArray(retryRows) ? retryRows.length : (retryRows ? 1 : 0));
          return Array.isArray(retryRows) ? retryRows[0] : retryRows;
        }

        console.log('insertShare: inserted rows count (no bus_code) =', Array.isArray(insertedNew) ? insertedNew.length : (insertedNew ? 1 : 0));
        return Array.isArray(insertedNew) ? insertedNew[0] : insertedNew;
      } catch (err) {
        throw err;
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
        return { data: null, error: null };
      }

      const { data, error } = await window.supabaseClient
        .from('buses')
        .select('id, bus_number, bus_code, active, route, starting_point, destination, stops')
        .eq('bus_number', busNumber)
        .order('created_at', { ascending: true })
        .limit(1);

      return { data: Array.isArray(data) && data.length > 0 ? data[0] : null, error };
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
