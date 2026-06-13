const CACHE_NAME = "sy-nl-v1";
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
  // Ignore non-GET requests and non-HTTP/HTTPS protocols (like chrome-extension://)
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response.ok && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          if (cached) return cached;
          // Only fall back to '/' for page navigation requests (HTML) to avoid CSS/JS MIME type errors
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/");
          }
          return Promise.reject("Network error");
        });

      return cached || fetchPromise;
    })
  );
});
