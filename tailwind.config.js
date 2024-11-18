/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./App.{js,jsx,ts,tsx}',
		'./app/**/*.{js,jsx,ts,tsx}', // Include all JS, JSX, TS, and TSX files in the app folder
		'./features/**/*.{js,jsx,ts,tsx}', // Include all JS, JSX, TS, and TSX files in the components folder]
	],
	presets: [require('nativewind/preset')],
	theme: {
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
