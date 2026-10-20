let busCatalog = [];
let currentBusSessionCode = null;
let activeBusSessions = [];
let busSearchResults = [];
let searchResultCards = [];
let busSearchQuery = '';
let liveOnlySearch = false;
let nearbySearchResults = false;
let searchResultTimestampTicker = null;
let activeCatalogBusNumbers = new Set();
let activeLiveSessions = [];
let favoriteBusNumbers = new Set();
let shareCelebrationShown = false;
let toastSequence = 0;
let detailsReturnView = { type: 'catalog' };
let pendingBusDetailsOpen = null;
let lastInputSearchAt = 0;
let globalErrorToastActive = false;
let globalErrorToastTimer = null;
let activeCatalogRetryTimer = null;
let liveMapRetryTimer = null;

const busList = document.getElementById('busList');
const liveNowList = document.getElementById('liveNowList');
const favoriteBusList = document.getElementById('favoriteBusList');
const myBusesSection = document.getElementById('myBusesSection');
const favoriteBusBtn = document.getElementById('favoriteBusBtn');
const homeLink = document.getElementById('homeLink');
const moreMenu = document.getElementById('moreMenu');
const moreMenuBtn = document.getElementById('moreMenuBtn');
const bottomHomeBtn = document.getElementById('bottomHomeBtn');
const bottomLiveMapBtn = document.getElementById('bottomLiveMapBtn');
const moreMenuCloseBtn = document.getElementById('moreMenuCloseBtn');
const moreDisclaimerBtn = document.getElementById('moreDisclaimerBtn');
const moreInstallSlot = document.getElementById('moreInstallSlot');
const shareMyBusLocationBtn = document.getElementById('shareMyBusLocationBtn');
const searchForm = document.getElementById('searchForm');
const androidAppCard = document.getElementById('androidAppCard');
if (window.Capacitor && androidAppCard) {
  androidAppCard.hidden = true;
}
const recentSearches = document.getElementById('recentSearches');
const recentSearchChips = document.getElementById('recentSearchChips');
const findNearbyBtn = document.getElementById('findNearbyBtn');
const toggleAddBusBtn = document.getElementById('toggleAddBusBtn');
const addBusSection = document.getElementById('addBusSection');
const addBusForm = document.getElementById('addBusForm');
const addBusMessage = document.getElementById('addBusMessage');
const newBusNumber = document.getElementById('newBusNumber');
const newBusRoute = document.getElementById('newBusRoute');
const newBusStart = document.getElementById('newBusStart');
const newBusDestination = document.getElementById('newBusDestination');
const newBusStops = document.getElementById('newBusStops');
const searchMessage = document.getElementById('searchMessage');
const searchResultsContainer = document.getElementById('searchResultsContainer');
const searchResultsMessage = document.getElementById('searchResultsMessage');
const searchResultsList = document.getElementById('searchResultsList');
const loadingIndicator = document.getElementById('loadingIndicator');
const connectionError = document.getElementById('connectionError');
const connectionErrorMessage = document.getElementById('connectionErrorMessage');
const retryDataLoadBtn = document.getElementById('retryDataLoadBtn');
const offlineBanner = document.getElementById('offlineBanner');
const mapTileError = document.getElementById('mapTileError');
const mapEmptyMessage = document.getElementById('mapEmptyMessage');
const toastContainer = document.getElementById('toastContainer');
const reportIssueLink = document.getElementById('reportIssueLink');
const resultCard = document.getElementById('resultCard');
const detailsContent = document.getElementById('detailsContent');
const detailsBackBtn = document.getElementById('detailsBackBtn');
const resultTitle = document.getElementById('resultTitle');
const copyBusLinkBtn = document.getElementById('copyBusLinkBtn');
const copyBusLinkMessage = document.getElementById('copyBusLinkMessage');
const resultNumber = document.getElementById('resultNumber');
const resultRoute = document.getElementById('resultRoute');
const resultStart = document.getElementById('resultStart');
const resultDestination = document.getElementById('resultDestination');
const resultStatus = document.getElementById('resultStatus');
const livePanelStatus = document.getElementById('livePanelStatus');
const livePanelUpdated = document.getElementById('livePanelUpdated');
const resultSessionCode = document.getElementById('resultSessionCode');
const resultStops = document.getElementById('resultStops');
const liveDirection = document.getElementById('liveDirection');
const liveDirectionArrow = document.getElementById('liveDirectionArrow');
const liveDirectionDot = document.getElementById('liveDirectionDot');
const liveDirectionLabel = document.getElementById('liveDirectionLabel');
const liveMovement = document.getElementById('liveMovement');
const capacityStatus = document.getElementById('capacityStatus');
const capacityMessage = document.getElementById('capacityMessage');
const capacityButtons = document.querySelectorAll('[data-capacity-status]');
const activeSessionsContainer = document.getElementById('activeSessionsContainer');
const activeSessionsHeading = document.getElementById('activeSessionsHeading');
const activeSessionsMessage = document.getElementById('activeSessionsMessage');
const activeSessionsList = document.getElementById('activeSessionsList');
const mapWrapper = document.getElementById('mapWrapper');
const followBusBtn = document.getElementById('followBusBtn');
const panelFollowBtn = document.getElementById('panelFollowBtn');
const detailsMapBtn = document.getElementById('detailsMapBtn');
const mapDetailsBtn = document.getElementById('mapDetailsBtn');
const detailsDragHandle = document.querySelector('.details-drag-handle');
const liveBusesNearMeBtn = document.getElementById('liveBusesNearMeBtn');
const shareLocationBtn = document.getElementById('shareLocationBtn');
const busTypeOptions = document.querySelectorAll('input[name="shareBusType"]');
const busTypeChoiceHint = document.getElementById('busTypeChoiceHint');
const stopSharingBtn = document.getElementById('stopSharingBtn');
const timerSelect = document.getElementById('timerSelect');
const customDurationMinutes = document.getElementById('customDurationMinutes');
const sharingDisclaimer = document.getElementById('sharingDisclaimer');
const dismissSharingDisclaimer = document.getElementById('dismissSharingDisclaimer');
const locationPanel = document.getElementById('locationPanel');
const locationStatusText = document.getElementById('locationStatusText');
const sharingReminder = document.getElementById('sharingReminder');
const latitudeValue = document.getElementById('latitudeValue');
const longitudeValue = document.getElementById('longitudeValue');
const lastUpdateValue = document.getElementById('lastUpdateValue');
const gpsDebugText = document.getElementById('gpsDebugText');

const defaultMapCenter = [17.6868, 83.2185];
let map;
let userLocationMarker;
let liveBusMarker;
let liveMapMarkers = [];
let liveMapRefreshInterval = null;
let liveCatalogRefreshInterval = null;
let followLiveBus = true;
let followMapInitializedForBus = false;
let initialBusFlyInProgress = false;
let deferredInitialBusFlyIn = false;
let currentLiveBusExpiresAt = null;
let mapUserGestureAt = 0;
let programmaticMapMove = false;
let programmaticMapMoveTimer = null;
let lastFollowPanAt = 0;
let panelDragStartY = null;
let panelDragHandled = false;
let panelDragStartOffset = 0;
let panelDragPointerId = null;
let panelDragSamples = [];
let panelDragFrame = null;
let panelSnapTimer = null;
let panelDragIsContentScroll = false;
let detailsHistoryEntry = false;
let detailsHistoryEntryId = null;
let previousLiveBusPosition = null;
let liveBusTrail = [];
let liveBusTrailSegments = [];
let liveBusTrailKey = null;
let previousLiveStatusReading = null;
let liveStatusLastMovedAt = null;
let liveStatusBearing = null;
let liveStatusTicker = null;
let watchId = null;
let locationTimer = null;
let currentBusNumber = null;
let currentBusRoute = null;
let currentDisplayedBusRecord = null;
let currentBusType = null;
let selectedShareBusType = null;
let busTypeUpdateStarted = false;
let activeBusSearch = 0;
let lastSavedCoordinates = null;
let lastSavedBusNumber = null;
let lastGpsCallbackTime = 0;
let lastLocationUpdateAt = null;
let lastSeenBusUpdatedAt = null;
let isSharingActive = false;
let realtimeSubscription = null;
let currentRealtimeBusNumber = null;
let currentRealtimeBusCode = null;
let senderLocationTicker = null;
let busLocationTicker = null;
let liveBusUpdatedAt = null;
let gpsRefreshInterval = null;
let forcedRefreshInterval = null;
let nearbyBusRefreshInterval = null;
let nearbyBusTimestampTicker = null;
let nearbyBusLatitude = null;
let nearbyBusLongitude = null;
let nearbyBusRefreshInFlight = false;
let wakeLockSentinel = null;
let gpsBackupWorker = null;
let gpsBackupWorkerUnavailable = false;
let lastGpsBackupRequestAt = 0;
let gpsDebugStatus = 'waiting';
let gpsDebugCallbackTime = 'none';
let gpsDebugLatitude = 'none';
let gpsDebugLongitude = 'none';
let gpsDebugError = 'none';

try {
  const savedBusType = localStorage.getItem('apsrtc-live-bus-type');
  if (['ordinary', 'metro_express'].includes(savedBusType)) {
    selectedShareBusType = savedBusType;
    busTypeOptions.forEach((option) => {
      option.checked = option.value === savedBusType;
    });
  }
} catch (error) {
  console.warn('The last selected bus type could not be restored.', error);
}

function createBusTypeBadge(busType) {
  if (!['ordinary', 'metro_express'].includes(busType)) {
    return null;
  }

  const badge = document.createElement('span');
  badge.className = 'bus-type-badge';
  badge.dataset.busType = busType;
  badge.textContent = busType === 'ordinary' ? t('ordinary') : t('metroExpress');
  return badge;
}

function setBusTypeBadges(busType) {
  currentBusType = ['ordinary', 'metro_express'].includes(busType)
    ? busType
    : null;
  resultTitle.querySelector('.bus-type-badge')?.remove();
  const badge = createBusTypeBadge(currentBusType);
  if (badge) {
    resultTitle.append(document.createTextNode(' '), badge);
  }
}

function updateSessionBusTypeBadge(busNumber, busCode, busType) {
  [activeSessionsList, searchResultsList].forEach((list) => {
    list?.querySelectorAll('.session-button').forEach((button) => {
      const matchesCode = busCode && button.dataset.busCode === busCode;
      const matchesNumber =
        (!busCode || !button.dataset.busCode) &&
        button.dataset.busNumber === busNumber;
      if (!matchesCode && !matchesNumber) {
        return;
      }

      button.dataset.busType = ['ordinary', 'metro_express'].includes(busType)
        ? busType
        : '';
      const label = button.querySelector('.session-bus-label');
      label?.querySelector('.bus-type-badge')?.remove();
      const badge = createBusTypeBadge(busType);
      if (label && badge) {
        label.appendChild(badge);
      }
    });
  });
}

function setPageTitle(busNumber = null) {
  document.title = busNumber
    ? t('busPageTitle', { number: busNumber })
    : t('appTitle');
}

function setResultTab(tabName) {
  document.querySelectorAll('[data-result-tab]').forEach((tab) => {
    const isSelected = tab.dataset.resultTab === tabName;
    tab.classList.toggle('is-active', isSelected);
    tab.setAttribute('aria-selected', String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });

  document.querySelectorAll('[data-result-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.resultPanel !== tabName;
  });

  if (tabName === 'live' && map) {
    window.requestAnimationFrame(() => map.invalidateSize());
  }
}

function isPhoneDetailsLayout() {
  return window.matchMedia('(max-width: 767px)').matches;
}

function setDetailsPanelState(state) {
  if (!resultCard || resultCard.hidden) {
    return;
  }

  if (!isPhoneDetailsLayout()) {
    resultCard.style.removeProperty('transform');
    document.body.classList.toggle('details-panel-hidden', state === 'hidden');
  } else {
    document.body.classList.remove('details-panel-hidden');
    const snapState = ['peek', 'half', 'full'].includes(state)
      ? state
      : 'peek';
    resultCard.dataset.snapState = snapState;
    resultCard.style.transform =
      `translate3d(0, ${getDetailsPanelOffset(snapState)}px, 0)`;
  }
  resultCard.classList.add('sheet-transition');
  if (prefersReducedMotion()) {
    resultCard.classList.remove('sheet-transition');
    scheduleMapAfterPanelSnap();
  }
}

function getDetailsPanelHeight() {
  return window.innerHeight;
}

function getDetailsPanelOffset(state) {
  const height = getDetailsPanelHeight();
  if (state === 'full') {
    return 0;
  }
  if (state === 'half') {
    return height * 0.45;
  }
  return Math.max(0, height - 150);
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function scheduleMapAfterPanelSnap() {
  window.clearTimeout(panelSnapTimer);
  panelSnapTimer = window.setTimeout(() => {
    map?.invalidateSize({ pan: false });
    if (isCurrentBusLive() && followLiveBus && liveBusMarker) {
      if (!followMapInitializedForBus || deferredInitialBusFlyIn) {
        startInitialBusFlyTo(false);
      } else {
        panMapToLiveBus(true);
      }
    }
  }, 150);
}

function pushDetailsHistoryEntry() {
  if (detailsHistoryEntry || !window.history?.pushState) {
    return;
  }
  detailsHistoryEntryId = `details-${Date.now()}-${Math.random()}`;
  window.history.pushState(
    {
      ...window.history.state,
      detailsPanel: true,
      detailsPanelEntryId: detailsHistoryEntryId
    },
    '',
    window.location.href
  );
  detailsHistoryEntry = true;
}

function openDetailsPanel(initialState = 'half') {
  pushDetailsHistoryEntry();
  if (isPhoneDetailsLayout()) {
    document.body.classList.add('details-panel-open');
    document.body.classList.remove('details-panel-hidden');
    resultCard.dataset.snapState = initialState;
    resultCard.style.transform =
      `translate3d(0, ${getDetailsPanelOffset('full')}px, 0)`;
    resultCard.classList.remove('sheet-transition');
    resultCard.classList.add('sheet-opening');
    window.requestAnimationFrame(() => {
      resultCard.style.transform =
        `translate3d(0, ${getDetailsPanelOffset(initialState)}px, 0)`;
      if (prefersReducedMotion()) {
        resultCard.classList.remove('sheet-opening');
        scheduleMapAfterPanelSnap();
      }
    });
  } else {
    document.body.classList.add('details-panel-open', 'details-panel-hidden');
    resultCard.style.removeProperty('transform');
    resultCard.classList.remove('sheet-transition');
    resultCard.classList.add('sheet-opening');
    window.requestAnimationFrame(() => {
      document.body.classList.remove('details-panel-hidden');
      if (prefersReducedMotion()) {
        resultCard.classList.remove('sheet-opening');
        scheduleMapAfterPanelSnap();
      }
    });
  }
}

function advanceDetailsPanelState(direction = 1) {
  if (!isPhoneDetailsLayout()) {
    setDetailsPanelState('peek');
    return;
  }
  const states = ['peek', 'half', 'full'];
  const currentIndex = Math.max(
    0,
    states.indexOf(resultCard.dataset.snapState || 'peek')
  );
  const nextIndex = direction > 0
    ? (currentIndex === states.length - 1 ? currentIndex - 1 : currentIndex + 1)
    : Math.max(0, currentIndex - 1);
  setDetailsPanelState(states[nextIndex]);
}

function getBusMapTarget(position) {
  if (!map) {
    return position;
  }
  const zoom = map.getZoom();
  const projected = map.project(position, zoom);
  const size = map.getSize();
  let target = projected;
  let offsetX = 0;
  let offsetY = 0;
  if (isPhoneDetailsLayout() && document.body.classList.contains('details-panel-open')) {
    const state = resultCard.dataset.snapState || 'peek';
    const sheetHeight = state === 'full'
      ? window.innerHeight * 0.9
      : state === 'half'
        ? window.innerHeight * 0.5
        : 150;
    offsetY = sheetHeight / 2;
  } else if (!isPhoneDetailsLayout() && document.body.classList.contains('details-panel-open')) {
    const panelWidth = 380;
    const visibleMapCenterX =
      (window.innerWidth + panelWidth) / 2 -
      mapWrapper.getBoundingClientRect().left;
    offsetX = document.body.classList.contains('details-panel-hidden')
      ? 0
      : visibleMapCenterX - size.x / 2;
  }
  if (userLocationMarker) {
    const userPoint = map.project(userLocationMarker.getLatLng(), zoom);
    const availableHeight = size.y - (offsetY * 2);
    const fitsBesideBus =
      Math.abs(userPoint.x - projected.x) <= size.x - 80 &&
      Math.abs(userPoint.y - projected.y) <= availableHeight - 80;
    if (fitsBesideBus) {
      target = projected.add(userPoint).divideBy(2);
    }
  }
  return map.unproject(
    target.add(L.point(offsetX, offsetY)),
    zoom
  );
}

function setConnectionError(isVisible) {
  if (connectionError) {
    connectionError.hidden = !isVisible;
  }
}

function showCatalogLoadError(messageKey) {
  if (connectionErrorMessage) {
    connectionErrorMessage.textContent = t(messageKey);
  }
  setConnectionError(true);
}

function showUnexpectedErrorToast(error) {
  if (globalErrorToastActive) {
    return;
  }
  globalErrorToastActive = true;
  showToast(t('unexpectedError'), true);
  window.clearTimeout(globalErrorToastTimer);
  globalErrorToastTimer = window.setTimeout(() => {
    globalErrorToastActive = false;
  }, 5000);
  console.error('Unexpected application error.', error);
}

function updateOfflineBanner() {
  if (offlineBanner) {
    offlineBanner.hidden = navigator.onLine;
  }
}

let dialogHistoryBackInProgress = false;
let generatedDialogHistoryId = 0;
const dialogHistoryObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLDialogElement) {
          trackDialogHistory(node);
        } else if (node instanceof Element) {
          node.querySelectorAll('dialog').forEach(trackDialogHistory);
        }
      });
      continue;
    }

    const dialog = mutation.target;
    if (!(dialog instanceof HTMLDialogElement)) {
      continue;
    }
    const historyId = getDialogHistoryId(dialog);
    if (dialog.open) {
      if (window.history.state?.appDialogId !== historyId) {
        window.history.pushState(
          { ...window.history.state, appDialogId: historyId },
          '',
          window.location.href
        );
      }
    } else if (dialogHistoryBackInProgress) {
      dialogHistoryBackInProgress = false;
    } else if (window.history.state?.appDialogId === historyId) {
      window.history.back();
    }
  }
});

function getDialogHistoryId(dialog) {
  if (!dialog.id && !dialog.dataset.historyId) {
    generatedDialogHistoryId += 1;
    dialog.dataset.historyId = `app-dialog-${generatedDialogHistoryId}`;
  }
  return dialog.id || dialog.dataset.historyId;
}

function trackDialogHistory(dialog) {
  dialogHistoryObserver.observe(dialog, {
    attributes: true,
    attributeFilter: ['open']
  });
  if (dialog.open) {
    const historyId = getDialogHistoryId(dialog);
    if (window.history.state?.appDialogId !== historyId) {
      window.history.pushState(
        { ...window.history.state, appDialogId: historyId },
        '',
        window.location.href
      );
    }
  }
}

document.querySelectorAll('dialog').forEach(trackDialogHistory);
dialogHistoryObserver.observe(document.body, { childList: true, subtree: true });

function updateFocusedInputPosition() {
  const viewport = window.visualViewport;
  const focused = document.activeElement;
  if (
    !viewport ||
    !(focused instanceof HTMLInputElement ||
      focused instanceof HTMLTextAreaElement)
  ) {
    return;
  }

  const rect = focused.getBoundingClientRect();
  const viewportTop = viewport.offsetTop;
  const viewportBottom = viewportTop + viewport.height;
  if (rect.bottom > viewportBottom - 12) {
    window.scrollBy({
      top: rect.bottom - viewportBottom + 12,
      behavior: 'smooth'
    });
  } else if (rect.top < viewportTop + 12) {
    window.scrollBy({
      top: rect.top - viewportTop - 12,
      behavior: 'smooth'
    });
  }
}

document.addEventListener('focusin', (event) => {
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement
  ) {
    window.requestAnimationFrame(updateFocusedInputPosition);
  }
});
window.visualViewport?.addEventListener('resize', () => {
  window.requestAnimationFrame(updateFocusedInputPosition);
});
document.addEventListener('submit', (event) => {
  const form = event.target;
  if (form instanceof HTMLFormElement && form.contains(document.activeElement)) {
    window.setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 0);
  }
}, true);

window.addEventListener('error', (event) => {
  showUnexpectedErrorToast(event.error || event.message);
});
window.addEventListener('unhandledrejection', (event) => {
  showUnexpectedErrorToast(event.reason);
});
window.addEventListener('online', () => {
  updateOfflineBanner();
  loadBusCatalog().catch((error) => {
    console.error('Could not refresh the bus catalog after reconnecting.', error);
    showCatalogLoadError('catalogLoadFailed');
  });
  window.refreshVisibleLiveLists?.().catch((error) => {
    console.error('Could not refresh live lists after reconnecting.', error);
  });
});
window.addEventListener('offline', updateOfflineBanner);
updateOfflineBanner();

function hideLoadingIndicator() {
  if (loadingIndicator) {
    loadingIndicator.hidden = true;
  }
}

function showToast(message, isError = false) {
  if (!toastContainer) {
    return;
  }

  const toast = document.createElement('div');
  toast.className = `toast${isError ? ' toast-error' : ''}`;
  toast.setAttribute('role', isError ? 'alert' : 'status');
  toast.textContent = message;
  toast.dataset.toastId = String(++toastSequence);
  toastContainer.appendChild(toast);

  window.requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  window.setTimeout(() => {
    toast.classList.remove('is-visible');
    window.setTimeout(() => toast.remove(), 250);
  }, 3000);
}

function returnToHome() {
  clearNearbyBusTimers();
  if (liveMapRefreshInterval) {
    clearInterval(liveMapRefreshInterval);
    liveMapRefreshInterval = null;
  }
  stopRealtimeSubscription();
  clearLiveBusMarker();
  clearLiveMapMarkers();
  clearActiveBusSessions();
  clearBusSearchResults();

  const searchInput = document.getElementById('busNumber');
  searchInput.value = '';

  resultCard.hidden = true;
  detailsHistoryEntry = false;
  detailsHistoryEntryId = null;
  document.body.classList.remove(
    'details-panel-open',
    'details-panel-hidden'
  );
  favoriteBusBtn.hidden = true;
  detailsBackBtn.hidden = true;
  mapWrapper.hidden = true;
  activeSessionsContainer.hidden = true;
  setResultTab('details');
  setPageTitle();
  setBottomNavActive('home');
  setConnectionError(false);
  searchMessage.textContent = t('searchPrompt');

  resultNumber.textContent = '-';
  resultRoute.textContent = '-';
  resultStart.textContent = '-';
  resultDestination.textContent = '-';
  resultStatus.textContent = '-';
  resultSessionCode.textContent = '-';
  resultStops.replaceChildren();
  renderCapacityStatus(null);
  setCapacityMessage('');
  resetLiveStatus();

  if (!isSharingActive) {
    currentBusSessionCode = null;
    currentBusNumber = null;
    currentBusRoute = null;
    currentDisplayedBusRecord = null;
  }
  favoriteBusBtn.hidden = true;

  const url = new URL(window.location.href);
  url.searchParams.delete('bus');
  window.history.replaceState(
    {
      ...window.history.state,
      detailsPanel: false,
      detailsPanelEntryId: null
    },
    '',
    `${url.pathname}${url.search}${url.hash}`
  );

  window.requestAnimationFrame(() => map?.invalidateSize({ pan: false }));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function returnFromBusDetails() {
  const returnView = detailsReturnView;
  stopRealtimeSubscription();
  clearLiveBusMarker();
  clearLiveMapMarkers();
  clearActiveBusSessions();
  resultCard.hidden = true;
  document.body.classList.remove(
    'details-panel-open',
    'details-panel-hidden'
  );
  detailsBackBtn.hidden = true;
  mapWrapper.hidden = true;
  setPageTitle();
  setBottomNavActive('home');
  currentBusSessionCode = null;
  currentBusNumber = null;
  currentBusRoute = null;
  currentDisplayedBusRecord = null;
  favoriteBusBtn.hidden = true;

  detailsHistoryEntry = false;
  detailsHistoryEntryId = null;

  if (returnView.type === 'searchResults') {
    nearbySearchResults = Boolean(returnView.nearby);
    nearbyBusLatitude = returnView.latitude ?? null;
    nearbyBusLongitude = returnView.longitude ?? null;
    activeLiveSessions = returnView.sessions || [];
    renderBusSearchResults(
      returnView.buses,
      returnView.query,
      new Map(),
      activeLiveSessions
    );
    searchMessage.textContent =
      t('busesFound', { count: returnView.buses.length });
  } else {
    clearBusSearchResults();
    searchMessage.textContent =
      t('searchPrompt');
  }

  setResultTab('details');
  window.requestAnimationFrame(() => map?.invalidateSize({ pan: false }));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderGpsDebug() {
  if (!gpsDebugText) {
    return;
  }

  const statusKeys = {
    waiting: 'gpsStatusWaiting',
    stopped: 'gpsStatusStopped',
    'callback received': 'gpsStatusCallbackReceived',
    'GPS watcher started': 'gpsStatusWatcherStarted',
    'geolocation error': 'gpsStatusGeolocationError'
  };
  const callbackTime = gpsDebugCallbackTime === 'none'
    ? t('none')
    : gpsDebugCallbackTime === 'waiting for callback'
      ? t('gpsWaitingForCallback')
      : gpsDebugCallbackTime;
  const coordinates = [gpsDebugLatitude, gpsDebugLongitude]
    .map((value) => value === 'none' ? t('none') : value);

  gpsDebugText.textContent = [
    `${t('gpsWatcher')}: ${t(statusKeys[gpsDebugStatus] || gpsDebugStatus)}`,
    `${t('lastCallback')}: ${callbackTime}`,
    `${t('latestCoordinates')}: ${coordinates.join(', ')}`,
    `${t('error')}: ${gpsDebugError === 'none' ? t('none') : gpsDebugError}`
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
  map = L.map('map', { maxZoom: 19 }).setView(defaultMapCenter, 13);

  const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map);
  tileLayer.on('tileerror', () => {
    if (mapTileError) {
      mapTileError.hidden = false;
    }
  });
  tileLayer.on('tileload', () => {
    if (mapTileError) {
      mapTileError.hidden = true;
    }
  });

  const mapElement = document.getElementById('map');
  const markManualMapGesture = () => {
    mapUserGestureAt = Date.now();
  };
  mapElement?.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('.leaflet-popup, .leaflet-marker-icon')) {
      markManualMapGesture();
    }
  });
  mapElement?.addEventListener('wheel', markManualMapGesture, {
    passive: true
  });
  mapElement?.addEventListener('keydown', markManualMapGesture);
  document.querySelectorAll('.leaflet-control-zoom a').forEach((control) => {
    control.addEventListener('pointerdown', markManualMapGesture);
  });
  map.on('dragstart zoomstart', (event) => {
    if (programmaticMapMove && !event.originalEvent) {
      return;
    }
    if (event.originalEvent || Date.now() - mapUserGestureAt < 1200) {
      setBusFollowEnabled(false);
    }
  });
  map.on('click', () => {
    if (
      isPhoneDetailsLayout() &&
      document.body.classList.contains('details-panel-open') &&
      resultCard.dataset.snapState !== 'peek'
    ) {
      setDetailsPanelState('peek');
    }
  });
  resultCard.addEventListener('transitionend', (event) => {
    if (event.target !== resultCard || event.propertyName !== 'transform') {
      return;
    }
    resultCard.classList.remove('sheet-transition', 'sheet-opening');
    if (panelDragPointerId === null) {
      scheduleMapAfterPanelSnap();
    }
  });

  if (followBusBtn) {
    followBusBtn.hidden = true;
    followBusBtn.addEventListener('click', () => {
      setBusFollowEnabled(true);
      if (isCurrentBusLive() && liveBusMarker) {
        panMapToLiveBus(true);
      }
    });
  }

  const samplePanelPointer = (event) => {
    panelDragSamples.push({ y: event.clientY, time: event.timeStamp });
    panelDragSamples = panelDragSamples.filter(
      (sample) => event.timeStamp - sample.time <= 120
    );
  };
  const beginPanelDrag = (event) => {
    if (
      resultCard.hidden ||
      !isPhoneDetailsLayout() ||
      event.button > 0 ||
      (
        event.target.closest('button, input, select, textarea, summary, a') &&
        !event.target.closest('.details-drag-handle')
      )
    ) {
      return;
    }
    const isHeaderDrag = event.target.closest(
      '.details-drag-handle, .result-header'
    );
    const isFull = resultCard.dataset.snapState === 'full';
    if (!isHeaderDrag && isFull && detailsContent.scrollTop > 0) {
      return;
    }
    panelDragPointerId = event.pointerId;
    panelDragStartY = event.clientY;
    panelDragStartOffset = getDetailsPanelOffset(
      resultCard.dataset.snapState || 'peek'
    );
    panelDragSamples = [];
    panelDragIsContentScroll = false;
    samplePanelPointer(event);
    panelDragHandled = false;
    resultCard.classList.remove('sheet-transition', 'sheet-opening');
    (isHeaderDrag ? event.target.closest(
      '.details-drag-handle, .result-header'
    ) : resultCard).setPointerCapture(event.pointerId);
    if (!isHeaderDrag && isFull && detailsContent.scrollTop === 0) {
      detailsContent.style.touchAction = 'none';
    }
  };
  const movePanelDrag = (event) => {
    if (event.pointerId !== panelDragPointerId || panelDragStartY === null) {
      return;
    }
    samplePanelPointer(event);
    const delta = event.clientY - panelDragStartY;
    if (
      resultCard.dataset.snapState === 'full' &&
      !event.target.closest('.details-drag-handle, .result-header') &&
      delta < -8
    ) {
      panelDragIsContentScroll = true;
    }
    if (panelDragIsContentScroll && delta < 0) {
      event.preventDefault();
      detailsContent.scrollTop = Math.max(0, -delta);
      return;
    }
    panelDragIsContentScroll = false;
    event.preventDefault();
    const fullHeight = getDetailsPanelHeight();
    const rawOffset = panelDragStartOffset + delta;
    const offset = rawOffset < 0 ? rawOffset * 0.2 : Math.min(
      rawOffset,
      fullHeight
    );
    panelDragHandled ||= Math.abs(delta) > 8;
    if (panelDragFrame !== null) {
      cancelAnimationFrame(panelDragFrame);
    }
    panelDragFrame = requestAnimationFrame(() => {
      resultCard.style.transform = `translate3d(0, ${offset}px, 0)`;
      panelDragFrame = null;
    });
  };
  const finishPanelDrag = (event, cancelled = false) => {
    if (event.pointerId !== panelDragPointerId || panelDragStartY === null) {
      return;
    }
    samplePanelPointer(event);
    const delta = event.clientY - panelDragStartY;
    const samples = panelDragSamples;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const velocity = first && last && last.time > first.time
      ? (last.y - first.y) / (last.time - first.time)
      : 0;
    const currentIndex = ['peek', 'half', 'full'].indexOf(
      resultCard.dataset.snapState || 'peek'
    );
    panelDragStartY = null;
    panelDragPointerId = null;
    detailsContent.style.touchAction = '';
    if (panelDragFrame !== null) {
      cancelAnimationFrame(panelDragFrame);
      panelDragFrame = null;
    }
    if (panelDragIsContentScroll && delta < 0) {
      panelDragIsContentScroll = false;
      panelDragSamples = [];
      return;
    }
    panelDragIsContentScroll = false;
    if (!cancelled && currentIndex === 0 && (delta > 80 || velocity > 0.55)) {
      requestCloseDetailsPanel();
      return;
    }

    let nextIndex = currentIndex;
    if (!cancelled && Math.abs(velocity) > 0.55) {
      nextIndex = velocity < 0
        ? Math.min(2, currentIndex + 1)
        : Math.max(0, currentIndex - 1);
    } else if (!cancelled) {
      const offset = panelDragStartOffset + delta;
      const states = ['peek', 'half', 'full'];
      nextIndex = states.reduce((nearest, state, index) => (
        Math.abs(getDetailsPanelOffset(state) - offset) <
          Math.abs(getDetailsPanelOffset(states[nearest]) - offset)
          ? index
          : nearest
      ), 0);
    }
    resultCard.classList.add('sheet-transition');
    setDetailsPanelState(['peek', 'half', 'full'][nextIndex]);
    panelDragSamples = [];
  };

  resultCard.addEventListener('pointerdown', beginPanelDrag);
  resultCard.addEventListener('pointermove', movePanelDrag);
  resultCard.addEventListener('pointerup', (event) => finishPanelDrag(event));
  resultCard.addEventListener('pointercancel', (event) =>
    finishPanelDrag(event, true)
  );
  resultCard.addEventListener('click', (event) => {
    if (panelDragHandled && event.target.closest('.details-drag-handle')) {
      event.preventDefault();
      event.stopPropagation();
      panelDragHandled = false;
      return;
    }
    if (event.target.closest('.details-drag-handle')) {
      advanceDetailsPanelState();
    }
  });
}

function requestCloseDetailsPanel() {
  if (detailsHistoryEntry && window.history.length > 1) {
    window.history.back();
    window.setTimeout(() => {
      if (detailsHistoryEntry && !resultCard.hidden) {
        detailsHistoryEntry = false;
        detailsHistoryEntryId = null;
        returnFromBusDetails();
      }
    }, 300);
  } else {
    returnFromBusDetails();
  }
}

function isCurrentBusLive() {
  return Number.isFinite(currentLiveBusExpiresAt) &&
    currentLiveBusExpiresAt > Date.now();
}

function setBusFollowEnabled(enabled) {
  followLiveBus = Boolean(enabled);
  if (followBusBtn) {
    followBusBtn.hidden = followLiveBus || !isCurrentBusLive();
    followBusBtn.setAttribute('aria-pressed', String(followLiveBus));
  }
}

function panMapToLiveBus(force = false) {
  if (
    !followLiveBus ||
    !isCurrentBusLive() ||
    !liveBusMarker ||
    !map ||
    panelDragPointerId !== null ||
    resultCard.classList.contains('sheet-transition') ||
    resultCard.classList.contains('sheet-opening')
  ) {
    return;
  }
  if (initialBusFlyInProgress) {
    return;
  }

  const now = Date.now();
  if (!force && now - lastFollowPanAt < 1000) {
    return;
  }
  lastFollowPanAt = now;

  const reducedMotion = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  markProgrammaticMapMove();
  map.panTo(getBusMapTarget(liveBusMarker.getLatLng()), {
    animate: !reducedMotion,
    duration: 1
  });
}

function startInitialBusFlyTo(invalidateMapSize = true) {
  if (!map || !followLiveBus || !isCurrentBusLive() || !liveBusMarker) {
    return;
  }
  if (
    panelDragPointerId !== null ||
    resultCard.classList.contains('sheet-transition') ||
    resultCard.classList.contains('sheet-opening')
  ) {
    deferredInitialBusFlyIn = true;
    return;
  }

  if (invalidateMapSize) {
    map.invalidateSize({ pan: false });
  }
  const reducedMotion = prefersReducedMotion();
  markProgrammaticMapMove();
  initialBusFlyInProgress = true;
  deferredInitialBusFlyIn = false;
  map.once('moveend', () => {
    initialBusFlyInProgress = false;
    if (isCurrentBusLive() && followLiveBus && liveBusMarker) {
      panMapToLiveBus(true);
    }
  });
  map.flyTo(getBusMapTarget(liveBusMarker.getLatLng()), 16, {
    animate: !reducedMotion,
    duration: 1
  });
  followMapInitializedForBus = true;
}

function markProgrammaticMapMove() {
  if (programmaticMapMoveTimer) {
    clearTimeout(programmaticMapMoveTimer);
  }
  programmaticMapMove = true;
  map.once('moveend', () => {
    programmaticMapMove = false;
    clearTimeout(programmaticMapMoveTimer);
    programmaticMapMoveTimer = null;
  });
  programmaticMapMoveTimer = window.setTimeout(() => {
    programmaticMapMove = false;
    programmaticMapMoveTimer = null;
  }, 1500);
}

function setBottomNavActive(view) {
  document.querySelectorAll('[data-bottom-nav]').forEach((button) => {
    const active = button.dataset.bottomNav === view;
    button.classList.toggle('is-active', active);
    if (active) {
      button.setAttribute('aria-current', 'page');
    } else {
      button.removeAttribute('aria-current');
    }
  });
}

function clearLiveMapMarkers() {
  liveMapMarkers.forEach((marker) => map?.removeLayer(marker));
  liveMapMarkers = [];
}

async function refreshLiveMapMarkers() {
  try {
    const sessions = await window.busTypeHelpers.getActiveBusLocationShares();
    if (
      mapWrapper.hidden ||
      !resultCard.hidden ||
      bottomLiveMapBtn?.getAttribute('aria-current') !== 'page'
    ) {
      return;
    }
    activeLiveSessions = Array.isArray(sessions) ? sessions : [];
    activeCatalogBusNumbers = new Set(
      activeLiveSessions.map((session) =>
        normalizeBusNumberKey(session.bus_number)
      )
    );
    renderBusCards();
    clearLiveMapMarkers();

    const coordinates = [];
    activeLiveSessions.forEach((session) => {
      const latitude = Number(session.latitude);
      const longitude = Number(session.longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return;
      }

      const marker = L.marker([latitude, longitude], {
        icon: createBusMapIcon()
      }).addTo(map);
      const popup = document.createElement('div');
      popup.className = 'live-map-popup';
      const label = document.createElement('strong');
      label.textContent = `${t('busNumber')} ${session.bus_number}`;
      popup.appendChild(label);
      const badge = createBusTypeBadge(session.bus_type);
      if (badge) {
        popup.append(' ', badge);
      }
      const openButton = document.createElement('button');
      openButton.type = 'button';
      openButton.className = 'secondary-button live-map-popup__button';
      openButton.textContent = t('viewBusDetails');
      openButton.addEventListener('click', () => {
        map.closePopup();
        document.getElementById('busNumber').value = session.bus_number;
        searchForm.requestSubmit();
      });
      popup.appendChild(openButton);
      marker.bindPopup(popup);
      liveMapMarkers.push(marker);
      coordinates.push([latitude, longitude]);
    });

    if (coordinates.length > 1) {
      map.fitBounds(coordinates, { padding: [36, 36], maxZoom: 14 });
    } else if (coordinates.length === 1) {
      map.setView(coordinates[0], 14);
    } else {
      map.setView(defaultMapCenter, 12);
    }
    if (mapEmptyMessage) {
      mapEmptyMessage.hidden = coordinates.length > 0;
    }
    window.requestAnimationFrame(() => map.invalidateSize());
    if (liveMapRetryTimer) {
      window.clearTimeout(liveMapRetryTimer);
      liveMapRetryTimer = null;
    }
  } catch (error) {
    console.warn('Could not refresh live buses for the map; retrying shortly.', error);
    if (
      liveMapRetryTimer === null &&
      !mapWrapper.hidden &&
      bottomLiveMapBtn?.getAttribute('aria-current') === 'page'
    ) {
      liveMapRetryTimer = window.setTimeout(() => {
        liveMapRetryTimer = null;
        refreshLiveMapMarkers();
      }, 5000);
    }
  }
}

async function showLiveMapView() {
  moreMenu?.close();
  resultCard.hidden = true;
  document.body.classList.remove(
    'details-panel-open',
    'details-panel-hidden'
  );
  mapWrapper.hidden = false;
  if (mapEmptyMessage) {
    mapEmptyMessage.hidden = false;
  }
  setPageTitle();
  setBottomNavActive('map');
  stopRealtimeSubscription();
  clearLiveBusMarker();
  clearLiveMapMarkers();
  await refreshLiveMapMarkers();
  if (
    mapWrapper.hidden ||
    bottomLiveMapBtn?.getAttribute('aria-current') !== 'page'
  ) {
    return;
  }
  if (liveMapRefreshInterval) {
    clearInterval(liveMapRefreshInterval);
  }
  liveMapRefreshInterval = window.setInterval(
    refreshLiveMapMarkers,
    30000
  );
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

function normalizeBusNumberKey(busNumber) {
  return String(busNumber || '').trim().toLowerCase();
}

const FAVORITE_BUSES_STORAGE_KEY = 'apsrtcLive.favoriteBuses';

function loadFavoriteBusNumbers() {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(FAVORITE_BUSES_STORAGE_KEY) || '[]'
    );
    favoriteBusNumbers = new Set(
      Array.isArray(stored)
        ? stored.filter((number) => typeof number === 'string' && number.trim())
          .map(normalizeBusNumberKey)
        : []
    );
  } catch (error) {
    console.error('Could not restore favorite buses.', error);
    favoriteBusNumbers = new Set();
  }
}

function isFavoriteBus(busNumber) {
  return favoriteBusNumbers.has(normalizeBusNumberKey(busNumber));
}

function updateDetailsFavoriteButton() {
  if (!favoriteBusBtn || !currentBusNumber) {
    if (favoriteBusBtn) {
      favoriteBusBtn.hidden = true;
    }
    return;
  }

  const favorite = isFavoriteBus(currentBusNumber);
  favoriteBusBtn.hidden = false;
  favoriteBusBtn.textContent = favorite ? '★' : '☆';
  favoriteBusBtn.setAttribute('aria-pressed', String(favorite));
  favoriteBusBtn.setAttribute(
    'aria-label',
    t(favorite ? 'removeFavorite' : 'addFavorite')
  );
}

function toggleFavoriteBus(busNumber) {
  const key = normalizeBusNumberKey(busNumber);
  if (!key) {
    return;
  }

  if (favoriteBusNumbers.has(key)) {
    favoriteBusNumbers.delete(key);
  } else {
    favoriteBusNumbers.add(key);
  }

  try {
    window.localStorage.setItem(
      FAVORITE_BUSES_STORAGE_KEY,
      JSON.stringify(Array.from(favoriteBusNumbers))
    );
  } catch (error) {
    console.error('Could not save favorite buses.', error);
    showToast(t('favoriteSaveFailed'), true);
  }

  renderBusCards();
  updateDetailsFavoriteButton();
}

function createBusCatalogCard(bus) {
  const card = document.createElement('article');
  card.className = 'bus-card';

  const openButton = document.createElement('button');
  openButton.type = 'button';
  openButton.className = 'bus-card__open';
  openButton.dataset.busNumber = bus.busNumber;
  openButton.setAttribute('aria-label', `${t('searchBus')} ${bus.busNumber}`);

  const number = document.createElement('span');
  number.className = 'bus-number';
  number.textContent = bus.busNumber;

  const route = document.createElement('span');
  route.className = 'bus-route';
  const routeName = bus.routeName && bus.routeName !== 'Not available'
    ? displayPlaceName(bus.routeName, true)
    : '';
  route.textContent = routeName;
  route.hidden = !routeName;
  openButton.append(number, route);

  if (activeCatalogBusNumbers.has(normalizeBusNumberKey(bus.busNumber))) {
    const dot = document.createElement('span');
    dot.className = 'bus-live-dot';
    dot.setAttribute('aria-label', t('liveNow'));
    number.prepend(dot);
  }

  const favoriteButton = document.createElement('button');
  const favorite = isFavoriteBus(bus.busNumber);
  favoriteButton.type = 'button';
  favoriteButton.className = 'favorite-toggle';
  favoriteButton.dataset.favoriteNumber = bus.busNumber;
  favoriteButton.textContent = favorite ? '★' : '☆';
  favoriteButton.setAttribute('aria-pressed', String(favorite));
  favoriteButton.setAttribute(
    'aria-label',
    t(favorite ? 'removeFavorite' : 'addFavorite')
  );

  card.append(openButton, favoriteButton);
  return card;
}

function renderFavoriteBusCards() {
  if (!favoriteBusList || !myBusesSection) {
    return;
  }

  favoriteBusList.replaceChildren();
  const favorites = getActiveBusCatalog().filter((bus) =>
    isFavoriteBus(bus.busNumber)
  );
  myBusesSection.hidden = favoriteBusNumbers.size === 0;
  if (favoriteBusNumbers.size > 0 && favorites.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'live-now-empty';
    empty.textContent = t('favoritesUnavailable');
    favoriteBusList.appendChild(empty);
  }
  favorites.forEach((bus) => {
    try {
      favoriteBusList.appendChild(createBusCatalogCard(bus));
    } catch (error) {
      console.error('Could not render a favorite bus card.', error, bus);
    }
  });
}

const RECENT_BUSES_STORAGE_KEY = 'apsrtcLive.recentBuses';
const MAX_RECENT_BUSES = 5;

function getRecentBusNumbers() {
  try {
    const storedBuses = JSON.parse(
      window.localStorage.getItem(RECENT_BUSES_STORAGE_KEY) || '[]'
    );

    return Array.isArray(storedBuses)
      ? storedBuses.filter(
          (busNumber) =>
            typeof busNumber === 'string' && busNumber.trim()
        ).slice(0, MAX_RECENT_BUSES)
      : [];
  } catch (error) {
    console.error('Could not read recently searched buses', error);
    return [];
  }
}

function renderRecentBusSearches() {
  if (!recentSearches || !recentSearchChips) {
    return;
  }

  const busNumbers = getRecentBusNumbers();
  recentSearchChips.replaceChildren();
  recentSearches.hidden = busNumbers.length === 0;

  busNumbers.forEach((busNumber) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'recent-search-chip';
    chip.dataset.busNumber = busNumber;
    chip.textContent = busNumber;
    chip.setAttribute('aria-label', `${t('searchBus')} ${busNumber}`);
    recentSearchChips.appendChild(chip);
  });
}

function rememberSearchedBus(busNumber) {
  const normalizedBusNumber = String(busNumber || '').trim();
  if (!normalizedBusNumber) {
    return;
  }

  const recentBusNumbers = getRecentBusNumbers().filter(
    (recentBusNumber) =>
      recentBusNumber.toLowerCase() !== normalizedBusNumber.toLowerCase()
  );
  recentBusNumbers.unshift(normalizedBusNumber);

  try {
    window.localStorage.setItem(
      RECENT_BUSES_STORAGE_KEY,
      JSON.stringify(recentBusNumbers.slice(0, MAX_RECENT_BUSES))
    );
  } catch (error) {
    console.error('Could not save recently searched bus', error);
    return;
  }

  renderRecentBusSearches();
}

function parseStopsInput(stopsText) {
  if (!stopsText) {
    return [];
  }

  return String(stopsText)
    .split(',')
    .map((stop) => stop.trim())
    .filter(Boolean);
}

function setAddBusMessage(message, isError = false) {
  if (!addBusMessage) {
    return;
  }

  addBusMessage.textContent = message;
  addBusMessage.style.color = isError ? '#b00020' : '#006600';
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

function displayPlaceName(value, isRoute = false) {
  const name = typeof value === 'string' ? value.trim() : '';
  if (!name || name === 'Not available') {
    return t('notAvailable');
  }
  const translate = isRoute
    ? window.translateRoute
    : window.translatePlace;
  return translate?.(name) || name;
}

function renderBusCatalogSkeletons() {
  if (!busList) {
    return;
  }

  busList.replaceChildren();
  for (let index = 0; index < 6; index += 1) {
    const skeleton = document.createElement('div');
    skeleton.className = 'bus-card bus-card-skeleton';
    skeleton.setAttribute('aria-hidden', 'true');
    skeleton.innerHTML = `
      <span class="skeleton-line skeleton-title"></span>
      <span class="skeleton-line skeleton-route"></span>
      <span class="skeleton-line skeleton-status"></span>
    `;
    busList.appendChild(skeleton);
  }
}

function renderBusCards() {
  if (!busList) {
    console.error('Bus catalog container is missing.');
    return;
  }
  busList.replaceChildren();

  activeLiveSessions = getUnexpiredLiveSessions(activeLiveSessions);
  activeCatalogBusNumbers = new Set(
    activeLiveSessions.map((session) =>
      normalizeBusNumberKey(session.bus_number)
    )
  );
  const busesToRender = getActiveBusCatalog();
  renderLiveNowCards(activeLiveSessions);
  renderFavoriteBusCards();

  if (!busesToRender.length) {
    const emptyCard = document.createElement('article');
    emptyCard.className = 'bus-card';
    const message = document.createElement('p');
    message.className = 'bus-route';
    message.textContent = t('noBusesAvailable');
    emptyCard.appendChild(message);
    busList.appendChild(emptyCard);
    return;
  }

  busesToRender.forEach((bus) => {
    try {
      busList.appendChild(createBusCatalogCard(bus));
    } catch (error) {
      console.error('Could not render a bus catalog card.', error, bus);
    }
  });
  window.UIMotion?.animateCatalogCards(
    Array.from(busList.querySelectorAll('.bus-card:not(.bus-card-skeleton)'))
  );
}

function getUnexpiredLiveSessions(sessions) {
  const now = Date.now();
  return (Array.isArray(sessions) ? sessions : []).filter((session) => {
    const expiresAt = new Date(session.expires_at).getTime();
    const updatedAt = new Date(session.updated_at).getTime();
    return Number.isFinite(expiresAt) &&
      Number.isFinite(updatedAt) &&
      expiresAt > now &&
      updatedAt <= now;
  });
}

function renderLiveNowCards(sessions) {
  if (!liveNowList) {
    return;
  }

  liveNowList.replaceChildren();
  const liveSessions = getUnexpiredLiveSessions(sessions);
  window.UIMotion?.updateLiveCount(liveSessions.length);

  if (!liveSessions.length) {
    const empty = document.createElement('p');
    empty.className = 'live-now-empty';
    empty.textContent = t('noLiveBusesShare');
    liveNowList.appendChild(empty);
  }

  liveSessions.forEach((session) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'live-now-card';
    card.dataset.busNumber = session.bus_number;
    card.dataset.busCode = session.bus_code || '';
    const number = document.createElement('span');
    number.className = 'live-now-card__number';
    const dot = document.createElement('span');
    dot.className = 'bus-live-dot';
    dot.setAttribute('aria-hidden', 'true');
    number.append(dot, document.createTextNode(session.bus_number));
    const badge = createBusTypeBadge(session.bus_type);
    if (badge) {
      number.appendChild(badge);
    }

    const updated = document.createElement('span');
    updated.className = 'live-now-card__updated';
    updated.dataset.liveSessionUpdatedAt = session.updated_at || '';
    updated.textContent = t('updated', {
      time: formatTimeAgo(session.updated_at)
    });
    card.append(number, updated);
    liveNowList.appendChild(card);
  });
}

async function loadActiveCatalogBusNumbers() {
  try {
    const sessions = await window.busTypeHelpers.getActiveBusLocationShares();
    if (activeCatalogRetryTimer) {
      window.clearTimeout(activeCatalogRetryTimer);
      activeCatalogRetryTimer = null;
    }
    activeLiveSessions = Array.isArray(sessions) ? sessions : [];
    activeCatalogBusNumbers = new Set(
      activeLiveSessions.map((session) =>
        normalizeBusNumberKey(session.bus_number)
      )
    );
    renderBusCards();
  } catch (error) {
    console.warn('Failed to refresh live bus statuses; retrying shortly.', error);
    activeLiveSessions = [];
    activeCatalogBusNumbers = new Set();
    window.UIMotion?.updateLiveCount(0);
    renderBusCards();
    if (activeCatalogRetryTimer === null) {
      activeCatalogRetryTimer = window.setTimeout(() => {
        activeCatalogRetryTimer = null;
        loadActiveCatalogBusNumbers();
      }, 5000);
    }
  }
}

async function loadBusCatalog() {
  if (!window.supabaseHelpers) {
    console.error(
      'Bus catalog could not load because Supabase helpers are unavailable.',
      new Error('Supabase helpers are unavailable.')
    );
    busCatalog = [];
    activeCatalogBusNumbers = new Set();
    renderBusCards();
    showCatalogLoadError('catalogLoadFailed');
    return;
  }

  searchMessage.textContent = t('loadingCatalog');

  try {
    const { data, error } = await window.supabaseHelpers.getBuses();

    if (error) {
      throw error;
    }

    const normalizedBuses = (data || [])
      .map((bus) => normalizeBusRecord(bus))
      .filter(Boolean);

    await loadActiveCatalogBusNumbers();

    if (normalizedBuses.length > 0) {
      busCatalog = normalizedBuses;
      renderBusCards();
      searchMessage.textContent = t('loadedBusCatalog', { count: normalizedBuses.length });
      setConnectionError(false);
    } else {
      busCatalog = [];
      renderBusCards();
      searchMessage.textContent = t('noBusesAvailable');
      setConnectionError(false);
    }
  } catch (error) {
    console.error('Failed to load buses from Supabase', error);
    busCatalog = [];
    renderBusCards();
    showCatalogLoadError('catalogLoadFailed');
    searchMessage.textContent = t('catalogLoadFailed');
  }
}

function clearSenderLocationTicker() {
  if (senderLocationTicker) {
    clearInterval(senderLocationTicker);
    senderLocationTicker = null;
  }
}

function clearBusLocationTicker() {
  if (busLocationTicker) {
    clearInterval(busLocationTicker);
    busLocationTicker = null;
  }
}

function clearGpsRefreshInterval() {
  if (gpsRefreshInterval) {
    clearInterval(gpsRefreshInterval);
    gpsRefreshInterval = null;
  }
}

function clearForcedRefreshInterval() {
  if (forcedRefreshInterval) {
    clearInterval(forcedRefreshInterval);
    forcedRefreshInterval = null;
  }
}

function formatTimeAgo(timestamp) {
  if (!timestamp) {
    return t('justNow');
  }

  const parsedTime = new Date(timestamp).getTime();
  if (Number.isNaN(parsedTime)) {
    return t('justNow');
  }

  const diffMs = Math.max(0, Date.now() - parsedTime);
  const totalSeconds = Math.floor(diffMs / 1000);

  if (totalSeconds < 60) {
    return t(totalSeconds === 1 ? 'secondAgo' : 'secondsAgo', {
      count: totalSeconds
    });
  }

  const totalMinutes = Math.floor(totalSeconds / 60);
  if (totalMinutes < 60) {
    return t(totalMinutes === 1 ? 'minuteAgo' : 'minutesAgo', {
      count: totalMinutes
    });
  }

  const totalHours = Math.floor(totalMinutes / 60);
  if (totalHours < 24) {
    return t(totalHours === 1 ? 'hourAgo' : 'hoursAgo', {
      count: totalHours
    });
  }

  const totalDays = Math.floor(totalHours / 24);
  return t(totalDays === 1 ? 'dayAgo' : 'daysAgo', {
    count: totalDays
  });
}

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getBusSessionUrl(busCode = currentBusSessionCode) {
  const url = new URL(window.location.href);
  if (busCode) {
    url.searchParams.set('bus', busCode);
  } else {
    url.searchParams.delete('bus');
  }
  return url.toString();
}

function updateBusSessionUrl(busCode) {
  if (!busCode || !window.history?.pushState) {
    return;
  }
  const method = detailsHistoryEntry ? 'replaceState' : 'pushState';
  window.history[method](
    { ...window.history.state, busCode, detailsPanel: detailsHistoryEntry },
    '',
    getBusSessionUrl(busCode)
  );
}

function createBusMapIcon(bearing = 0) {
  return L.divIcon({
    className: 'live-bus-icon',
    html: `
      <span class="live-bus-icon__badge">
        <svg
          class="live-bus-icon__svg"
          viewBox="0 0 48 48"
          role="img"
          aria-label="Live bus"
        >
          <circle cx="24" cy="24" r="20"></circle>
          <g transform="rotate(${bearing} 24 24)">
            <path class="live-bus-icon__direction" d="M24 2 L29 11 L19 11 Z"></path>
            <path class="live-bus-icon__bus" d="M15 16 C15 13.8 16.8 12 19 12 H29 C31.2 12 33 13.8 33 16 V31 C33 32.1 32.1 33 31 33 H17 C15.9 33 15 32.1 15 31 Z"></path>
            <path class="live-bus-icon__window" d="M18 16 H30 V22 H18 Z"></path>
            <circle class="live-bus-icon__wheel" cx="19" cy="29" r="2"></circle>
            <circle class="live-bus-icon__wheel" cx="29" cy="29" r="2"></circle>
          </g>
        </svg>
      </span>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24]
  });
}

function getTravelBearing(previousPosition, currentPosition) {
  if (!previousPosition) {
    return 0;
  }

  const latitude1 = previousPosition[0] * Math.PI / 180;
  const latitude2 = currentPosition[0] * Math.PI / 180;
  const longitudeDelta = (currentPosition[1] - previousPosition[1]) * Math.PI / 180;
  const y = Math.sin(longitudeDelta) * Math.cos(latitude2);
  const x =
    Math.cos(latitude1) * Math.sin(latitude2) -
    Math.sin(latitude1) * Math.cos(latitude2) * Math.cos(longitudeDelta);

  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function renderLiveDirection(isMoving) {
  if (!liveDirection) {
    return;
  }

  liveDirection.classList.toggle('is-moving', isMoving);
  liveDirection.classList.toggle('is-stationary', !isMoving);

  if (liveDirectionArrow) {
    liveDirectionArrow.hidden = !isMoving;
    liveDirectionArrow.style.transform =
      `rotate(${liveStatusBearing ?? 0}deg)`;
  }

  if (liveDirectionDot) {
    liveDirectionDot.hidden = true;
  }

  if (liveDirectionLabel) {
    liveDirectionLabel.textContent = isMoving
      ? t('busMoving')
      : t('busNotMoving');
  }
}

function renderLiveMovementStatus() {
  if (!liveMovement) {
    return;
  }

  if (!liveStatusLastMovedAt) {
    liveMovement.textContent = t('waitingMovement');
    return;
  }

  const secondsSinceMovement = Math.max(
    0,
    Math.floor((Date.now() - liveStatusLastMovedAt) / 1000)
  );

  liveMovement.textContent = secondsSinceMovement >= 120
    ? t('busStationary')
    : t('lastMovedSeconds', { seconds: secondsSinceMovement });
}

function startLiveStatusTicker() {
  if (liveStatusTicker) {
    return;
  }

  liveStatusTicker = window.setInterval(
    renderLiveMovementStatus,
    1000
  );
}

function resetLiveStatus() {
  previousLiveStatusReading = null;
  liveStatusLastMovedAt = null;
  liveStatusBearing = null;

  renderLiveDirection(false);

  renderLiveMovementStatus();
}

function updateLiveStatusFromRow(latitude, longitude, updatedAt) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return;
  }

  const previousReading = previousLiveStatusReading;
  const currentReading = {
    latitude,
    longitude,
    timestamp: updatedAt
  };

  if (!previousReading) {
    previousLiveStatusReading = currentReading;
    startLiveStatusTicker();
    return;
  }

  const elapsedMilliseconds = updatedAt - previousReading.timestamp;
  if (elapsedMilliseconds <= 0) {
    console.log('Live movement distance skipped: timestamp did not advance', {
      previousTimestamp: previousReading.timestamp,
      currentTimestamp: updatedAt,
      elapsedMilliseconds
    });
    return;
  }

  const distanceKm = getDistanceKm(
    previousReading.latitude,
    previousReading.longitude,
    latitude,
    longitude
  );
  const movementThresholdKm = 0.001;
  const isMoving = distanceKm >= movementThresholdKm;
  console.log('Live movement distance calculated', {
    previousPosition: {
      latitude: previousReading.latitude,
      longitude: previousReading.longitude
    },
    currentPosition: { latitude, longitude },
    elapsedMilliseconds,
    distanceMeters: distanceKm * 1000,
    movementThresholdMeters: movementThresholdKm * 1000,
    isMoving
  });
  if (isMoving) {
    liveStatusBearing = getTravelBearing(
      [previousReading.latitude, previousReading.longitude],
      [latitude, longitude]
    );
    liveStatusLastMovedAt = updatedAt;
  } else if (!liveStatusLastMovedAt) {
    liveStatusLastMovedAt = previousReading.timestamp;
  }

  renderLiveDirection(isMoving);

  previousLiveStatusReading = currentReading;
  renderLiveMovementStatus();
  startLiveStatusTicker();
}

const capacityLabels = {
  empty: 'empty',
  half_full: 'halfFull',
  full: 'full'
};

function renderCapacityStatus(status) {
  if (!capacityStatus) {
    return;
  }

  const hasStatus = Object.prototype.hasOwnProperty.call(capacityLabels, status);
  capacityStatus.classList.add('capacity-status-pill');
  capacityStatus.dataset.capacityStatus = hasStatus ? status : 'unreported';
  capacityStatus.textContent = capacityLabels[status]
    ? `${t('capacity')}: ${t(capacityLabels[status])}`
    : t('capacityNotReported');
}

function setCapacityMessage(message, isError = false) {
  if (!capacityMessage) {
    return;
  }

  capacityMessage.textContent = message;
  capacityMessage.style.color = isError ? '#b00020' : '';
}

function updateCapacityFromRow(row) {
  renderCapacityStatus(row?.capacity_status || null);
}

function updateActiveSessionTimestamp(timestamp, busNumber, busCode) {
  if (!timestamp || !activeSessionsList) {
    return;
  }

  Array.from(
    activeSessionsList.querySelectorAll('.session-button')
  ).forEach((button) => {
    const matchesCode =
      busCode &&
      button.dataset.busCode === busCode;
    const matchesNumber =
      !busCode &&
      button.dataset.busNumber === busNumber;

    if (matchesCode || matchesNumber) {
      const timestampElement = button.querySelector(
        '[data-route-session-updated-at]'
      );
      if (timestampElement) {
        timestampElement.textContent =
          `Updated ${formatTimeAgo(timestamp)}`;
      }
    }
  });
}

function getViewerPositionOnce() {
  if (!navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.info(
          'Viewer location unavailable; showing route buses without distance sorting.',
          error
        );
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 8000
      }
    );
  });
}

function renderActiveBusSessions(routeLabel, sessionRows) {
  if (!activeSessionsContainer || !activeSessionsList || !activeSessionsMessage) {
    console.warn('renderActiveBusSessions: required DOM elements are missing');
    return;
  }

  activeBusSessions = Array.isArray(sessionRows) ? sessionRows : [];
  console.log('renderActiveBusSessions called', {
    routeLabel,
    rowCount: activeBusSessions.length,
    rows: activeBusSessions
  });
  activeSessionsList.replaceChildren();
  activeSessionsContainer.hidden = activeBusSessions.length <= 1;
  if (activeSessionsHeading) {
    activeSessionsHeading.textContent = t('activeBusesOnRoute');
  }

  if (activeBusSessions.length <= 1) {
    return;
  }

  activeSessionsMessage.textContent = routeLabel || t('chooseSpecificBus');

  activeBusSessions.forEach((session) => {
    const item = document.createElement('li');
    item.className = 'session-item';
    item.dataset.busCode = session.bus_code;
    item.dataset.busNumber = session.bus_number;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'session-button';
    button.setAttribute('data-bus-code', session.bus_code || '');
    button.setAttribute('data-bus-number', session.bus_number);
    button.dataset.busType = session.bus_type || '';
    const busLabel = document.createElement('span');
    busLabel.className = 'session-bus-label';
    busLabel.dataset.busNumber = session.bus_number;
    busLabel.dataset.busCode = session.bus_code || '';
    const liveDot = document.createElement('span');
    liveDot.className = 'bus-live-dot bus-live-dot--label';
    liveDot.setAttribute('aria-hidden', 'true');
    busLabel.appendChild(liveDot);
    busLabel.appendChild(document.createTextNode(
      `${t('busNumber')} ${session.bus_number}${session.bus_code ? `-${session.bus_code}` : ''}`
    ));
    const badge = createBusTypeBadge(session.bus_type);
    if (badge) {
      busLabel.appendChild(badge);
    }
    button.appendChild(busLabel);

    const meta = document.createElement('span');
    meta.className = 'session-meta';
    const updated = document.createElement('span');
    updated.setAttribute('data-route-session-updated-at', session.updated_at);
    updated.textContent = t('updated', { time: formatTimeAgo(session.updated_at) });
    meta.appendChild(updated);
    if (session.distanceKm != null) {
      meta.appendChild(document.createTextNode(
        ` · ${session.distanceKm.toFixed(1)} km away`
      ));
    }
    button.appendChild(meta);
    item.appendChild(button);

    activeSessionsList.appendChild(item);
  });

  console.log('renderActiveBusSessions rendered DOM items', {
    rowCount: activeBusSessions.length,
    renderedItemCount: activeSessionsList.children.length,
    containerHidden: activeSessionsContainer.hidden
  });
}

function loadActiveBusSessions(busNumber, routeLabel, selectFirst = true) {
  if (!window.busTypeHelpers) {
    renderActiveBusSessions(t('sessionLookupUnavailable'), []);
    return;
  }

  window.busTypeHelpers
    .getActiveBusSharesForRoute(busNumber)
    .then(async ({ data, error }) => {
      console.log('loadActiveBusSessions fetched route rows', {
        busNumber,
        routeLabel,
        rowCount: Array.isArray(data) ? data.length : 0,
        data,
        error
      });

      if (error) {
        console.warn('Could not refresh active bus sessions.', error);
        renderActiveBusSessions(t('routeSessionLoadFailed'), []);
        return;
      }

      const activeRows = Array.isArray(data) ? data : [];
      const viewerPosition = await getViewerPositionOnce();
      const displayRows = viewerPosition
        ? activeRows
            .map((row) => ({
              ...row,
              distanceKm: getDistanceKm(
                viewerPosition.latitude,
                viewerPosition.longitude,
                Number(row.latitude),
                Number(row.longitude)
              )
            }))
            .sort((firstRow, secondRow) =>
              firstRow.distanceKm - secondRow.distanceKm
            )
        : activeRows;

      console.log('loadActiveBusSessions prepared display rows', {
        busNumber,
        viewerPosition,
        rowCount: displayRows.length,
        sortedByDistance: Boolean(viewerPosition)
      });

      renderActiveBusSessions(
        t('activeBusesRoute', { number: busNumber }),
        displayRows
      );

      if (selectFirst && displayRows.length === 1) {
        selectActiveBusSession(
          busNumber,
          displayRows[0].bus_code,
          displayRows[0].bus_type
        );
      }
    })
    .catch((error) => {
      console.warn('Could not refresh active bus sessions.', error);
      renderActiveBusSessions(t('routeSessionLoadFailed'), []);
    });
}

function renderNearbyBusSessions(sessionRows) {
  if (!activeSessionsContainer || !activeSessionsList || !activeSessionsMessage) {
    return;
  }

  activeSessionsList.replaceChildren();
  activeSessionsContainer.hidden = false;
  if (activeSessionsHeading) {
    activeSessionsHeading.textContent = t('nearbyActiveBuses');
  }
  activeSessionsMessage.textContent = sessionRows.length
    ? t('nearbyActiveBuses')
    : t('noNearbyBuses');

  sessionRows.forEach((session) => {
    const item = document.createElement('li');
    item.className = 'session-item';
    item.dataset.busCode = session.bus_code;
    item.dataset.busNumber = session.bus_number;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'session-button';
    button.setAttribute('data-bus-code', session.bus_code);
    button.setAttribute('data-bus-number', session.bus_number);
    button.dataset.busType = session.bus_type || '';
    const busLabel = document.createElement('span');
    busLabel.className = 'session-bus-label';
    busLabel.dataset.busNumber = session.bus_number;
    busLabel.dataset.busCode = session.bus_code || '';
    const liveDot = document.createElement('span');
    liveDot.className = 'bus-live-dot bus-live-dot--label';
    liveDot.setAttribute('aria-hidden', 'true');
    busLabel.appendChild(liveDot);
    busLabel.appendChild(document.createTextNode(
      `${t('busNumber')} ${session.bus_number}-${session.bus_code}`
    ));
    const badge = createBusTypeBadge(session.bus_type);
    if (badge) {
      busLabel.appendChild(badge);
    }
    button.appendChild(busLabel);

    const meta = document.createElement('span');
    meta.className = 'session-meta';
    const updated = document.createElement('span');
    updated.setAttribute('data-nearby-updated-at', session.updated_at);
    updated.textContent = t('updated', { time: formatTimeAgo(session.updated_at) });
    meta.appendChild(updated);
    if (session.distanceKm != null) {
      meta.appendChild(document.createTextNode(
        ` · ${t('distanceKmAway', { distance: session.distanceKm.toFixed(1) })}`
      ));
    }
    button.appendChild(meta);
    item.appendChild(button);

    activeSessionsList.appendChild(item);
  });

  startNearbyBusTimestampTicker();
}

async function loadNearbyBusSessions(latitude, longitude, selectFirst = true) {
  if (!window.busTypeHelpers) {
    throw new Error('Supabase helpers are not available.');
  }

  const nearbyRows = await getNearbyLiveBusRows(latitude, longitude);

  resultTitle.textContent = t('nearbyTitle');
  setBusTypeBadges(null);
  resultNumber.textContent = '-';
  resultRoute.textContent = '-';
  resultStart.textContent = '-';
  resultDestination.textContent = '-';
  resultStatus.textContent = '-';
  resultSessionCode.textContent = '-';
  resultStops.replaceChildren();
  resultCard.hidden = false;
  mapWrapper.hidden = false;

  renderNearbyBusSessions(nearbyRows);

  if (selectFirst && nearbyRows.length) {
    selectActiveBusSession(
      nearbyRows[0].bus_number,
      nearbyRows[0].bus_code,
      nearbyRows[0].bus_type
    );
  }
}

async function getNearbyLiveBusRows(latitude, longitude) {
  if (!window.busTypeHelpers) {
    throw new Error('Supabase helpers are not available.');
  }
  const activeRows = await window.busTypeHelpers.getActiveBusLocationShares();
  return getUnexpiredLiveSessions(activeRows)
    .map((row) => ({
      ...row,
      distanceKm: getDistanceKm(latitude, longitude, row.latitude, row.longitude)
    }))
    .filter((row) => row.distanceKm != null && row.distanceKm <= 10)
    .sort((first, second) => first.distanceKm - second.distanceKm);
}

async function searchLiveBusesNearMe() {
  if (!navigator.geolocation) {
    showToast(t('locationNotAvailable'), true);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        nearbyBusLatitude = position.coords.latitude;
        nearbyBusLongitude = position.coords.longitude;
        const nearbyRows = await getNearbyLiveBusRows(
          nearbyBusLatitude,
          nearbyBusLongitude
        );
        activeLiveSessions = nearbyRows;
        nearbySearchResults = true;
        liveOnlySearch = false;
        document.querySelectorAll('[data-search-filter]').forEach((button) => {
          const selected = button.dataset.searchFilter === 'all';
          button.classList.toggle('is-active', selected);
          button.setAttribute('aria-pressed', String(selected));
        });
        const nearbyNumbers = new Set(
          nearbyRows.map((row) => normalizeBusNumberKey(row.bus_number))
        );
        const nearbyBuses = getActiveBusCatalog().filter((bus) =>
          nearbyNumbers.has(normalizeBusNumberKey(bus.busNumber))
        );
        const types = new Map();
        nearbyRows.forEach((row) => {
          types.set(normalizeBusNumberKey(row.bus_number), row.bus_type);
        });
        renderBusSearchResults(
          nearbyBuses,
          t('liveBusesNearMe'),
          types,
          nearbyRows
        );
        searchMessage.textContent = '';
      } catch (error) {
        console.error('Nearby live-bus search failed.', error);
        showToast(t('nearbySearchFailed'), true);
      }
    },
    (error) => {
      console.warn('Could not get the viewer location for nearby buses.', error);
      showToast(
        error.code === error.PERMISSION_DENIED
          ? t('nearbyPermissionDenied')
          : t('nearbySearchFailed'),
        true
      );
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 8000
    }
  );
}

async function refreshNearbyBusSessions() {
  if (
    nearbyBusLatitude === null ||
    nearbyBusLongitude === null ||
    nearbyBusRefreshInFlight ||
    activeSessionsContainer.hidden
  ) {
    return;
  }

  nearbyBusRefreshInFlight = true;
  try {
    await loadNearbyBusSessions(
      nearbyBusLatitude,
      nearbyBusLongitude,
      false
    );
  } catch (error) {
    console.warn('Nearby bus refresh failed; it will retry on the next refresh.', error);
  } finally {
    nearbyBusRefreshInFlight = false;
  }
}

function startNearbyBusRefresh() {
  clearNearbyBusTimers();
  startNearbyBusTimestampTicker();
  nearbyBusRefreshInterval = window.setInterval(
    refreshNearbyBusSessions,
    25000
  );
}

function selectActiveBusSession(busNumber, busCode, busType = null) {
  if (!busNumber) {
    return;
  }

  setBusFollowEnabled(true);
  followMapInitializedForBus = false;
  initialBusFlyInProgress = false;
  deferredInitialBusFlyIn = false;
  currentBusSessionCode = busCode;
  setResultTab('live');
  resultTitle.textContent = busNumber;
  setBusTypeBadges(busType);
  resultSessionCode.textContent = busCode || '-';
  resultNumber.textContent = busNumber;
  const selectedBusKey = busCode || busNumber;
  if (liveBusTrailKey && liveBusTrailKey !== selectedBusKey) {
    clearLiveBusTrail();
  }
  liveBusTrailKey = selectedBusKey;
  resetLiveStatus();
  updateBusSessionUrl(busCode);
  startRealtimeForBus(busNumber, busCode);

  if (activeSessionsList) {
    Array.from(activeSessionsList.querySelectorAll('.session-button')).forEach((button) => {
      button.classList.toggle('selected', button.dataset.busCode === busCode);
    });
  }
}

async function loadBusSessionFromUrl() {
    const busCode = new URLSearchParams(window.location.search).get('bus');
    console.log('loadBusSessionFromUrl: URL bus parameter', {
      busCode,
      found: Boolean(busCode)
    });

    if (!busCode) {
      return;
    }

    if (!window.supabaseHelpers) {
      console.error('loadBusSessionFromUrl: Supabase helpers are not ready');
      searchMessage.textContent = t('couldNotLoadSharedLink');
      return;
    }

    try {
      const sessionResult =
        await window.supabaseHelpers.getBusSessionByCode(busCode);
      console.log('loadBusSessionFromUrl: session lookup completed', {
        busCode,
        data: sessionResult.data,
        error: sessionResult.error
      });

      if (sessionResult.error) {
        throw sessionResult.error;
      }

      const session = sessionResult.data;
      if (!session?.bus_number) {
        searchMessage.textContent = t('sharedSessionNotFound');
        return;
      }

      const busResult =
        await window.supabaseHelpers.getBusByNumber(session.bus_number);
      console.log('loadBusSessionFromUrl: bus lookup completed', {
        busNumber: session.bus_number,
        data: busResult.data,
        error: busResult.error
      });

      if (busResult.error) {
        throw busResult.error;
      }

      const matchingBus = (Array.isArray(busResult.data) ? busResult.data : [])
        .find((bus) =>
          String(bus.bus_number).trim().toLowerCase() ===
          String(session.bus_number).trim().toLowerCase()
        );

      if (!matchingBus) {
        searchMessage.textContent = t('busNotFoundForDetails');
        return;
      }

      const normalizedBus = normalizeBusRecord(matchingBus);
      if (!normalizedBus) {
        searchMessage.textContent = t('connectionProblem');
        return;
      }

      await showBusDetails(normalizedBus);
      console.log('loadBusSessionFromUrl: showBusDetails completed', {
        busNumber: normalizedBus.busNumber,
        busCode
      });

      selectActiveBusSession(session.bus_number, busCode);
      searchMessage.textContent = t('sharedSessionShown', { code: busCode });
    } catch (error) {
      console.error('Failed to load shared bus session', error);
      showToast(t('couldNotLoadSharedLink'), true);
      searchMessage.textContent = t('couldNotLoadSharedLink');
    }
  }

function clearActiveBusSessions(resetNearbyLocation = true) {
  clearNearbyBusTimers();
  if (resetNearbyLocation) {
    nearbyBusLatitude = null;
    nearbyBusLongitude = null;
  }
  activeBusSessions = [];
  busSearchResults = [];
  if (activeSessionsList) {
    activeSessionsList.replaceChildren();
  }
  if (activeSessionsContainer) {
    activeSessionsContainer.hidden = true;
  }
}

function clearBusSearchResults() {
  busSearchResults = [];
  searchResultCards = [];
  if (searchResultTimestampTicker) {
    clearInterval(searchResultTimestampTicker);
    searchResultTimestampTicker = null;
  }
  document.body.classList.remove('search-results-mode');
  if (searchResultsList) {
    searchResultsList.replaceChildren();
  }
  if (searchResultsContainer) {
    searchResultsContainer.hidden = true;
  }
}

function renderBusSearchResults(
  buses,
  query,
  busTypesByNumber = new Map(),
  sessions = activeLiveSessions
) {
  busSearchResults = Array.isArray(buses) ? buses : [];
  busSearchQuery = query;
  const liveSessions = getUnexpiredLiveSessions(sessions);
  searchResultCards = [];
  searchResultsList.replaceChildren();
  searchResultsContainer.hidden = false;
  searchResultsMessage.textContent = '';
  document.body.classList.add('search-results-mode');
  document.querySelectorAll('[data-search-filter]').forEach((button) => {
    const selected = button.dataset.searchFilter ===
      (liveOnlySearch ? 'live' : 'all');
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const knownLatitude = nearbyBusLatitude;
  const knownLongitude = nearbyBusLongitude;

  busSearchResults.forEach((bus) => {
    const normalizedBus = normalizeBusRecord(bus);
    if (!normalizedBus) {
      return;
    }

    const matchingSessions = liveSessions.filter((session) =>
      normalizeBusNumberKey(session.bus_number) ===
      normalizeBusNumberKey(normalizedBus.busNumber)
    );
    if (!matchingSessions.length) {
      searchResultCards.push({
        bus,
        normalizedBus,
        session: null,
        busType: busTypesByNumber.get(
          normalizeBusNumberKey(normalizedBus.busNumber)
        ) || null,
        distanceKm: null
      });
      return;
    }

    matchingSessions.forEach((session) => {
      searchResultCards.push({
        bus,
        normalizedBus,
        session,
        busType: session.bus_type ||
          busTypesByNumber.get(
            normalizeBusNumberKey(normalizedBus.busNumber)
          ) ||
          null,
        distanceKm: knownLatitude !== null && knownLongitude !== null
          ? getDistanceKm(
              knownLatitude,
              knownLongitude,
              Number(session.latitude),
              Number(session.longitude)
            )
          : null
      });
    });
  });

  searchResultCards.sort((first, second) => {
    if (Boolean(first.session) !== Boolean(second.session)) {
      return first.session ? -1 : 1;
    }
    if (
      first.session &&
      second.session &&
      (first.distanceKm !== null || second.distanceKm !== null)
    ) {
      if (first.distanceKm === null) {
        return 1;
      }
      if (second.distanceKm === null) {
        return -1;
      }
      return first.distanceKm - second.distanceKm;
    }
    return 0;
  });

  const visibleCards = searchResultCards.filter((card) =>
    !liveOnlySearch || Boolean(card.session)
  );
  const empty = document.getElementById('searchResultsEmpty');
  if (empty) {
    empty.hidden = visibleCards.length > 0;
    if (visibleCards.length === 0) {
      empty.textContent = nearbySearchResults
        ? t('noNearbyLiveBuses')
        : t('noLiveForSearch');
    }
  }

  visibleCards.forEach((entry) => {
    const { normalizedBus, session, busType, distanceKm } = entry;
    const item = document.createElement('li');
    item.className = 'search-result-item';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'search-result-card';
    const cardIndex = searchResultCards.indexOf(entry);
    button.dataset.searchResultIndex = String(cardIndex);
    button.dataset.busNumber = normalizedBus.busNumber;
    button.dataset.busCode = session?.bus_code || '';
    button.dataset.busType = busType || '';

    const busLabel = document.createElement('span');
    busLabel.className = 'search-result-card__title';
    const number = document.createElement('span');
    number.className = 'search-result-card__number';
    number.textContent = normalizedBus.busNumber;
    busLabel.appendChild(number);
    const badge = createBusTypeBadge(busType);
    if (badge) {
      busLabel.appendChild(badge);
    }

    const routeLabel = document.createElement('span');
    routeLabel.className = 'search-result-card__route';
    routeLabel.textContent = displayPlaceName(normalizedBus.routeName, true);

    const status = document.createElement('span');
    status.className = 'search-result-card__status';
    if (!session) {
      status.textContent = t('notLive');
      status.classList.add('search-result-card__status--offline');
    } else {
      const ageMs = Math.max(
        0,
        Date.now() - new Date(session.updated_at).getTime()
      );
      const dot = document.createElement('span');
      dot.className = 'search-result-card__dot';
      dot.setAttribute('aria-hidden', 'true');
      const statusText = document.createElement('span');
      if (ageMs >= 60000) {
        statusText.textContent = t('lastSeenStatus', {
          time: formatTimeAgo(session.updated_at)
        });
        status.classList.add(
          ageMs > 120000
            ? 'search-result-card__status--stale-danger'
            : 'search-result-card__status--stale'
        );
      } else {
        statusText.textContent = t('liveUpdatedStatus', {
          time: formatTimeAgo(session.updated_at)
        });
        status.classList.add('search-result-card__status--live');
      }
      status.append(dot, statusText);
    }

    const meta = document.createElement('span');
    meta.className = 'search-result-card__meta';
    if (session) {
      if (distanceKm !== null && Number.isFinite(distanceKm)) {
        const distance = document.createElement('span');
        distance.textContent = t('distanceKmAway', {
          distance: distanceKm.toFixed(1)
        });
        meta.appendChild(distance);
      }
    }
    button.append(busLabel, routeLabel, status, meta);
    item.appendChild(button);
    searchResultsList.appendChild(item);
  });

  if (searchResultTimestampTicker) {
    clearInterval(searchResultTimestampTicker);
  }
  searchResultTimestampTicker = window.setInterval(() => {
    if (searchResultsContainer.hidden) {
      clearInterval(searchResultTimestampTicker);
      searchResultTimestampTicker = null;
      return;
    }
    const types = new Map(
      searchResultCards.map(({ normalizedBus, busType }) => [
        normalizeBusNumberKey(normalizedBus.busNumber),
        busType
      ])
    );
    renderBusSearchResults(
      busSearchResults,
      busSearchQuery,
      types,
      activeLiveSessions
    );
  }, 15000);
}

async function getLiveSessionsForBuses(buses) {
  const busNumbers = [...new Set(
    buses
      .map((bus) => normalizeBusRecord(bus)?.busNumber)
      .filter(Boolean)
  )];
  const sessionGroups = await Promise.all(
    busNumbers.map(async (busNumber) => {
      const { data, error } =
        await window.busTypeHelpers.getActiveBusSharesForRoute(busNumber);
      if (error) {
        throw error;
      }
      return Array.isArray(data) ? data : [];
    })
  );
  return getUnexpiredLiveSessions(sessionGroups.flat());
}

function generateBusSessionCode(busNumber) {
  const suffixChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let suffix = '';
  for (let i = 0; i < 4; i += 1) {
    suffix += suffixChars.charAt(Math.floor(Math.random() * suffixChars.length));
  }
  return `${busNumber}-${suffix}`;
}

function updateRelativeTimestampText(element, timestamp, prefix = 'Updated ') {
  if (!element) {
    return;
  }

  if (!timestamp) {
    element.textContent = `${prefix === 'Updated ' ? t('updatedJustNow') : t('liveUpdatedJustNow')}`;
    return;
  }

  element.textContent = prefix === 'Updated '
    ? t('updated', { time: formatTimeAgo(timestamp) })
    : t('liveLocationUpdated', { time: formatTimeAgo(timestamp) });
}

function clearNearbyBusTimers() {
  if (nearbyBusRefreshInterval) {
    clearInterval(nearbyBusRefreshInterval);
    nearbyBusRefreshInterval = null;
  }

  if (nearbyBusTimestampTicker) {
    clearInterval(nearbyBusTimestampTicker);
    nearbyBusTimestampTicker = null;
  }

  nearbyBusRefreshInFlight = false;
}

function startNearbyBusTimestampTicker() {
  if (nearbyBusTimestampTicker) {
    clearInterval(nearbyBusTimestampTicker);
  }

  const tick = () => {
    if (!activeSessionsContainer || activeSessionsContainer.hidden) {
      return;
    }

    document.querySelectorAll('[data-nearby-updated-at]').forEach((element) => {
      updateRelativeTimestampText(
        element,
        element.dataset.nearbyUpdatedAt,
        'Updated '
      );
    });
  };

  tick();
  nearbyBusTimestampTicker = window.setInterval(tick, 1000);
}

function startLocationUpdateTicker() {
  clearSenderLocationTicker();

  if (!lastUpdateValue) {
    return;
  }

  const tick = () => {
    updateRelativeTimestampText(lastUpdateValue, lastLocationUpdateAt, 'Updated ');
  };

  tick();
  senderLocationTicker = window.setInterval(tick, 1000);
}

function startBusLocationTicker(liveMessageElement, timestamp) {
  clearBusLocationTicker();

  if (!liveMessageElement) {
    return;
  }

  const tick = () => {
    const currentTimestamp = timestamp || liveBusUpdatedAt;
    const parsedTimestamp = currentTimestamp ? new Date(currentTimestamp).getTime() : NaN;
    const ageMilliseconds = Number.isFinite(parsedTimestamp)
      ? Math.max(0, Date.now() - parsedTimestamp)
      : 0;
    const warningBadge = document.getElementById('liveLocationWarning');
    const staleWarning = document.getElementById('liveLocationStaleWarning');

    renderPanelLiveStatus(currentTimestamp);
    setBusFollowEnabled(followLiveBus);
    if (liveMessageElement) {
      liveMessageElement.textContent = '';
    }
    liveMessageElement.parentElement?.classList.toggle(
      'map-note--warning',
      ageMilliseconds >= 60000 && ageMilliseconds <= 120000
    );

    if (warningBadge) {
      warningBadge.hidden = ageMilliseconds < 60000 || ageMilliseconds > 120000;
    }
    if (staleWarning) {
      staleWarning.hidden = ageMilliseconds <= 120000;
      staleWarning.textContent = t('staleLocationWarning');
    }
    liveBusMarker?.getElement()?.classList.toggle(
      'is-stale',
      ageMilliseconds >= 120000
    );

    if (currentTimestamp) {
      updateActiveSessionTimestamp(
        currentTimestamp,
        currentRealtimeBusNumber || currentBusNumber,
        currentRealtimeBusCode || currentBusSessionCode
      );
    }
  };

  tick();
  busLocationTicker = window.setInterval(tick, 1000);
}

function renderPanelLiveStatus(timestamp = liveBusUpdatedAt) {
  const parsedTimestamp = timestamp ? new Date(timestamp).getTime() : NaN;
  const isValid = Number.isFinite(parsedTimestamp);
  const isExpired = Number.isFinite(currentLiveBusExpiresAt) &&
    currentLiveBusExpiresAt <= Date.now();
  const age = isValid ? Math.max(0, Date.now() - parsedTimestamp) : Infinity;
  const status = !isValid || isExpired
    ? 'notLive'
    : age >= 60000
      ? 'lastSeenStatus'
      : 'liveNow';
  const panelStatusText = status === 'lastSeenStatus'
    ? t(status, { time: formatTimeAgo(timestamp) })
    : t(status);
  const summaryStatusText = status === 'liveNow'
    ? t('liveUpdatedStatus', { time: formatTimeAgo(timestamp) })
    : panelStatusText;
  resultStatus.textContent = summaryStatusText;
  resultStatus.classList.toggle('status-live', status === 'liveNow');
  resultStatus.classList.toggle('status-stale', status === 'lastSeenStatus');
  resultStatus.classList.toggle('status-offline', status === 'notLive');

  if (livePanelStatus) {
    livePanelStatus.textContent = panelStatusText;
    livePanelStatus.classList.toggle('status-live', status === 'liveNow');
    livePanelStatus.classList.toggle('status-stale', status === 'lastSeenStatus');
    livePanelStatus.classList.toggle('status-offline', status === 'notLive');
  }
  if (livePanelUpdated) {
    livePanelUpdated.textContent = isValid && !isExpired
      ? t('updated', { time: formatTimeAgo(timestamp) })
      : '';
  }
}

function refreshGpsLocation() {
  if (!navigator.geolocation || !isSharingActive) {
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => updateUserLocation(position),
    (error) => {
      console.warn('Background GPS refresh failed', error);
    },
    {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0
    }
  );
}

function startGpsRefreshLoop() {
  clearGpsRefreshInterval();
  refreshGpsLocation();
  gpsRefreshInterval = window.setInterval(refreshGpsLocation, 15000);
}

function setBackgroundGpsWorkerActive(isActive) {
  if (window.NativeTracking?.isNative()) {
    return;
  }

  if (!isActive) {
    gpsBackupWorker?.postMessage({ type: 'stop' });
    return;
  }

  if (gpsBackupWorkerUnavailable || gpsBackupWorker) {
    gpsBackupWorker?.postMessage({ type: 'start' });
    return;
  }

  if (!window.Worker) {
    gpsBackupWorkerUnavailable = true;
    console.warn('Background GPS backup is unavailable because Web Workers are not supported.');
    return;
  }

  try {
    gpsBackupWorker = new Worker(new URL('js/gps-refresh-worker.js', window.location.href));
    gpsBackupWorker.addEventListener('message', (event) => {
      if (
        event.data?.type !== 'gps-refresh-check' ||
        document.visibilityState !== 'hidden' ||
        !isSharingActive
      ) {
        return;
      }

      const now = Date.now();
      const gpsCallbackIsStale = now - lastGpsCallbackTime >= 20000;
      const backupRequestIsDue = now - lastGpsBackupRequestAt >= 15000;
      if (gpsCallbackIsStale && backupRequestIsDue) {
        lastGpsBackupRequestAt = now;
        console.info('Background GPS worker requested a backup location check.');
        refreshGpsLocation();
      }
    });
    gpsBackupWorker.addEventListener('error', (event) => {
      console.error('Background GPS worker failed.', event.message);
      gpsBackupWorker?.terminate();
      gpsBackupWorker = null;
      gpsBackupWorkerUnavailable = true;
    });
    gpsBackupWorker.postMessage({ type: 'start' });
  } catch (error) {
    gpsBackupWorkerUnavailable = true;
    console.error('Could not start the background GPS worker.', error);
  }
}

function stopLocationSharing(message = t('locationSharingStopped')) {
  isSharingActive = false;
  window.SessionControl?.clearSession();
  if (window.NativeTracking?.isNative()) {
    window.NativeTracking.stop();
  }
  clearGpsRefreshInterval();
  clearForcedRefreshInterval();
  clearSenderLocationTicker();
  lastLocationUpdateAt = null;

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
  currentBusSessionCode = null;
  if (resultSessionCode) {
    resultSessionCode.textContent = '-';
  }

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

async function saveLocationToSupabase(latitude, longitude, busNumber = currentBusNumber, busCode = currentBusSessionCode) {
  const selectedBusNumber = (busNumber || currentBusNumber || resultNumber.textContent.trim()).trim();
  const selectedBusCode = (busCode || currentBusSessionCode || resultSessionCode?.textContent?.trim()).trim();

  if (!selectedBusNumber) {
    throw new Error('No bus selected.');
  }

  if (!selectedBusCode) {
    throw new Error('No bus session code available. Start sharing again to create one.');
  }

  if (!window.supabaseHelpers) {
    throw new Error('Supabase helpers are not available.');
  }

  currentBusNumber = selectedBusNumber;
  currentBusSessionCode = selectedBusCode;
  if (resultSessionCode) {
    resultSessionCode.textContent = selectedBusCode;
  }

  const coordinateKey = getCoordinateKey(latitude, longitude);
  const selectedDuration = Number(timerSelect.value);
  const expiresAt = getExpiresAt(selectedDuration);

  console.log('GPS location received and preparing to save to Supabase', {
    busNumber: selectedBusNumber,
    busCode: selectedBusCode,
    latitude,
    longitude,
    expiresAt
  });

  const savedRow = await window.supabaseHelpers.insertShare({
    busNumber: selectedBusNumber,
    busCode: selectedBusCode,
    latitude,
    longitude,
    expiresAt
  });

  if (
    !savedRow ||
    savedRow.bus_number !== selectedBusNumber ||
    (selectedBusCode && savedRow.bus_code !== selectedBusCode)
  ) {
    throw new Error('Supabase location save returned no matching row.');
  }

  lastSavedCoordinates = coordinateKey;
  lastSavedBusNumber = selectedBusNumber;
  if (!shareCelebrationShown) {
    shareCelebrationShown = true;
    window.UIMotion?.sharingStarted();
    showToast(t('thankYouShare'));
  }
  if (!busTypeUpdateStarted) {
    busTypeUpdateStarted = true;
    window.setShareBusType(
      selectedBusCode,
      selectedBusNumber,
      selectedShareBusType
    );
  }
  console.log('GPS location successfully saved to Supabase', {
    busNumber: selectedBusNumber,
    busCode: selectedBusCode,
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
  lastLocationUpdateAt = positionTimestamp;
  startLocationUpdateTicker();
  locationStatusText.textContent = t('sharingActive');
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

  lastGpsCallbackTime = Date.now();
  saveLocationToSupabase(latitude, longitude, currentBusNumber).catch((error) => {
    console.error('Supabase insert failed', error);
    locationStatusText.textContent = t('locationSharingSaveFailed');
  });
}

function handleNativeTrackingError(message, openSettings) {
  locationStatusText.textContent = message;
  if (typeof openSettings !== 'function') {
    return;
  }

  const settingsButton = document.createElement('button');
  settingsButton.type = 'button';
  settingsButton.className = 'primary-button';
  settingsButton.textContent = t('openAppSettings');
  settingsButton.addEventListener('click', () => {
    openSettings();
  });
  locationStatusText.append(' ', settingsButton);
}

function startLocationSharing(expiresAtOverride = null) {
  const isNative = window.NativeTracking?.isNative();
  if (!isNative && !navigator.geolocation) {
    stopLocationSharing(t('locationUnsupported'));
    return;
  }

  const selectedBusFromResult = resultNumber.textContent.trim();
  currentBusNumber = selectedBusFromResult && selectedBusFromResult !== '-' ? selectedBusFromResult : null;
  currentBusRoute = resultRoute.textContent.trim();

  if (!currentBusNumber) {
    stopLocationSharing(t('selectBusFirst'));
    return;
  }

  if (!currentBusSessionCode) {
    currentBusSessionCode = generateBusSessionCode(currentBusNumber);
    if (resultSessionCode) {
      resultSessionCode.textContent = currentBusSessionCode;
    }
  }

  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }

  clearForcedRefreshInterval();

  if (locationTimer) {
    clearTimeout(locationTimer);
  }

  busTypeUpdateStarted = false;
  shareCelebrationShown = false;
  isSharingActive = true;
  const selectedDuration = expiresAtOverride
    ? Math.max(0, new Date(expiresAtOverride).getTime() - Date.now())
    : Number(timerSelect.value);

  locationPanel.hidden = false;
  locationStatusText.textContent = t('requestingLocation');
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

  if (isNative) {
    window.NativeTracking.start(
      (position) => updateUserLocation(position),
      handleNativeTrackingError
    );
  } else {
    forcedRefreshInterval = window.setInterval(() => {
      if (!isSharingActive || !navigator.geolocation) {
        clearForcedRefreshInterval();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => updateUserLocation(position),
        (error) => {
          console.warn('Forced GPS refresh failed', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 8000
        }
      );
    }, 15000);

    watchId = navigator.geolocation.watchPosition(
      (position) => updateUserLocation(position),
      (error) => {
        console.error('Geolocation watch error', error);
        let message = t('unableToGetLocation');
        setGpsDebugState({
          status: 'geolocation error',
          callbackTime: 'none',
          latitude: 'none',
          longitude: 'none',
          error: message
        });

        if (error.code === error.PERMISSION_DENIED) {
          message = t('locationPermissionDenied');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = t('locationUnavailable');
        } else if (error.code === error.TIMEOUT) {
          message = t('locationRequestTimedOut');
        }

        stopLocationSharing(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0
      }
    );

    requestWakeLock();
  }

  if (selectedDuration > 0) {
    locationTimer = setTimeout(() => {
      window.SessionControl?.endShareSession(
        currentBusSessionCode,
        currentBusNumber
      );
      stopLocationSharing(t('locationSharingStopped'));
    }, selectedDuration);
  }

  window.SessionControl?.saveSession({
    busNumber: currentBusNumber,
    busCode: currentBusSessionCode,
    busType: selectedShareBusType,
    expiresAt: expiresAtOverride || getExpiresAt(selectedDuration)
  });
  showToast(t('keepAppOpen'));
}

function clearLiveBusMarker() {
  if (liveBusMarker && map) {
    map.removeLayer(liveBusMarker);
  }
  liveBusMarker = null;
  currentLiveBusExpiresAt = null;
  setBusFollowEnabled(followLiveBus);
  renderPanelLiveStatus(null);
  previousLiveBusPosition = null;
  clearLiveBusTrail();
}

function clearLiveBusTrail() {
  if (map) {
    liveBusTrailSegments.forEach((segment) => {
      map.removeLayer(segment);
    });
  }

  liveBusTrail = [];
  liveBusTrailSegments = [];
  liveBusTrailKey = null;
}

function renderLiveBusTrail() {
  if (!map) {
    return;
  }

  liveBusTrailSegments.forEach((segment) => {
    map.removeLayer(segment);
  });
  liveBusTrailSegments = [];

  for (let index = 1; index < liveBusTrail.length; index += 1) {
    const ageRatio = liveBusTrail.length === 2
      ? 1
      : (index - 1) / (liveBusTrail.length - 2);
    const segment = L.polyline(
      [
        liveBusTrail[index - 1].position,
        liveBusTrail[index].position
      ],
      {
        color: '#1e4ed8',
        opacity: 0.18 + ageRatio * 0.77,
        weight: 5,
        lineCap: 'round',
        lineJoin: 'round'
      }
    ).addTo(map);

    liveBusTrailSegments.push(segment);
  }
}

function addLiveBusTrailPoint(position, timestamp, row) {
  const busKey = row.bus_code || row.bus_number;
  if (liveBusTrailKey && liveBusTrailKey !== busKey) {
    clearLiveBusTrail();
  }
  liveBusTrailKey = busKey;

  const lastPoint = liveBusTrail[liveBusTrail.length - 1];
  if (
    lastPoint &&
    lastPoint.position[0] === position[0] &&
    lastPoint.position[1] === position[1]
  ) {
    lastPoint.timestamp = timestamp;
    return;
  }

  const trailCutoff = timestamp - 5 * 60 * 1000;
  liveBusTrail = liveBusTrail.filter(
    (point) => point.timestamp >= trailCutoff
  );
  liveBusTrail.push({ position, timestamp });
  liveBusTrail = liveBusTrail.slice(-8);
  renderLiveBusTrail();
}

function stopRealtimeSubscription() {
  clearBusLocationTicker();
  liveBusUpdatedAt = null;

  if (realtimeSubscription) {
    try {
      window.supabaseClient.realtime.removeChannel(realtimeSubscription);
    } catch (error) {
      console.warn('Could not remove Realtime subscription', error);
    }
    realtimeSubscription = null;
  }
  currentRealtimeBusNumber = null;
  currentRealtimeBusCode = null;
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
  liveBusUpdatedAt = row.updated_at;
  currentLiveBusExpiresAt = expiresAt;
  setBusFollowEnabled(followLiveBus);
  renderPanelLiveStatus(row.updated_at);

  const latitude = Number(row.latitude);
  const longitude = Number(row.longitude);
  updateLiveStatusFromRow(latitude, longitude, updatedAt);

  if (row.bus_code) {
    currentBusSessionCode = row.bus_code;
    if (resultSessionCode) {
      resultSessionCode.textContent = row.bus_code;
    }
  }

  const currentPosition = [latitude, longitude];
  const travelBearing = getTravelBearing(
    previousLiveBusPosition,
    currentPosition
  );
  const markerAlreadyExists = Boolean(liveBusMarker);

  if (!liveBusMarker) {
    liveBusMarker = L.marker(currentPosition, {
      icon: createBusMapIcon(travelBearing)
    }).addTo(map);
    liveBusMarker.bindPopup(`🚌 ${t('liveBusLocation')}`);
  } else {
    if (window.moveBusMarkerSmoothly) {
      window.moveBusMarkerSmoothly(
        liveBusMarker,
        currentPosition,
        panMapToLiveBus
      );
    } else {
      liveBusMarker.setLatLng(currentPosition);
      panMapToLiveBus();
    }
    liveBusMarker.setIcon(createBusMapIcon(travelBearing));
  }
  previousLiveBusPosition = currentPosition;
  addLiveBusTrailPoint(currentPosition, updatedAt, row);

  if (liveMessage) {
    startBusLocationTicker(liveMessage, liveBusUpdatedAt);
    window.flashLiveUpdate?.(liveMessage);
  }

  if (map && followLiveBus && !followMapInitializedForBus) {
    startInitialBusFlyTo();
  }
}

async function startRealtimeForBus(busNumber, busCode = null) {
  stopRealtimeSubscription();
  activeBusSearch += 1;
  const thisSearchId = activeBusSearch;
  lastSeenBusUpdatedAt = null;
  currentLiveBusExpiresAt = null;
  followMapInitializedForBus = false;
  initialBusFlyInProgress = false;
  deferredInitialBusFlyIn = false;
  setBusFollowEnabled(followLiveBus);
  renderPanelLiveStatus(null);

  const liveMessage = document.getElementById('liveLocationMessage');
  const liveLocationWarning = document.getElementById('liveLocationWarning');
  const liveLocationStaleWarning = document.getElementById('liveLocationStaleWarning');
  liveMessage?.parentElement?.classList.remove('map-note--warning');
  if (liveLocationWarning) {
    liveLocationWarning.hidden = true;
  }
  if (liveLocationStaleWarning) {
    liveLocationStaleWarning.hidden = true;
    liveLocationStaleWarning.textContent = '';
  }
  liveBusMarker?.getElement()?.classList.remove('is-stale');

  if (!window.busTypeHelpers || !window.supabaseClient) {
    if (liveMessage) {
      liveMessage.textContent = t('liveLocationUnavailable');
    }
    return;
  }

  renderCapacityStatus(null);
  setCapacityMessage('');
  console.log('startRealtimeForBus searching live location for', { busNumber, busCode });
  try {
    const { data, error } = await window.busTypeHelpers
      .getLatestActiveBusLocation(busNumber, busCode);

    if (thisSearchId !== activeBusSearch) {
      return;
    }

    if (error) {
      throw error;
    }

    if (!data) {
      clearLiveBusMarker();
      if (liveMessage) {
        liveMessage.textContent = t('noLiveLocation');
      }
    } else {
      setBusTypeBadges(data.bus_type);
      updateSessionBusTypeBadge(busNumber, busCode, data.bus_type);
      updateCapacityFromRow(data);
      await updateLiveBusLocationFromRow(data, liveMessage);
    }
  } catch (error) {
    if (thisSearchId === activeBusSearch) {
      clearLiveBusMarker();
      if (liveMessage) {
        liveMessage.textContent = t('liveLocationLoadFailed');
      }
    }
  }

  if (thisSearchId !== activeBusSearch) {
    return;
  }

  currentRealtimeBusNumber = busNumber;
  currentRealtimeBusCode = busCode;
  const channelName = busCode ? `bus-${busNumber}-${busCode}` : `bus-${busNumber}`;
  realtimeSubscription = window.supabaseClient.channel(channelName);

  const filter = busCode ? `bus_code=eq.${busCode}` : `bus_number=eq.${busNumber}`;

  realtimeSubscription.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'bus_location_shares',
      filter
    },
    (payload) => {
      const row = payload.new || payload.old || payload;
      console.log('Realtime bus location/capacity event received', {
        event: payload.eventType,
        filter,
        searchedBusNumber: busNumber,
        searchedBusCode: busCode,
        fullPayload: payload,
        fullRow: row,
        receivedBusNumber: row?.bus_number,
        receivedBusCode: row?.bus_code,
        receivedCapacityStatus: row?.capacity_status
      });

      if (!row || row.bus_number !== busNumber) {
        console.log('Realtime event ignored because bus_number did not match', {
          receivedBusNumber: row?.bus_number,
          searchedBusNumber: busNumber
        });
        return;
      }

      if (busCode && row.bus_code !== busCode) {
        console.log('Realtime event ignored because bus_code did not match', {
          receivedBusCode: row.bus_code,
          searchedBusCode: busCode
        });
        return;
      }

      const liveMessage = document.getElementById('liveLocationMessage');
      const expiresAt = row.expires_at
        ? new Date(row.expires_at).getTime()
        : null;
      if (expiresAt !== null && expiresAt <= Date.now()) {
        activeSessionsList.querySelectorAll('.session-button').forEach((button) => {
          const matchesSession = busCode
            ? button.dataset.busCode === busCode
            : button.dataset.busNumber === busNumber;
          if (matchesSession) {
            button.closest('.session-item')?.remove();
          }
        });
        activeBusSessions = activeBusSessions.filter((session) => (
          busCode
            ? session.bus_code !== busCode
            : session.bus_number !== busNumber
        ));
        if (!activeSessionsList.children.length) {
          activeSessionsMessage.textContent = t('noActiveBuses');
        }
        if (liveMessage) {
          liveMessage.textContent = t('sharingStopped');
        }
        const warning = document.getElementById('liveLocationWarning');
        const staleWarning = document.getElementById('liveLocationStaleWarning');
        if (warning) {
          warning.hidden = true;
        }
        if (staleWarning) {
          staleWarning.hidden = true;
          staleWarning.textContent = '';
        }
        liveMessage?.parentElement?.classList.remove('map-note--warning');
        clearBusLocationTicker();
        clearLiveBusMarker();
        return;
      }

      console.log('Calling updateCapacityFromRow for matched Realtime event', {
        busNumber: row.bus_number,
        busCode: row.bus_code,
        capacityStatus: row.capacity_status
      });
      updateCapacityFromRow(row);

      if (Object.prototype.hasOwnProperty.call(row, 'bus_type')) {
        setBusTypeBadges(row.bus_type);
        updateSessionBusTypeBadge(
          row.bus_number,
          row.bus_code,
          row.bus_type
        );
      }

      if (liveMessage) {
        console.log('Realtime event matched; updating live bus UI', {
          busNumber: row.bus_number,
          busCode: row.bus_code,
          updatedAt: row.updated_at
        });
        updateLiveBusLocationFromRow(row, liveMessage);
      }
    }
  );

  realtimeSubscription.subscribe((status) => {
    console.log('Realtime subscription status', {
      status,
      busNumber,
      busCode,
      filter
    });
  });
}

function isElementVisible(element) {
  if (!element || element.hidden) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  return rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.top < window.innerHeight;
}

window.refreshVisibleLiveLists = async function refreshVisibleLiveLists() {
  try {
    if (document.visibilityState !== 'visible') {
      return;
    }

    const catalogSection = busList?.closest('.catalog-section');
    await loadActiveCatalogBusNumbers();
    if (isElementVisible(catalogSection)) {
      renderBusCards();
    }
    window.UIMotion?.updateLiveCount(activeCatalogBusNumbers.size);

    if (isElementVisible(activeSessionsContainer)) {
      if (
        nearbyBusLatitude !== null &&
        nearbyBusLongitude !== null &&
        activeSessionsHeading?.textContent === t('nearbyActiveBuses')
      ) {
        await refreshNearbyBusSessions();
      } else if (currentBusNumber && currentBusRoute) {
        loadActiveBusSessions(currentBusNumber, currentBusRoute, false);
      }
    }
  } catch (error) {
    console.warn('Could not refresh visible live bus lists.', error);
  }
};

window.handleLiveShareEvent = async function handleLiveShareEvent(row, eventType) {
  try {
    const expiresAt = row.expires_at
      ? new Date(row.expires_at).getTime()
      : null;
    const isStopped = eventType === 'DELETE' ||
      (expiresAt !== null && Number.isFinite(expiresAt) && expiresAt <= Date.now());

    if (isStopped && activeSessionsList) {
      activeSessionsList.querySelectorAll('.session-button').forEach((button) => {
        const matches = row.bus_code
          ? button.dataset.busCode === row.bus_code
          : button.dataset.busNumber === row.bus_number;
        if (matches) {
          button.closest('.session-item')?.remove();
        }
      });
      activeBusSessions = activeBusSessions.filter((session) => (
        row.bus_code
          ? session.bus_code !== row.bus_code
          : session.bus_number !== row.bus_number
      ));
      if (!activeSessionsList.children.length && activeSessionsMessage) {
        activeSessionsMessage.textContent =
          activeSessionsHeading?.textContent === t('nearbyActiveBuses')
            ? t('noNearbyBuses')
            : t('noActiveBuses');
      }
    }

    const matchesOpenBus = currentRealtimeBusNumber === row.bus_number &&
      (!currentRealtimeBusCode || currentRealtimeBusCode === row.bus_code);
    const liveTab = document.querySelector('[data-result-tab="live"]');
    if (!matchesOpenBus || resultCard.hidden || liveTab?.getAttribute('aria-selected') !== 'true') {
      return;
    }

    const liveMessage = document.getElementById('liveLocationMessage');
    if (isStopped) {
      if (liveMessage) {
        liveMessage.textContent = t('sharingStopped');
      }
      document.getElementById('liveLocationWarning')?.setAttribute('hidden', '');
      const staleWarning = document.getElementById('liveLocationStaleWarning');
      if (staleWarning) {
        staleWarning.hidden = true;
        staleWarning.textContent = '';
      }
      liveMessage?.parentElement?.classList.remove('map-note--warning');
      clearBusLocationTicker();
      clearLiveBusMarker();
      return;
    }

    if (liveMessage && row.latitude != null && row.longitude != null) {
      updateCapacityFromRow(row);
      if (Object.prototype.hasOwnProperty.call(row, 'bus_type')) {
        setBusTypeBadges(row.bus_type);
        updateSessionBusTypeBadge(row.bus_number, row.bus_code, row.bus_type);
      }
      await updateLiveBusLocationFromRow(row, liveMessage);
    }
  } catch (error) {
    console.warn('Could not apply a live bus update to the open view.', error);
  }
};

async function showBusDetails(bus, autoSelectSession = true) {
  const normalizedBus = normalizeBusRecord(bus);

  if (!normalizedBus) {
    currentDisplayedBusRecord = null;
    setPageTitle();
    resultCard.hidden = true;
    mapWrapper.hidden = true;
    activeSessionsContainer.hidden = true;
    searchMessage.textContent = t('busNotFound');
    return;
  }

  if (detailsBackBtn) {
    detailsBackBtn.hidden = false;
  }
  if (liveMapRefreshInterval) {
    clearInterval(liveMapRefreshInterval);
    liveMapRefreshInterval = null;
  }
  clearLiveMapMarkers();
  setBottomNavActive('home');
  setResultTab('details');
  setBusFollowEnabled(true);
  followMapInitializedForBus = false;
  initialBusFlyInProgress = false;
  deferredInitialBusFlyIn = false;
  currentLiveBusExpiresAt = null;
  resetLiveStatus();
  resultTitle.textContent = normalizedBus.busNumber;
  setBusTypeBadges(null);
  setPageTitle(normalizedBus.busNumber);
  if (reportIssueLink) {
    reportIssueLink.href =
      `https://mail.google.com/mail/?view=cm&fs=1&to=apsrtclive@gmail.com&su=${encodeURIComponent(`Issue with Bus ${normalizedBus.busNumber}`)}`;
  }
  resultNumber.textContent = normalizedBus.busNumber;
  resultRoute.textContent = displayPlaceName(normalizedBus.routeName, true);
  resultStart.textContent = displayPlaceName(normalizedBus.startingPoint);
  resultDestination.textContent = displayPlaceName(normalizedBus.destination);
  renderPanelLiveStatus(null);
  resultSessionCode.textContent = currentBusSessionCode || '-';
  currentBusNumber = normalizedBus.busNumber;
  currentBusRoute = normalizedBus.routeName;
  currentDisplayedBusRecord = normalizedBus;
  updateDetailsFavoriteButton();
  rememberSearchedBus(normalizedBus.busNumber);
  clearBusSearchResults();

  resultStops.replaceChildren();

  if (!normalizedBus.stops.length) {
    const item = document.createElement('li');
    item.className = 'stop-item';
    item.textContent = t('noStops');
    resultStops.appendChild(item);
  } else {
    normalizedBus.stops.forEach((stop) => {
      const item = document.createElement('li');
      item.className = 'stop-item';
      item.textContent = window.translatePlace?.(stop) || stop;
      resultStops.appendChild(item);
    });
  }

  resultCard.hidden = false;
  mapWrapper.hidden = false;
  activeSessionsContainer.hidden = true;
  openDetailsPanel();
  stopRealtimeSubscription();
  clearLiveBusMarker();
  clearActiveBusSessions();

  if (map) {
    map.setView(defaultMapCenter, 13);
    window.setTimeout(() => map.invalidateSize({ pan: false }), 100);
  }

  await loadActiveBusSessions(
    normalizedBus.busNumber,
    normalizedBus.routeName,
    autoSelectSession
  );
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = document.getElementById('busNumber');
  input.blur();
  liveOnlySearch = false;
  nearbySearchResults = false;
  document.querySelectorAll('[data-search-filter]').forEach((button) => {
    const selected = button.dataset.searchFilter === 'all';
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  clearBusSearchResults();
  if (liveMapRefreshInterval) {
    clearInterval(liveMapRefreshInterval);
    liveMapRefreshInterval = null;
  }
  clearLiveMapMarkers();
  setBottomNavActive('home');
  detailsReturnView = { type: 'catalog' };
  clearNearbyBusTimers();

  const query = input.value.trim();

  if (!query) {
    setPageTitle();
    clearBusSearchResults();
    searchMessage.textContent = t('enterBusNumber');
    resultCard.hidden = true;
    mapWrapper.hidden = true;
    activeSessionsContainer.hidden = true;
    return;
  }

  if (!window.supabaseHelpers) {
    console.error(
      'Bus search could not run because Supabase helpers are unavailable.',
      new Error('Supabase helpers are unavailable.')
    );
    setPageTitle();
    clearBusSearchResults();
    stopRealtimeSubscription();
    clearLiveBusMarker();
    resultCard.hidden = true;
    mapWrapper.hidden = true;
    activeSessionsContainer.hidden = true;
    searchMessage.textContent = t('searchLoadFailed');
    return;
  }

  try {
    const { data, error } = await window.supabaseHelpers.getBusByNumber(query);

    if (error) {
      throw error;
    }

    const matchingBuses = Array.isArray(data) ? data : data ? [data] : [];

    if (!matchingBuses.length) {
      setPageTitle();
      clearBusSearchResults();
      stopRealtimeSubscription();
      clearLiveBusMarker();
      resultCard.hidden = true;
      mapWrapper.hidden = true;
      activeSessionsContainer.hidden = true;
      searchMessage.textContent = t('busNotFound');
      return;
    }

    setPageTitle();
    stopRealtimeSubscription();
    clearLiveBusMarker();
    clearActiveBusSessions(false);
    resultCard.hidden = true;
    mapWrapper.hidden = true;
    activeSessionsContainer.hidden = true;
    setBusFollowEnabled(true);
    let liveSessions = [];
    try {
      liveSessions = await getLiveSessionsForBuses(matchingBuses);
    } catch (error) {
      console.error('Could not load live sessions for search results.', error);
      liveSessions = getUnexpiredLiveSessions(activeLiveSessions);
    }
    activeLiveSessions = liveSessions;
    const busTypesByNumber = new Map();
    liveSessions.forEach((session) => {
      const key = normalizeBusNumberKey(session.bus_number);
      if (!busTypesByNumber.has(key) && session.bus_type) {
        busTypesByNumber.set(key, session.bus_type);
      }
    });
    renderBusSearchResults(
      matchingBuses,
      query,
      busTypesByNumber,
      liveSessions
    );
    searchMessage.textContent = '';
    const pendingOpen = pendingBusDetailsOpen;
    pendingBusDetailsOpen = null;
    if (
      pendingOpen &&
      normalizeBusNumberKey(pendingOpen.busNumber) ===
        normalizeBusNumberKey(query)
    ) {
      const bus = matchingBuses.find((record) =>
        normalizeBusNumberKey(record.bus_number) ===
        normalizeBusNumberKey(pendingOpen.busNumber)
      );
      const normalizedBus = normalizeBusRecord(bus);
      if (normalizedBus) {
        const session = pendingOpen.busCode
          ? liveSessions.find((row) =>
            row.bus_code === pendingOpen.busCode
          )
          : null;
        showBusDetails(normalizedBus, !pendingOpen.busCode)
          .then(() => {
            if (session) {
              selectActiveBusSession(
                normalizedBus.busNumber,
                session.bus_code,
                pendingOpen.busType || session.bus_type
              );
            }
          })
          .catch((error) => {
            console.error('Could not open the selected bus details.', error);
            showToast(t('connectionProblem'), true);
          });
      }
    }
  } catch (error) {
    console.error('Bus search failed', error);
    setPageTitle();
    clearBusSearchResults();
    stopRealtimeSubscription();
    clearLiveBusMarker();
    resultCard.hidden = true;
    mapWrapper.hidden = true;
    activeSessionsContainer.hidden = true;
    searchMessage.textContent = t('searchLoadFailed');
  }
});

const busSearchInput = document.getElementById('busNumber');
const submitSearchFromInput = () => {
  if (Date.now() - lastInputSearchAt >= 250) {
    lastInputSearchAt = Date.now();
    searchForm.requestSubmit();
  }
  busSearchInput.blur();
};
busSearchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.keyCode === 13) {
    event.preventDefault();
    submitSearchFromInput();
  }
});
busSearchInput.addEventListener('search', submitSearchFromInput);
const blurSearchInput = () => {
  if (document.activeElement === busSearchInput) {
    busSearchInput.blur();
  }
};
searchResultsList.addEventListener('touchstart', blurSearchInput, {
  passive: true
});
searchResultsList.addEventListener('scroll', blurSearchInput, {
  passive: true
});
liveBusesNearMeBtn?.addEventListener('click', blurSearchInput);
retryDataLoadBtn?.addEventListener('click', () => {
  setConnectionError(false);
  loadBusCatalog().catch((error) => {
    console.error('Could not retry loading the bus catalog.', error);
    showCatalogLoadError('catalogLoadFailed');
  });
});

function handleBusCatalogClick(event) {
  const favoriteButton = event.target.closest('[data-favorite-number]');
  if (favoriteButton) {
    event.preventDefault();
    event.stopPropagation();
    toggleFavoriteBus(favoriteButton.dataset.favoriteNumber);
    return;
  }

  const card = event.target.closest('[data-bus-number]');
  if (!card) {
    return;
  }

  const input = document.getElementById('busNumber');
  detailsReturnView = { type: 'catalog' };
  pendingBusDetailsOpen = {
    busNumber: card.dataset.busNumber,
    busCode: card.dataset.busCode || null,
    busType: card.dataset.busType || null
  };
  blurSearchInput();
  input.value = card.dataset.busNumber;
  searchForm.requestSubmit();
}

busList.addEventListener('click', handleBusCatalogClick);
favoriteBusList?.addEventListener('click', handleBusCatalogClick);
favoriteBusBtn?.addEventListener('click', () => {
  toggleFavoriteBus(currentBusNumber);
});

document.querySelectorAll('[data-result-tab]').forEach((tab) => {
  tab.addEventListener('click', () => {
    setResultTab(tab.dataset.resultTab);
  });
});

document.querySelector('[role="tablist"]')?.addEventListener(
  'keydown',
  (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return;
    }

    const tabs = Array.from(
      document.querySelectorAll('[data-result-tab]')
    );
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex < 0) {
      return;
    }

    event.preventDefault();
    let nextIndex = currentIndex;
    if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex + tabs.length - 1) % tabs.length;
    } else if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    tabs[nextIndex].focus();
    setResultTab(tabs[nextIndex].dataset.resultTab);
  }
);

recentSearchChips.addEventListener('click', (event) => {
  const chip = event.target.closest('[data-bus-number]');
  if (!chip) {
    return;
  }

  const input = document.getElementById('busNumber');
  pendingBusDetailsOpen = {
    busNumber: chip.dataset.busNumber,
    busCode: null,
    busType: null
  };
  blurSearchInput();
  input.value = chip.dataset.busNumber;
  searchForm.requestSubmit();
});

searchResultsList.addEventListener('click', (event) => {
  blurSearchInput();
  const searchResultButton = event.target.closest('[data-search-result-index]');
  if (searchResultButton) {
    const index = Number(searchResultButton.dataset.searchResultIndex);
    const result = searchResultCards[index];
    const selectedBus = normalizeBusRecord(result?.bus);
    if (selectedBus && result) {
      detailsReturnView = {
        type: 'searchResults',
        buses: [...busSearchResults],
        query: busSearchQuery,
        sessions: [...activeLiveSessions],
        nearby: nearbySearchResults,
        latitude: nearbyBusLatitude,
        longitude: nearbyBusLongitude
      };
      showBusDetails(selectedBus, false)
        .then(() => {
          if (result.busType) {
            setBusTypeBadges(result.busType);
          }
          if (result.session) {
            selectActiveBusSession(
              selectedBus.busNumber,
              result.session.bus_code,
              result.busType
            );
          } else {
            document.getElementById('liveLocationMessage').textContent =
              t('noLiveLocation');
          }
          searchMessage.textContent = t('selectedBusDetails', {
            number: selectedBus.busNumber
          });
        })
        .catch((error) => {
          console.error('Failed to show selected bus', error);
          searchMessage.textContent = t('connectionProblem');
        });
    }
  }
});

document.querySelectorAll('[data-search-filter]').forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    blurSearchInput();
    liveOnlySearch = filterButton.dataset.searchFilter === 'live';
    document.querySelectorAll('[data-search-filter]').forEach((button) => {
      const selected = button === filterButton;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    const types = new Map(
      searchResultCards.map(({ normalizedBus, busType }) => [
        normalizeBusNumberKey(normalizedBus.busNumber),
        busType
      ])
    );
    renderBusSearchResults(
      busSearchResults,
      busSearchQuery,
      types,
      activeLiveSessions
    );
  });
});

activeSessionsList.addEventListener('click', (event) => {

  const button = event.target.closest('[data-bus-number]');
  if (!button) {
    return;
  }

  const busCode = button.dataset.busCode || null;
  const busNumber = button.dataset.busNumber;
  selectActiveBusSession(busNumber, busCode, button.dataset.busType || null);
});

copyBusLinkBtn.addEventListener('click', () => {
  if (!currentBusSessionCode) {
    copyBusLinkMessage.textContent = t('selectBusFirst');
    return;
  }

  copyBusLinkMessage.textContent = '';
  window.openBusShareSheet({
    url: getBusSessionUrl(currentBusSessionCode),
    busNumber: currentBusNumber,
    busType: currentBusType,
    trigger: copyBusLinkBtn
  });
});

capacityButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const selectedStatus = button.dataset.capacityStatus;
    const busCode = currentBusSessionCode;

    if (!busCode || !capacityLabels[selectedStatus]) {
      setCapacityMessage(
        t('selectActiveSessionCapacity'),
        true
      );
      return;
    }

    capacityButtons.forEach((capacityButton) => {
      capacityButton.disabled = true;
    });
    setCapacityMessage(t('capacitySaving'));

    try {
      const { data, error } = await window.supabaseHelpers.updateBusCapacity({
        busCode,
        capacityStatus: selectedStatus
      });

      if (error) {
        throw error;
      }

      updateCapacityFromRow(data);
      setCapacityMessage('');
      showToast(t('capacityUpdated'));
    } catch (error) {
      console.error('Capacity update failed', error);
      setCapacityMessage('');
      showToast(t('capacityUpdateFailed', { error: error.message }), true);
    } finally {
      capacityButtons.forEach((capacityButton) => {
        capacityButton.disabled = false;
      });
    }
  });
});

findNearbyBtn.addEventListener('click', searchLiveBusesNearMe);
liveBusesNearMeBtn?.addEventListener('click', searchLiveBusesNearMe);

toggleAddBusBtn.addEventListener('click', () => {
  if (!addBusSection) {
    return;
  }

  addBusSection.hidden = !addBusSection.hidden;
  if (!addBusSection.hidden) {
    setAddBusMessage(t('addBusInstructions'));
  } else {
    setAddBusMessage('');
  }
});

addBusForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!window.supabaseHelpers) {
    setAddBusMessage(t('supabaseUnavailable'), true);
    return;
  }

  const busNumber = newBusNumber?.value.trim();
  const route = newBusRoute?.value.trim();
  const startingPoint = newBusStart?.value.trim();
  const destination = newBusDestination?.value.trim();
  const stops = parseStopsInput(newBusStops?.value);

  if (!busNumber || !route || !startingPoint || !destination) {
    setAddBusMessage(t('requiredBusFields'), true);
    return;
  }

  setAddBusMessage(t('addingBus'), false);

  const { data, error } = await window.supabaseHelpers.createBus({
    busNumber,
    route,
    startingPoint,
    destination,
    stops
  });

  if (error) {
    setAddBusMessage(error.message || t('couldNotAddBus'), true);
    return;
  }

  setAddBusMessage('');
  showToast(t('busAdded', { number: data.bus_number }));
  newBusNumber.value = '';
  newBusRoute.value = '';
  newBusStart.value = '';
  newBusDestination.value = '';
  newBusStops.value = '';
  loadBusCatalog();
});

shareLocationBtn.addEventListener('click', () => {
  const busNumber = (resultNumber.textContent || '').trim();
  const routeName = (resultRoute.textContent || '').trim();

  if (!busNumber || busNumber === '-') {
    stopLocationSharing(t('selectBusFirst'));
    return;
  }

  const chosenBusType = document.querySelector(
    'input[name="shareBusType"]:checked'
  )?.value;
  if (!['ordinary', 'metro_express'].includes(chosenBusType)) {
    busTypeChoiceHint.textContent =
      t('busTypeRequired');
    document.querySelector('input[name="shareBusType"]')?.focus();
    showToast(t('busTypeRequired'), true);
    return;
  }
  selectedShareBusType = chosenBusType;

  let customDurationMilliseconds = null;
  if (timerSelect.value === 'custom') {
    const durationMinutes = Number(customDurationMinutes.value);
    const maximumDurationMinutes = Math.floor(2147483647 / 60000);
    if (
      !Number.isSafeInteger(durationMinutes) ||
      durationMinutes < 1 ||
      durationMinutes > maximumDurationMinutes
    ) {
      showToast(t('invalidDuration', { maximum: maximumDurationMinutes }), true);
      customDurationMinutes.focus();
      return;
    }
    customDurationMilliseconds = durationMinutes * 60000;
  }

  const sessionCode = generateBusSessionCode(busNumber);
  currentBusSessionCode = sessionCode;
  if (resultSessionCode) {
    resultSessionCode.textContent = sessionCode;
  }

  const routeLabel = routeName && routeName !== '-' ? routeName : t('selectedRoute');
  const confirmText = [
    t('shareConfirmationThanks', { number: busNumber }),
    t('shareConfirmationAppreciation'),
    '',
    t('shareConfirmationType', {
      type: chosenBusType === 'ordinary' ? t('ordinary') : t('metroExpress')
    }),
    t('shareConfirmationSession', { code: sessionCode, route: routeLabel }),
    t('shareConfirmationAsk')
  ].join('\n');

  if (!window.confirm(confirmText)) {
    currentBusSessionCode = null;
    if (resultSessionCode) {
      resultSessionCode.textContent = '-';
    }
    return;
  }

  if (customDurationMilliseconds !== null) {
    let customOption = timerSelect.querySelector('[data-custom-duration="true"]');
    if (!customOption) {
      customOption = document.createElement('option');
      customOption.dataset.customDuration = 'true';
      timerSelect.append(customOption);
    }
    customOption.value = String(customDurationMilliseconds);
    customOption.textContent = t('customDurationOption', {
      minutes: customDurationMilliseconds / 60000
    });
    timerSelect.value = customOption.value;
    customDurationMinutes.hidden = true;
  }

  setBusTypeBadges(chosenBusType);
  startLocationSharing();
  if (isSharingActive) {
    locationPanel.hidden = false;
    sharingReminder.hidden = false;
  }
});

busTypeOptions.forEach((option) => {
  option.addEventListener('change', () => {
    if (!option.checked) {
      return;
    }
    selectedShareBusType = option.value;
    busTypeChoiceHint.textContent = t('chooseRidingTypeHint');
    try {
      localStorage.setItem('apsrtc-live-bus-type', option.value);
    } catch (error) {
      console.warn('The selected bus type could not be saved.', error);
    }
  });
});

timerSelect.addEventListener('change', () => {
  const isCustomDuration = timerSelect.value === 'custom';
  customDurationMinutes.hidden = !isCustomDuration;
  if (isCustomDuration) {
    customDurationMinutes.focus();
  }
});

stopSharingBtn.addEventListener('click', () => {
  window.SessionControl?.endShareSession(
    currentBusSessionCode,
    currentBusNumber
  );
  stopLocationSharing(t('locationSharingStopped'));
});

new MutationObserver(() => {
  if (!isSharingActive) {
    sharingReminder.hidden = true;
  }
}).observe(locationStatusText, { childList: true, characterData: true, subtree: true });

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    setBackgroundGpsWorkerActive(false);
    if (!window.NativeTracking?.isNative()) {
      requestWakeLock();
    }
  } else {
    setBackgroundGpsWorkerActive(true);
  }
});

window.addEventListener('beforeunload', () => {
  clearNearbyBusTimers();
  if (activeCatalogRetryTimer) {
    clearTimeout(activeCatalogRetryTimer);
    activeCatalogRetryTimer = null;
  }
  if (liveMapRetryTimer) {
    clearTimeout(liveMapRetryTimer);
    liveMapRetryTimer = null;
  }
  if (window.NativeTracking?.isNative()) {
    window.NativeTracking.stop();
  }
  gpsBackupWorker?.terminate();
  stopRealtimeSubscription();
});

homeLink.addEventListener('click', returnToHome);
bottomHomeBtn?.addEventListener('click', returnToHome);
bottomLiveMapBtn?.addEventListener('click', showLiveMapView);
detailsBackBtn.addEventListener('click', requestCloseDetailsPanel);
document.getElementById('detailsCloseBtn')?.addEventListener(
  'click',
  requestCloseDetailsPanel
);
detailsMapBtn?.addEventListener('click', () => {
  setDetailsPanelState(isPhoneDetailsLayout() ? 'peek' : 'hidden');
});
mapDetailsBtn?.addEventListener('click', () => {
  if (resultCard.hidden) {
    return;
  }
  openDetailsPanel();
});
panelFollowBtn?.addEventListener('click', () => {
  setBusFollowEnabled(true);
  if (isCurrentBusLive() && liveBusMarker) {
    panMapToLiveBus(true);
  }
});
window.addEventListener('resize', () => {
  if (resultCard.hidden) {
    return;
  }
  if (isPhoneDetailsLayout()) {
    document.body.classList.remove('details-panel-hidden');
    if (!resultCard.dataset.snapState) {
      resultCard.dataset.snapState = 'peek';
    }
    if (panelDragPointerId === null) {
      resultCard.style.transform =
        `translate3d(0, ${getDetailsPanelOffset(
          resultCard.dataset.snapState
        )}px, 0)`;
    }
  } else {
    resultCard.style.removeProperty('transform');
  }
  if (panelDragPointerId === null) {
    scheduleMapAfterPanelSnap();
  }
});
moreMenuBtn?.addEventListener('click', () => {
  setBottomNavActive('more');
  moreMenu?.showModal();
});
moreMenu?.addEventListener('close', () => {
  setBottomNavActive(
    !mapWrapper.hidden && resultCard.hidden ? 'map' : 'home'
  );
});
moreMenuCloseBtn?.addEventListener('click', () => moreMenu?.close());
moreMenu?.addEventListener('click', (event) => {
  if (event.target === moreMenu) {
    moreMenu.close();
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !resultCard.hidden && !document.querySelector('dialog[open]')) {
    requestCloseDetailsPanel();
  }
});
window.addEventListener('popstate', () => {
  const openDialog = Array.from(document.querySelectorAll('dialog'))
    .reverse()
    .find((dialog) => dialog.open);
  if (
    openDialog &&
    window.history.state?.appDialogId !== getDialogHistoryId(openDialog)
  ) {
    dialogHistoryBackInProgress = true;
    openDialog.close();
    return;
  }

  if (
    detailsHistoryEntry &&
    window.history.state?.detailsPanelEntryId !== detailsHistoryEntryId &&
    !resultCard.hidden
  ) {
    detailsHistoryEntry = false;
    detailsHistoryEntryId = null;
    returnFromBusDetails();
    const url = new URL(window.location.href);
    if (url.searchParams.has('bus')) {
      url.searchParams.delete('bus');
      window.history.replaceState(
        window.history.state,
        '',
        `${url.pathname}${url.search}${url.hash}`
      );
    }
  }
});
moreDisclaimerBtn?.addEventListener('click', () => {
  moreMenu?.close();
  sharingDisclaimer?.showModal();
});
shareMyBusLocationBtn?.addEventListener('click', () => {
  document.getElementById('busNumber')?.focus();
  document.getElementById('busNumber')?.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
});
liveNowList?.addEventListener('click', (event) => {
  const card = event.target.closest('[data-bus-number]');
  if (!card) {
    return;
  }
  const input = document.getElementById('busNumber');
  blurSearchInput();
  pendingBusDetailsOpen = {
    busNumber: card.dataset.busNumber,
    busCode: card.dataset.busCode || null,
    busType: card.dataset.busType || null
  };
  detailsReturnView = { type: 'catalog' };
  input.value = card.dataset.busNumber;
  searchForm.requestSubmit();
});
findNearbyBtn.addEventListener('click', () => moreMenu?.close());

const heroCopy = document.querySelector('.hero-copy');
if (heroCopy && moreInstallSlot) {
  const moveInstallControls = () => {
    const controls = heroCopy.querySelector('.pwa-install-controls');
    if (controls && controls.parentElement !== moreInstallSlot) {
      moreInstallSlot.appendChild(controls);
    }
  };
  moveInstallControls();
  new MutationObserver(moveInstallControls).observe(heroCopy, {
    childList: true,
    subtree: true
  });
}

async function resumeSavedShareSession(session) {
  if (!window.supabaseHelpers) {
    showToast(t('couldNotReconnect'), true);
    return;
  }

  try {
    const { data, error } = await window.supabaseHelpers.getBusByNumber(
      session.busNumber
    );
    if (error) {
      throw error;
    }

    const buses = Array.isArray(data) ? data : data ? [data] : [];
    const bus = buses.find((record) => (
      String(record.bus_number).trim().toLowerCase() ===
      session.busNumber.trim().toLowerCase()
    ));
    const normalizedBus = normalizeBusRecord(bus);
    if (!normalizedBus) {
      throw new Error('The saved bus could not be found.');
    }

    await showBusDetails(normalizedBus);
    currentBusNumber = normalizedBus.busNumber;
    currentBusSessionCode = session.busCode || null;
    selectedShareBusType = ['ordinary', 'metro_express'].includes(session.busType)
      ? session.busType
      : null;
    busTypeOptions.forEach((option) => {
      option.checked = option.value === selectedShareBusType;
    });
    setBusTypeBadges(selectedShareBusType);
    resultSessionCode.textContent = currentBusSessionCode || '-';

    if (session.expiresAt) {
      const remainingMilliseconds =
        new Date(session.expiresAt).getTime() - Date.now();
      if (remainingMilliseconds <= 0) {
        await window.SessionControl.endShareSession(
          session.busCode,
          session.busNumber
        );
        window.SessionControl.clearSession();
        showToast(t('sharingExpired'), true);
        return;
      }

      let durationOption = timerSelect.querySelector(
        '[data-resume-duration="true"]'
      );
      if (!durationOption) {
        durationOption = document.createElement('option');
        durationOption.dataset.resumeDuration = 'true';
        timerSelect.appendChild(durationOption);
      }
      durationOption.value = String(remainingMilliseconds);
      durationOption.textContent = t('remainingSessionTime');
      timerSelect.value = durationOption.value;
    } else {
      timerSelect.value = '0';
    }
    customDurationMinutes.hidden = true;

    startLocationSharing(session.expiresAt || null);
    if (isSharingActive) {
      locationPanel.hidden = false;
      sharingReminder.hidden = false;
    }
  } catch (error) {
    console.error('Could not resume the saved sharing session.', error);
    showToast(t('couldNotResume'), true);
  }
}

window.addEventListener('languagechange', () => {
  try {
    setPageTitle(!resultCard.hidden ? currentBusNumber : null);
    renderBusCards();
    updateDetailsFavoriteButton();
    if (!mapWrapper.hidden && resultCard.hidden) {
      refreshLiveMapMarkers();
    }
    if (!resultCard.hidden && currentBusNumber) {
      resultTitle.textContent = currentBusNumber;
      setBusTypeBadges(currentBusType);
      const currentBus = currentDisplayedBusRecord;
      if (currentBus) {
        resultRoute.textContent = displayPlaceName(currentBus.routeName, true);
        resultStart.textContent = displayPlaceName(currentBus.startingPoint);
        resultDestination.textContent = displayPlaceName(currentBus.destination);
        resultStops.replaceChildren();
        if (!currentBus.stops.length) {
          const item = document.createElement('li');
          item.className = 'stop-item';
          item.textContent = t('noStops');
          resultStops.appendChild(item);
        } else {
          currentBus.stops.forEach((stop) => {
            const item = document.createElement('li');
            item.className = 'stop-item';
            item.textContent = window.translatePlace?.(stop) || stop;
            resultStops.appendChild(item);
          });
        }
      }
    }

    const isNearbyList = nearbyBusLatitude !== null &&
      nearbyBusLongitude !== null &&
      !activeSessionsContainer.hidden;
    if (isNearbyList) {
      activeSessionsHeading.textContent = t('nearbyActiveBuses');
      activeSessionsMessage.textContent = activeSessionsList.children.length
        ? t('nearbyActiveBuses')
        : t('noNearbyBuses');
    } else if (!activeSessionsContainer.hidden && currentBusNumber && currentBusRoute) {
      activeSessionsHeading.textContent = t('activeBusesOnRoute');
      activeSessionsMessage.textContent = activeSessionsList.children.length > 1
        ? t('activeBusesRoute', { number: currentBusNumber })
        : t('chooseSpecificBus');
    }

    document.querySelectorAll('.session-bus-label').forEach((label) => {
      label.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent = `${t('busNumber')} ${label.dataset.busNumber}` +
            `${label.dataset.busCode ? `-${label.dataset.busCode}` : ''}`;
        }
      });
    });
    document.querySelectorAll('[data-route-session-updated-at], [data-nearby-updated-at]')
      .forEach((updated) => {
        const timestamp = updated.dataset.routeSessionUpdatedAt ||
          updated.dataset.nearbyUpdatedAt;
        updated.textContent = t('updated', { time: formatTimeAgo(timestamp) });
      });
    if (!searchResultsContainer.hidden) {
      const resultTypes = new Map(
        searchResultCards.map(({ normalizedBus, busType }) => [
          normalizeBusNumberKey(normalizedBus.busNumber),
          busType
        ])
      );
      renderBusSearchResults(
        busSearchResults,
        busSearchQuery,
        resultTypes,
        activeLiveSessions
      );
      searchResultsMessage.textContent = t('searchChoice', {
        query: busSearchQuery
      });
    }
    document.querySelectorAll('.bus-type-badge').forEach((badge) => {
      badge.textContent = badge.dataset.busType === 'ordinary'
        ? t('ordinary')
        : t('metroExpress');
    });

    if (!isSharingActive) {
      locationStatusText.textContent = t('sharingInactive');
    } else if (
      locationStatusText.textContent === 'Location sharing is active' ||
      locationStatusText.textContent === 'స్థాన షేరింగ్ కొనసాగుతోంది' ||
      locationStatusText.textContent === t('sharingActive')
    ) {
      locationStatusText.textContent = t('sharingActive');
    }

    renderLiveDirection(liveDirection.classList.contains('is-moving'));
    renderLiveMovementStatus();
    renderPanelLiveStatus();
    const capacityKey = capacityStatus.dataset.capacityStatus;
    renderCapacityStatus(capacityKey && capacityKey !== 'unreported' ? capacityKey : null);
    if (liveBusUpdatedAt) {
      startBusLocationTicker(document.getElementById('liveLocationMessage'), liveBusUpdatedAt);
    }
  } catch (error) {
    console.warn('Could not refresh visible text after changing language.', error);
  }
});

async function initializeApp() {
  initMap();
  renderBusCatalogSkeletons();
  renderRecentBusSearches();

  console.log('initializeApp: Supabase client and DOM are ready', {
    hasSupabaseClient: Boolean(window.supabaseClient),
    hasSupabaseHelpers: Boolean(window.supabaseHelpers),
    readyState: document.readyState
  });

  try {
    loadFavoriteBusNumbers();
    await loadBusCatalog();
    await loadBusSessionFromUrl();
    if (liveCatalogRefreshInterval) {
      clearInterval(liveCatalogRefreshInterval);
    }
    liveCatalogRefreshInterval = window.setInterval(
      loadActiveCatalogBusNumbers,
      15000
    );
  } catch (error) {
    console.error('Application data initialization failed', error);
    showUnexpectedErrorToast(error);
  } finally {
    hideLoadingIndicator();
    window.SessionControl?.initialize({
      onResume: resumeSavedShareSession,
      onStop: () => {
        stopLocationSharing(t('locationSharingStopped'));
      }
    }).catch((error) => {
      console.error('Could not initialize saved sharing session controls.', error);
    });
  }
}

function startApp() {
  setBackgroundGpsWorkerActive(document.visibilityState === 'hidden');
  if (sharingDisclaimer?.showModal) {
    sharingDisclaimer.showModal();
  }
  initializeApp().catch((error) => {
    console.error('Application initialization failed', error);
    showUnexpectedErrorToast(error);
  });
}

dismissSharingDisclaimer.addEventListener('click', () => {
  sharingDisclaimer.close();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp, { once: true });
} else {
  startApp();
}
