module.exports = {
	globDirectory: 'dist/',
	globPatterns: ['**/*.{html,js,css,png,jpg,jpeg,svg,woff2,woff,ttf,json}'],
	swDest: 'dist/sw.js',

	globIgnores: ['**/*.map', '**/node_modules/**'],

	maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB

	skipWaiting: true,
	clientsClaim: true,

	runtimeCaching: [
		{
			urlPattern: ({ request }) => request.destination === 'image',
			handler: 'CacheFirst',
			options: {
				cacheName: 'images',
				expiration: {
					maxEntries: 60,
					maxAgeSeconds: 30 * 24 * 60 * 60,
				},
			},
		},
		{
			urlPattern: ({ request }) => request.destination === 'font',
			handler: 'CacheFirst',
			options: {
				cacheName: 'fonts',
				expiration: {
					maxEntries: 20,
					maxAgeSeconds: 365 * 24 * 60 * 60,
				},
			},
		},
	],
};
