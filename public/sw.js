// Hand-crafted service worker for SuriRate PWA
// Replaces the generated Workbox service worker from next-pwa

const CACHE_VERSION = "v1";
const CACHE_PREFIX = "surirate";

const CACHE_NAMES = {
  precache: `${CACHE_PREFIX}-precache-${CACHE_VERSION}`,
  navigations: `${CACHE_PREFIX}-navigations-${CACHE_VERSION}`,
  static: `${CACHE_PREFIX}-static-${CACHE_VERSION}`,
  images: `${CACHE_PREFIX}-images-${CACHE_VERSION}`,
  fonts: `${CACHE_PREFIX}-fonts-${CACHE_VERSION}`,
};

const PRECACHE_URLS = ["/offline.html"];

const MAX_ENTRIES = {
  navigations: 50,
  static: 100,
  images: 200,
  fonts: 30,
};

const NETWORK_TIMEOUT_MS = 10_000;

// --- Helpers ---

function trimCache(cacheName, maxEntries) {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > maxEntries) {
        cache.delete(keys[0]).then(() => trimCache(cacheName, maxEntries));
      }
    });
  });
}

function networkFirstWithTimeout(request, cacheName, timeoutMs) {
  return new Promise((resolve) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      caches.match(request).then((cached) => {
        resolve(cached || caches.match("/offline.html"));
      });
    }, timeoutMs);

    fetch(request)
      .then((response) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (response.ok || response.type === "opaqueredirect") {
          const clone = response.clone();
          caches.open(cacheName).then((cache) => {
            cache.put(request, clone);
            trimCache(cacheName, MAX_ENTRIES.navigations);
          });
        }
        resolve(response);
      })
      .catch(() => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        caches.match(request).then((cached) => {
          resolve(cached || caches.match("/offline.html"));
        });
      });
  });
}

function staleWhileRevalidate(request, cacheName, maxEntries) {
  return caches.match(request).then((cached) => {
    const fetchPromise = fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(cacheName).then((cache) => {
            cache.put(request, clone);
            trimCache(cacheName, maxEntries);
          });
        }
        return response;
      })
      .catch(() => cached);

    return cached || fetchPromise;
  });
}

function cacheFirst(request, cacheName, maxEntries) {
  return caches.match(request).then((cached) => {
    if (cached) return cached;
    return fetch(request).then((response) => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(request, clone);
          trimCache(cacheName, maxEntries);
        });
      }
      return response;
    });
  });
}

// --- Lifecycle Events ---

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAMES.precache)
      .then((cache) => cache.addAll(PRECACHE_URLS)),
  );
});

self.addEventListener("activate", (event) => {
  const currentCaches = new Set(Object.values(CACHE_NAMES));
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter(
              (name) =>
                name.startsWith(CACHE_PREFIX) && !currentCaches.has(name),
            )
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// --- Fetch Routing ---

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Navigation requests: NetworkFirst with timeout, offline fallback
  if (request.mode === "navigate") {
    event.respondWith(
      networkFirstWithTimeout(
        request,
        CACHE_NAMES.navigations,
        NETWORK_TIMEOUT_MS,
      ),
    );
    return;
  }

  // Scripts & Styles: StaleWhileRevalidate
  if (request.destination === "script" || request.destination === "style") {
    event.respondWith(
      staleWhileRevalidate(request, CACHE_NAMES.static, MAX_ENTRIES.static),
    );
    return;
  }

  // Images: StaleWhileRevalidate
  if (request.destination === "image") {
    event.respondWith(
      staleWhileRevalidate(request, CACHE_NAMES.images, MAX_ENTRIES.images),
    );
    return;
  }

  // Fonts: CacheFirst
  if (
    request.destination === "font" ||
    /\.(?:woff2?|ttf|otf)$/.test(url.pathname)
  ) {
    event.respondWith(
      cacheFirst(request, CACHE_NAMES.fonts, MAX_ENTRIES.fonts),
    );
    return;
  }
});
