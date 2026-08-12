let busCatalog = [];

const busList = document.getElementById('busList');
const searchForm = document.getElementById('searchForm');
const searchMessage = document.getElementById('searchMessage');
const resultCard = document.getElementById('resultCard');
const resultTitle = document.getElementById('resultTitle');
const resultNumber = document.getElementById('resultNumber');
const resultRoute = document.getElementById('resultRoute');
const resultStart = document.getElementById('resultStart');
const resultDestination = document.getElementById('resultDestination');
const resultStatus = document.getElementById('resultStatus');
const resultStops = document.getElementById('resultStops');
const mapWrapper = document.getElementById('mapWrapper');
const shareLocationBtn = document.getElementById('shareLocationBtn');
const stopSharingBtn = document.getElementById('stopSharingBtn');
const timerSelect = document.getElementById('timerSelect');
const locationPanel = document.getElementById('locationPanel');
const locationStatusText = document.getElementById('locationStatusText');
const latitudeValue = document.getElementById('latitudeValue');
const longitudeValue = document.getElementById('longitudeValue');
const lastUpdateValue = document.getElementById('lastUpdateValue');
const gpsDebugText = document.getElementById('gpsDebugText');

const defaultMapCenter = [17.6868, 83.2185];
let map;
let userLocationMarker;
let liveBusMarker;
let watchId = null;
let locationTimer = null;
let currentBusNumber = null;
let activeBusSearch = 0;
let lastSavedCoordinates = null;
let lastSavedBusNumber = null;
let lastSeenBusUpdatedAt = null;
let isSharingActive = false;
let realtimeSubscription = null;
let currentRealtimeBusNumber = null;
let wakeLockSentinel = null;
let gpsDebugStatus = 'waiting';
let gpsDebugCallbackTime = 'none';
let gpsDebugLatitude = 'none';
let gpsDebugLongitude = 'none';
let gpsDebugError = 'none';

function renderGpsDebug() {
  if (!gpsDebugText) {
    return;
  }

  gpsDebugText.textContent = [
    `GPS watcher: ${gpsDebugStatus}`,
    `Last callback: ${gpsDebugCallbackTime}`,
    `Latest lat/lng: ${gpsDebugLatitude}, ${gpsDebugLongitude}`,
    `Error: ${gpsDebugError}`
  ].join('\n');
}

function setGpsDebugState(partialState) {
  if (partialState.status !== undefined) {
    gpsDebugStatus = partialState.status;
  }

  if (partialState.callbackTime !== undefined) {
    gpsDebugCallbackTime = partialState.callbackTime;
  }

  if (partialState.latitude !== undefined) {
    gpsDebugLatitude = partialState.latitude;
  }

  if (partialState.longitude !== undefined) {
    gpsDebugLongitude = partialState.longitude;
  }

  if (partialState.error !== undefined) {
    gpsDebugError = partialState.error;
  }

  renderGpsDebug();
}

function initMap() {
  map = L.map('map').setView(defaultMapCenter, 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}

async function requestWakeLock() {
  if (typeof navigator === 'undefined' || !navigator.wakeLock) {
    console.error('Wake Lock API is not supported in this browser.');
    return;
  }

  if (document.visibilityState === 'hidden') {
    return;
  }

  try {
    wakeLockSentinel = await navigator.wakeLock.request('screen');
    wakeLockSentinel.addEventListener('release', () => {
      console.log('Screen wake lock released');
    });
  } catch (error) {
    console.error('Failed to acquire wake lock:', error);
  }
}

function releaseWakeLock() {
  if (!wakeLockSentinel) {
    return;
  }

  wakeLockSentinel.release().catch((error) => {
    console.error('Failed to release wake lock:', error);
  });
  wakeLockSentinel = null;
}

function getActiveBusCatalog() {
  return Array.isArray(busCatalog) ? busCatalog : [];
}

function normalizeBusRecord(bus) {
  if (!bus) {
    return null;
  }

  const busNumber = bus.bus_number ?? bus.busNumber ?? bus.bus_code ?? '';
  const route = bus.route ?? bus.routeName ?? '';
  const startingPoint = bus.starting_point ?? bus.startingPoint ?? '';
  const destination = bus.destination ?? '';
  const stops = Array.isArray(bus.stops)
    ? bus.stops
    : typeof bus.stops === 'string'
      ? bus.stops.split(',').map((stop) => stop.trim()).filter(Boolean)
      : [];

  return {
    busNumber: String(busNumber).trim(),
    routeName: String(route || 'Not available').trim(),
    startingPoint: String(startingPoint || 'Not available').trim(),
    destination: String(destination || 'Not available').trim(),
    stops: stops.map((stop) => String(stop).trim()).filter(Boolean),
    status: bus.active === false ? 'Inactive' : 'Active'
  };
}

function renderBusCards() {
  busList.innerHTML = '';

  const busesToRender = getActiveBusCatalog();

  if (!busesToRender.length) {
    const emptyCard = document.createElement('article');
    emptyCard.className = 'bus-card';
    emptyCard.innerHTML = '<p class="bus-route">No buses available right now.</p>';
    busList.appendChild(emptyCard);
    return;
  }

  busesToRender.forEach((bus) => {
    const card = document.createElement('article');
    card.className = 'bus-card';

    card.innerHTML = `
      <h3 class="bus-number">${bus.busNumber}</h3>
      <p class="bus-route">Route: ${bus.routeName}</p>
      <p class="bus-status">Status: ${bus.status}</p>
    `;

    busList.appendChild(card);
  });
}

async function loadBusCatalog() {
  if (!window.supabaseHelpers) {
    busCatalog = [];
    renderBusCards();
    searchMessage.textContent = 'Bus catalog is unavailable right now.';
    return;
  }

  searchMessage.textContent = 'Loading bus catalog...';

  try {
    const { data, error } = await window.supabaseHelpers.getBuses();

    if (error) {
      throw error;
    }

    const normalizedBuses = (data || [])
      .map((bus) => normalizeBusRecord(bus))
      .filter(Boolean);

    if (normalizedBuses.length > 0) {
      busCatalog = normalizedBuses;
      renderBusCards();
      searchMessage.textContent = `Loaded ${normalizedBuses.length} buses from the live catalog.`;
    } else {
      busCatalog = [];
      renderBusCards();
      searchMessage.textContent = 'No bus records were returned from Supabase.';
    }
  } catch (error) {
    console.error('Failed to load buses from Supabase', error);
    busCatalog = [];
    renderBusCards();
    searchMessage.textContent = 'Unable to load the bus catalog right now.';
  }
}

function stopLocationSharing(message = 'Location sharing stopped.') {
  isSharingActive = false;

  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  if (locationTimer) {
    clearTimeout(locationTimer);
    locationTimer = null;
  }

  if (userLocationMarker && map) {
    map.removeLayer(userLocationMarker);
    userLocationMarker = null;
  }

  releaseWakeLock();

  lastSavedCoordinates = null;
  lastSavedBusNumber = null;

  locationPanel.hidden = false;
  locationStatusText.textContent = message;
  latitudeValue.textContent = '-';
  longitudeValue.textContent = '-';
  lastUpdateValue.textContent = '-';
  stopSharingBtn.hidden = true;
  setGpsDebugState({
    status: 'stopped',
    callbackTime: 'none',
    latitude: 'none',
    longitude: 'none',
    error: message
  });
}

function getExpiresAt(selectedDuration) {
  if (selectedDuration > 0) {
    return new Date(Date.now() + selectedDuration).toISOString();
  }

  return null;
}

function getCoordinateKey(latitude, longitude) {
  return `${Number(latitude.toFixed(6))},${Number(longitude.toFixed(6))}`;
}

async function saveLocationToSupabase(latitude, longitude, busNumber = currentBusNumber) {
  const selectedBusNumber = (busNumber || currentBusNumber || resultNumber.textContent.trim()).trim();

  if (!selectedBusNumber) {
    throw new Error('No bus selected.');
  }

  if (!window.supabaseHelpers) {
    throw new Error('Supabase helpers are not available.');
  }

  const coordinateKey = getCoordinateKey(latitude, longitude);

  const selectedDuration = Number(timerSelect.value);
  const expiresAt = getExpiresAt(selectedDuration);

  console.log('GPS location received and preparing to save to Supabase', {
    busNumber: selectedBusNumber,
    latitude,
    longitude,
    expiresAt
  });

  await window.supabaseHelpers.insertShare({
    busNumber: selectedBusNumber,
    latitude,
    longitude,
    expiresAt
  });

  lastSavedCoordinates = coordinateKey;
  lastSavedBusNumber = selectedBusNumber;
  console.log('GPS location successfully saved to Supabase', {
    busNumber: selectedBusNumber,
    latitude,
    longitude
  });
}

function updateUserLocation(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const positionTimestamp = position.timestamp || Date.now();
  const positionTimeLabel = new Date(positionTimestamp).toLocaleTimeString();

  console.log('GPS location received from watchPosition', { latitude, longitude, positionTimestamp });

  setGpsDebugState({
    status: 'callback received',
    callbackTime: positionTimeLabel,
    latitude: latitude.toFixed(6),
    longitude: longitude.toFixed(6),
    error: 'none'
  });

  latitudeValue.textContent = latitude.toFixed(6);
  longitudeValue.textContent = longitude.toFixed(6);
  lastUpdateValue.textContent = formatIndianTime(new Date(positionTimestamp).toISOString());
  locationStatusText.textContent = 'Location sharing is active';
  locationPanel.hidden = false;
  stopSharingBtn.hidden = false;

  if (map) {
    if (!userLocationMarker) {
      userLocationMarker = L.marker([latitude, longitude]).addTo(map);
      userLocationMarker.bindPopup('My Location');
    } else {
      userLocationMarker.setLatLng([latitude, longitude]);
    }

    if (!userLocationMarker) map.setView([latitude, longitude]);
    map.invalidateSize();
  }

  if (!isSharingActive) {
    return;
  }

  saveLocationToSupabase(latitude, longitude, currentBusNumber).catch((error) => {
    console.error('Supabase insert failed', error);
    locationStatusText.textContent = `Location sharing is active. Supabase save failed: ${error.message}`;
  });
}

function startLocationSharing() {
  if (!navigator.geolocation) {
    stopLocationSharing('Location is not supported by this browser.');
    return;
  }

  const selectedBusFromResult = resultNumber.textContent.trim();
  currentBusNumber = selectedBusFromResult && selectedBusFromResult !== '-' ? selectedBusFromResult : null;

  if (!currentBusNumber) {
    stopLocationSharing('Select a bus first.');
    return;
  }

  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }

  if (locationTimer) {
    clearTimeout(locationTimer);
  }

  isSharingActive = true;
  const selectedDuration = Number(timerSelect.value);

  locationPanel.hidden = false;
  locationStatusText.textContent = 'Requesting your location...';
  latitudeValue.textContent = '-';
  longitudeValue.textContent = '-';
  lastUpdateValue.textContent = '-';
  stopSharingBtn.hidden = false;
  setGpsDebugState({
    status: 'GPS watcher started',
    callbackTime: 'waiting for callback',
    latitude: 'waiting',
    longitude: 'waiting',
    error: 'none'
  });

  watchId = navigator.geolocation.watchPosition(
    (position) => updateUserLocation(position),
    (error) => {
      console.error('Geolocation watch error', error);
      let message = 'Unable to get your location.';
      setGpsDebugState({
        status: 'geolocation error',
        callbackTime: 'none',
        latitude: 'none',
        longitude: 'none',
        error: message
      });

      if (error.code === error.PERMISSION_DENIED) {
        message = 'Location permission denied.';
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        message = 'Location unavailable.';
      } else if (error.code === error.TIMEOUT) {
        message = 'Location request timed out.';
      }

      stopLocationSharing(message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );

  requestWakeLock();

  if (selectedDuration > 0) {
    locationTimer = setTimeout(() => {
      stopLocationSharing('Location sharing stopped.');
    }, selectedDuration);
  }
}

function clearLiveBusMarker() {
  if (liveBusMarker && map) {
    map.removeLayer(liveBusMarker);
  }
  liveBusMarker = null;
}

function stopRealtimeSubscription() {
  if (realtimeSubscription) {
    try {
      window.supabaseClient.realtime.removeChannel(realtimeSubscription);
    } catch (error) {
      console.warn('Could not remove Realtime subscription', error);
    }
    realtimeSubscription = null;
  }
  currentRealtimeBusNumber = null;
}

function formatIndianTime(value) {
  if (!value) {
    return 'unknown time';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'unknown time';
  }

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(parsedDate);
}

async function updateLiveBusLocationFromRow(row, liveMessage) {
  if (!row) {
    return;
  }

  if (!row.updated_at || !row.expires_at) {
    return;
  }

  const nowTime = Date.now();
  const expiresAt = new Date(row.expires_at).getTime();
  const updatedAt = new Date(row.updated_at).getTime();

  if (expiresAt <= nowTime || updatedAt > nowTime) {
    return;
  }

  const incomingUpdatedAt = updatedAt;
  const hasNewerValue = !lastSeenBusUpdatedAt || incomingUpdatedAt > lastSeenBusUpdatedAt;

  if (!hasNewerValue) {
    return;
  }

  lastSeenBusUpdatedAt = incomingUpdatedAt;

  const currentPosition = [row.latitude, row.longitude];
  const markerAlreadyExists = Boolean(liveBusMarker);

  if (!liveBusMarker) {
    liveBusMarker = L.marker(currentPosition).addTo(map);
    liveBusMarker.bindPopup('🚌 Live Bus Location');
  } else {
    liveBusMarker.setLatLng(currentPosition);
  }

  const lastUpdated = formatIndianTime(row.updated_at);
  liveMessage.textContent = `Live bus location found. Last updated: ${lastUpdated}`;

  if (map && !markerAlreadyExists) {
    map.setView(currentPosition);
    map.invalidateSize();
  }
}

async function startRealtimeForBus(busNumber) {
  stopRealtimeSubscription();
  activeBusSearch += 1;
  const thisSearchId = activeBusSearch;
  lastSeenBusUpdatedAt = null;

  const liveMessage = document.getElementById('liveLocationMessage');

  if (!window.supabaseHelpers || !window.supabaseClient) {
    liveMessage.textContent = 'Live location lookup is unavailable right now.';
    return;
  }

  try {
    const { data, error } = await window.supabaseHelpers.getLatestActiveBusLocation(busNumber);

    if (thisSearchId !== activeBusSearch) {
      return;
    }

    if (error) {
      throw error;
    }

    if (!data) {
      clearLiveBusMarker();
      liveMessage.textContent = 'No live location available for this bus.';
    } else {
      await updateLiveBusLocationFromRow(data, liveMessage);
    }
  } catch (error) {
    if (thisSearchId === activeBusSearch) {
      clearLiveBusMarker();
      liveMessage.textContent = 'Could not load the live location right now.';
    }
  }

  if (thisSearchId !== activeBusSearch) {
    return;
  }

  currentRealtimeBusNumber = busNumber;
  realtimeSubscription = window.supabaseClient.channel(`bus-${busNumber}`);

  realtimeSubscription.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'bus_location_shares'
    },
    (payload) => {
      const row = payload.new;
      if (!row || row.bus_number !== busNumber) {
        return;
      }

      const liveMessage = document.getElementById('liveLocationMessage');
      if (liveMessage) {
        updateLiveBusLocationFromRow(row, liveMessage);
      }
    }
  );

  realtimeSubscription.subscribe();
}

async function showBusDetails(bus) {
  const normalizedBus = normalizeBusRecord(bus);

  if (!normalizedBus) {
    resultCard.hidden = true;
    mapWrapper.hidden = true;
    searchMessage.textContent = 'Bus not found.';
    return;
  }

  resultTitle.textContent = `Bus ${normalizedBus.busNumber}`;
  resultNumber.textContent = normalizedBus.busNumber;
  resultRoute.textContent = normalizedBus.routeName;
  resultStart.textContent = normalizedBus.startingPoint;
  resultDestination.textContent = normalizedBus.destination;
  resultStatus.textContent = normalizedBus.status;

  resultStops.innerHTML = '';

  if (!normalizedBus.stops.length) {
    const item = document.createElement('li');
    item.className = 'stop-item';
    item.textContent = 'No stops available.';
    resultStops.appendChild(item);
  } else {
    normalizedBus.stops.forEach((stop) => {
      const item = document.createElement('li');
      item.className = 'stop-item';
      item.textContent = stop;
      resultStops.appendChild(item);
    });
  }

  resultCard.hidden = false;
  mapWrapper.hidden = false;

  if (map) {
    map.setView(defaultMapCenter, 13);
    setTimeout(() => map.invalidateSize(), 100);
  }

  startRealtimeForBus(normalizedBus.busNumber);
}

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const input = document.getElementById('busNumber');
  const query = input.value.trim();

  if (!query) {
    searchMessage.textContent = 'Please enter a bus number to continue.';
    resultCard.hidden = true;
    mapWrapper.hidden = true;
    return;
  }

  if (!window.supabaseHelpers) {
    stopRealtimeSubscription();
    clearLiveBusMarker();
    resultCard.hidden = true;
    mapWrapper.hidden = true;
    searchMessage.textContent = 'Bus search is unavailable right now.';
    return;
  }

  try {
    const { data, error } = await window.supabaseHelpers.getBusByNumber(query);

    if (error) {
      throw error;
    }

    if (!data) {
      stopRealtimeSubscription();
      clearLiveBusMarker();
      resultCard.hidden = true;
      mapWrapper.hidden = true;
      searchMessage.textContent = 'Bus not found.';
      return;
    }

    const foundBus = normalizeBusRecord(data);

    if (!foundBus || !foundBus.busNumber) {
      stopRealtimeSubscription();
      clearLiveBusMarker();
      resultCard.hidden = true;
      mapWrapper.hidden = true;
      searchMessage.textContent = 'Bus not found.';
      return;
    }

    await showBusDetails(foundBus);
    searchMessage.textContent = `Showing details for bus ${foundBus.busNumber}.`;
  } catch (error) {
    console.error('Bus search failed', error);
    stopRealtimeSubscription();
    clearLiveBusMarker();
    resultCard.hidden = true;
    mapWrapper.hidden = true;
    searchMessage.textContent = 'Bus not found.';
  }
});

shareLocationBtn.addEventListener('click', startLocationSharing);
stopSharingBtn.addEventListener('click', () => {
  stopLocationSharing('Location sharing stopped.');
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    requestWakeLock();
  }
});

initMap();
renderBusCards();
loadBusCatalog();
