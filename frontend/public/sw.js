const SHARE_KEY = '/pending-share';

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Intercept share target POST — store file, redirect to app
  if (e.request.method === 'POST' && url.pathname === '/share') {
    e.respondWith(
      (async () => {
        const fd = await e.request.formData();
        const file = fd.get('file');
        if (file) {
          const cache = await caches.open('shared-files');
          await cache.put(SHARE_KEY, new Response(file));
        }
        return Response.redirect('/?shared=1', 303);
      })()
    );
    return;
  }

  // Serve the stored shared file
  if (url.pathname === SHARE_KEY) {
    e.respondWith(
      (async () => {
        const cache = await caches.open('shared-files');
        const cached = await cache.match(SHARE_KEY);
        return cached || new Response(null, { status: 404 });
      })()
    );
  }
});
