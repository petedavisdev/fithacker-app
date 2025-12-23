module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{html,js,css,png,jpg,jpeg,svg,woff2,woff,ttf,json}',
	],
	swSrc: 'public/sw-template.js',
	swDest: 'dist/sw.js',

	globIgnores: [
		'**/*.map',
		'**/node_modules/**',
	],

	maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB
};

