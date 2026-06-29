/*
 * Grats — UAE Gratuity Calculator
 * Service Worker: offline-first app shell with resilient runtime caching.
 *
 * Strategies
 *  - Navigations (HTML): network-first, fall back to cached shell, then /offline.html
 *  - Same-origin static assets: stale-while-revalidate
 *  - Trusted cross-origin CDN assets (fonts, jsPDF, icons): cache-first (best-effort)
 *  - Exchange-rate APIs and everything else cross-origin: network-only (never cached)
 */
'use strict';

const VERSION = 'v1.0.0';
const PRECACHE = `grats-precache-${VERSION}`;
const RUNTIME = `grats-runtime-${VERSION}`;
const OFFLINE_URL = '/offline.html';

// App shell — best-effort precache (install won't fail if one asset is missing).
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/css/styles.css',
  '/js/script.js',
  '/js/protection.js',
  '/js/logo-data.js',
  '/js/pwa.js',
  '/img/logo.svg',
  '/img/dirham.svg',
  '/img/grats.png',
  '/img/favicon.png',
  '/img/favicon.ico',
  '/img/icon-192.png',
  '/img/icon-maskable-192.png',
  '/img/icon-maskable-512.png'
];

// Cross-origin hosts we are willing to cache at runtime.
const CDN_HOSTS = [
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

// APIs that must always hit the network (live data, never cached).
const NETWORK_ONLY_HOSTS = [
  'api.exchangerate-api.io',
  'api.fxratesapi.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(PRECACHE);
    await Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(new Request(url, { cache: 'reload' }))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Enable navigation preload where supported for faster first paint.
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch (e) { /* noop */ }
    }
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => k !== PRECACHE && k !== RUNTIME).map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// Allow the page to trigger an immediate update.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

function isPrecached(url) {
  const u = new URL(url);
  return PRECACHE_URLS.includes(u.pathname);
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === 'opaque')) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);
  return cached || network || fetch(request);
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && (response.ok || response.type === 'opaque')) {
    cache.put(request, response.clone());
  }
  return response;
}

async function handleNavigation(event) {
  try {
    const preload = await event.preloadResponse;
    if (preload) return preload;
    const network = await fetch(event.request);
    return network;
  } catch (e) {
    const cache = await caches.open(PRECACHE);
    return (
      (await cache.match(event.request, { ignoreSearch: true })) ||
      (await cache.match('/index.html')) ||
      (await cache.match('/')) ||
      (await cache.match(OFFLINE_URL)) ||
      new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
    );
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never intercept live API traffic.
  if (NETWORK_ONLY_HOSTS.includes(url.hostname)) return;

  // App navigations → network-first with offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(event));
    return;
  }

  // Same-origin assets → stale-while-revalidate (precache lives in PRECACHE).
  if (url.origin === self.location.origin) {
    const cacheName = isPrecached(request.url) ? PRECACHE : RUNTIME;
    event.respondWith(staleWhileRevalidate(request, cacheName));
    return;
  }

  // Trusted CDN assets → cache-first.
  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request, RUNTIME));
    return;
  }

  // Everything else: default network, fall back to any cached copy.
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});
