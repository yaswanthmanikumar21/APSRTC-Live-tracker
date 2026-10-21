const CACHE_VERSION = 'apsrtc-live-v8';
const APP_SHELL = [
  '/',
  '/index.html',
  '/404.html',
  '/offline.html',
  '/manifest.json',
  '/css/styles.css',
  '/Images/favicon.png',
  '/Images/logo-icon.png',
  '/Images/icon-192.png',
  '/Images/icon-512.png',
  '/js/vendor/gsap.min.js',
  '/js/vendor/confetti.browser.js',
  '/js/i18n.js',
  '/js/place-names.js',
  '/js/supabaseClient.js',
  '/js/bus-type.js',
  '/js/stop-coords.js',
  '/js/trip-tools.js',
  '/js/native-tracking.js',
  '/js/session-control.js',
  '/js/ui-motion.js',
  '/js/back-button.js',
  '/js/app.js',
  '/js/live-updates.js',
  '/js/effects.js',
  '/js/share-sheet.js',
  '/js/theme.js',
  '/js/pwa.js'
];
const CACHE_PREFIX = 'apsrtc-live-';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_VERSION);
      await cache.addAll(APP_SHELL);
      await self.skipWaiting();
    } catch (error) {
      console.warn('Could not precache the APSRTC Live app shell.', error);
      throw error;
    }
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) =>
            cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_VERSION
          )
          .map((cacheName) => caches.delete(cacheName))
      );
      await self.clients.claim();
    } catch (error) {
      console.warn('Could not activate the APSRTC Live service worker.', error);
    }
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  let requestUrl;

  try {
    requestUrl = new URL(request.url);
  } catch (error) {
    console.warn('Could not parse a service-worker request URL.', error);
    return;
  }

  if (
    requestUrl.origin !== self.location.origin ||
    requestUrl.hostname.endsWith('supabase.co') ||
    requestUrl.hostname === 'tile.openstreetmap.org' ||
    requestUrl.hostname.endsWith('.tile.openstreetmap.org')
  ) {
    return;
  }

  const isAppShellAsset = request.mode === 'navigate' ||
    /\.(?:html|css|js)$/i.test(requestUrl.pathname);
  if (!isAppShellAsset) {
    return;
  }

  event.respondWith((async () => {
    try {
      const cache = await caches.open(CACHE_VERSION);
      try {
        const response = await fetch(request);
        if (response.ok && response.type === 'basic') {
          await cache.put(request, response.clone());
        }
        return response;
      } catch (networkError) {
        if (request.mode === 'navigate' && self.navigator.onLine) {
          throw networkError;
        }
        const cachedResponse = request.mode === 'navigate'
          ? await cache.match('/offline.html')
          : await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        throw networkError;
      }
    } catch (error) {
      console.warn('Could not serve an app-shell request.', error);
      throw error;
    }
  })());
});
