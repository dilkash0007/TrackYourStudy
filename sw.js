// Service Worker for TrackYouStudy PWA

const CACHE_NAME = 'trackyoustudy-v1';
const BASE_URL = '/TrackYourStudy/';
const urlsToCache = [
  BASE_URL,
  BASE_URL + 'index.html',
  BASE_URL + 'manifest.json',
  BASE_URL + 'avatar_1.jpeg'
];

// Helper to check if a URL is part of our app
const isAppUrl = (url) => {
  const parsedUrl = new URL(url);
  // Don't cache chrome-extension:// URLs
  if (parsedUrl.protocol === 'chrome-extension:') {
    return false;
  }
  
  // Check if it's our domain (localhost during development)
  if (parsedUrl.hostname === location.hostname) {
    return true;
  }
  
  return false;
};

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension:// and other non-app URLs
  if (!isAppUrl(event.request.url)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request for the fetch call
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Add to cache for future use if it's an app resource
            if (isAppUrl(event.request.url)) {
              try {
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    try {
                      cache.put(event.request, responseToCache);
                    } catch (error) {
                      console.log('Failed to cache resource:', error);
                    }
                  })
                  .catch(error => {
                    console.log('Failed to open cache:', error);
                  });
              } catch (error) {
                console.log('Caching error:', error);
              }
            }

            return response;
          }
        ).catch(error => {
          console.log('Fetch error:', error);
          // Optionally return a fallback response here
        });
      })
  );
}); 