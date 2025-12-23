import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Precache all static assets
precacheAndRoute(self.__WB_MANIFEST);

// Runtime caching strategies
// Supabase API - Network First
registerRoute(
	({ url }) => url.origin.includes('.supabase.co'),
	new NetworkFirst({
		cacheName: 'supabase-api',
		networkTimeoutSeconds: 10,
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200],
			}),
			new ExpirationPlugin({
				maxEntries: 50,
				maxAgeSeconds: 5 * 60, // 5 minutes
			}),
		],
	}),
);

// Images - Cache First
registerRoute(
	({ request }) => request.destination === 'image',
	new CacheFirst({
		cacheName: 'images',
		plugins: [
			new ExpirationPlugin({
				maxEntries: 60,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
			}),
		],
	}),
);

// Fonts - Cache First
registerRoute(
	({ request }) => request.destination === 'font',
	new CacheFirst({
		cacheName: 'fonts',
		plugins: [
			new ExpirationPlugin({
				maxEntries: 20,
				maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
			}),
		],
	}),
);

self.addEventListener('install', (event) => {
	console.log('[SW] Installing...');
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	console.log('[SW] Activating...');
	event.waitUntil(self.clients.claim());
});

