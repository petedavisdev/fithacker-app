import 'dotenv/config';

const APP_VARIANTS = [
	{
		env: 'development',
		id: 'dev.petedavis.fithacker.development',
		name: 'Fithacker (dev)',
	},
	{
		env: 'preview',
		id: 'dev.petedavis.fithacker.preview',
		name: 'Fithacker (preview)',
	},
	{
		env: 'production',
		id: 'dev.petedavis.fithacker',
		name: 'Fithacker',
	},
];

const variant = APP_VARIANTS.find(
	(variant) => variant.env === process.env.APP_VARIANT,
);
const bundleIdentifier = variant?.id;
const name = variant?.name;

export default {
	expo: {
		name: name || 'Fithacker',
		slug: 'fithacker-app',
		version: '1.1.0',
		orientation: 'portrait',
		icon: './assets/images/icon.png',
		newArchEnabled: true,
		scheme: 'fithacker',
		userInterfaceStyle: 'automatic',
		updates: {
			url: 'https://u.expo.dev/6c3e19dc-162f-45b6-98f4-716ce558cd0e',
		},
		runtimeVersion: {
			policy: 'appVersion',
		},
		splash: {
			image: './assets/images/splash.png',
			resizeMode: 'contain',
			backgroundColor: '#111122',
		},
		ios: {
			supportsTablet: true,
			bundleIdentifier: bundleIdentifier || 'dev.petedavis.fithacker',
			associatedDomains: ['applinks:fithacker.app'],
			infoPlist: {
				CFBundleAllowMixedLocalizations: true,
				CFBundleLocalizations: [
					'de',
					'en',
					'es',
					'es-ES',
					'es-MX',
					'fr',
					'fr-CA',
					'fr-FR',
					'it',
					'ja',
					'ko',
					'pt',
					'pt-BR',
					'pt-PT',
					'zh',
					'zh-CN',
				],
				CFBundleDevelopmentRegion: 'en',
			},
		},
		android: {
			adaptiveIcon: {
				foregroundImage: './assets/images/adaptive-icon.png',
				backgroundColor: '#111122',
			},
			package: bundleIdentifier || 'dev.petedavis.fithacker',
			intentFilters: [
				{
					action: 'VIEW',
					autoVerify: true,
					data: [
						{
							scheme: 'https',
							host: 'fithacker.app',
							pathPrefix: '/chart',
						},
					],
					category: ['BROWSABLE', 'DEFAULT'],
				},
			],
		},
		web: {
			bundler: 'metro',
			output: 'static',
			favicon: './assets/images/favicon.png',
			// PWA fields (Expo auto-generates manifest.json):
			name: 'Fithacker',
			shortName: 'Fithacker',
			description: 'Simple, emoji-based exercise logging',
			themeColor: '#111122',
			backgroundColor: '#111122',
			display: 'standalone',
			orientation: 'portrait',
			startUrl: '/',
			scope: '/',
		},
		plugins: [
			'expo-router',
			'expo-localization',
			'expo-font',
			'expo-web-browser',
		],
		experiments: {
			typedRoutes: true,
		},
		extra: {
			eas: {
				projectId: '6c3e19dc-162f-45b6-98f4-716ce558cd0e',
			},
			supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
			supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
			appleReviewEmail: process.env.EXPO_PUBLIC_APPLE_REVIEW_EMAIL,
		},
	},
};
