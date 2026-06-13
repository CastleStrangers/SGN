const CACHE_NAME = "sy-nl-v2";
const STATIC_ASSETS = [
  "/",
  "/logo.png",
  "/logo.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Ignore non-GET requests and non-HTTP/HTTPS protocols
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for basic type requests
        if (response.ok && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails (offline mode)
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Only fall back to '/' for page navigation requests (HTML)
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/");
          }
          return Promise.reject("Offline");
        });
      })
  );
});
