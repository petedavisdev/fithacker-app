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
	(variant) => variant.env === process.env.APP_VARIANT
);
const bundleIdentifier = variant?.id;
const name = variant?.name;

export default {
	expo: {
		name: name || 'Fithacker',
		slug: 'fithacker-app',
		version: '1.0.1',
		orientation: 'portrait',
		icon: './assets/images/icon.png',
		newArchEnabled: true,
		scheme: 'myapp',
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
		},
		web: {
			bundler: 'metro',
			output: 'static',
			favicon: './assets/images/favicon.png',
		},
		plugins: ['expo-router', 'expo-localization', 'expo-font'],
		experiments: {
			typedRoutes: true,
		},
		extra: {
			eas: {
				projectId: '6c3e19dc-162f-45b6-98f4-716ce558cd0e',
			},
		},
	},
};
