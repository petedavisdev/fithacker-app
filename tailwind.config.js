/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./App.{js,jsx,ts,tsx}',
		'./app/**/*.{js,jsx,ts,tsx}', // Include all JS, JSX, TS, and TSX files in the app folder
		'./features/**/*.{js,jsx,ts,tsx}', // Include all JS, JSX, TS, and TSX files in the components folder]
	],
	presets: [require('nativewind/preset')],
	theme: {
		colors: {
			// Only these colors are allowed - enforces strict palette
			transparent: 'transparent',
			current: 'currentColor',
			black: '#000',
			white: '#fff', // App Store badge text (web-only)
			// App background
			bg: '#112',
			// Yellow: Weekends, completed state, default buttons, inputs (unfocused), "FIT" branding
			yellow: {
				400: '#facc15', // Input text (default state)
				500: '#eab308', // Weekend text, checked items, input borders (default)
				600: '#ca8a04', // Default button borders
				700: '#a16207', // Shadows, underlines
			},
			// Cyan: Weekdays, incomplete state, "HACKER" branding
			cyan: {
				300: '#67e8f9', // Secondary text
				400: '#22d3ee', // Active text, unchecked items
				500: '#06b6d4', // Weekday text, borders
				600: '#0891b2',
				700: '#0e7490', // Shadows, underlines
			},
			// Pink: Today, priority indicators, help/attention, ALL focus states
			pink: {
				400: '#f472b6', // Help text, input placeholder, focus text (all inputs)
				500: '#ec4899', // Today text, priority badges, active filters, focus borders (all inputs)
				600: '#db2777', // Today borders
				700: '#be185d', // Shadows
			},
			// Slate: Tomorrow, future dates, disabled/inactive states
			slate: {
				400: '#94a3b8', // Tomorrow text, disabled items
				500: '#64748b', // Future text, input placeholders
				600: '#475569', // Tomorrow borders
				700: '#334155', // Tomorrow shadows
				800: '#1e293b', // Inactive filters
			},
		},
		extend: {
			fontFamily: {
				mono: ['UbuntuMono'],
				sans: ['UbuntuMono'],
				serif: ['UbuntuMono'],
			},
		},
	},
	plugins: [],
};
