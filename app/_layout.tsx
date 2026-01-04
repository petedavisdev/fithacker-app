import '@/shared/i18n';
import { i18nReady } from '@/shared/i18n';
import { useFonts } from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LinearGradient } from 'expo-linear-gradient';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import {
	Platform,
	StatusBar,
	AppState,
	type AppStateStatus,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import '../global.css';
import { runMigration } from '@/shared/supabase/migration';
import { queryKeys } from '@/shared/queries/queryKeys';
import { QueryErrorBoundary } from '@/shared/components/AErrorBoundary';
import { InitNetworkStatus } from '@/shared/init/InitNetworkStatus';
import { InitBackgroundSync } from '@/shared/init/InitBackgroundSync';
import { LogoutModal } from '@/features/Account/LogoutModal';
import { AutoInstallPrompt } from '@/features/Account/AutoInstallPrompt';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
			refetchOnReconnect: true,
			networkMode: 'always', // Default: work offline (most queries use AsyncStorage)
		},
		mutations: {
			networkMode: 'always', // Default: work offline (most mutations write to AsyncStorage first)
		},
	},
});

// Run migration once at startup (only client-side, not during SSR)
// On web with static output, this code runs in Node.js during build where window is undefined
if (Platform.OS !== 'web' || typeof window !== 'undefined') {
	runMigration()
		.then(() => {
			queryClient.invalidateQueries({ queryKey: queryKeys.pendingSync });
		})
		.catch((error) => {
			console.error('Migration failed:', error);
		});
}

// Register service worker for PWA offline support (web only)
if (Platform.OS === 'web' && typeof window !== 'undefined') {
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker
				.register('/sw.js')
				.then((registration) => {
					console.log('[SW] Registered:', registration.scope);

					registration.addEventListener('updatefound', () => {
						const newWorker = registration.installing;
						if (newWorker) {
							newWorker.addEventListener('statechange', () => {
								if (
									newWorker.state === 'installed' &&
									navigator.serviceWorker.controller
								) {
									console.log('[SW] New version available');
								}
							});
						}
					});
				})
				.catch((error) => {
					console.error('[SW] Registration failed:', error);
				});
		});
	}
}

export default function RootLayout() {
	const [fontLoaded] = useFonts({
		UbuntuMono: require('../assets/fonts/UbuntuMono-Regular.ttf'),
		UbuntuMonoBold: require('../assets/fonts/UbuntuMono-Bold.ttf'),
		UbuntuMonoItalic: require('../assets/fonts/UbuntuMono-Italic.ttf'),
		UbuntuMonoBoldItalic: require('../assets/fonts/UbuntuMono-BoldItalic.ttf'),
	});
	const [i18nLoaded, setI18nLoaded] = useState(false);

	const [day, setDay] = useState<number>(new Date().getDate());
	const gradientColor = '#112';

	useEffect(() => {
		i18nReady.then(() => {
			setI18nLoaded(true);
		});
	}, []);

	useEffect(() => {
		const eventListener = AppState.addEventListener(
			'change',
			(newAppState: AppStateStatus) => {
				const newDay = new Date().getDate();
				if (newAppState === 'active' && day !== newDay) {
					setDay(newDay);
				}
			},
		);
		return () => {
			eventListener.remove();
		};
	}, [day]);

	useEffect(() => {
		if (fontLoaded && i18nLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontLoaded, i18nLoaded]);

	if (!fontLoaded || !i18nLoaded) {
		return null;
	}

	return (
		<>
			<QueryErrorBoundary>
				<QueryClientProvider client={queryClient}>
					<QueryErrorBoundary>
						<InitNetworkStatus />
						<InitBackgroundSync />
						<LogoutModal />
						<AutoInstallPrompt />
						<LinearGradient
							colors={['black', gradientColor, gradientColor, 'black']}
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<SafeAreaView
								className={`flex-1 w-full ${
									Platform.OS === 'web' ? 'py-4' : ''
								}`}
							>
								<Slot key={day} />
							</SafeAreaView>
						</LinearGradient>
					</QueryErrorBoundary>
					{Platform.OS === 'web' && <ReactQueryDevtools />}
				</QueryClientProvider>
			</QueryErrorBoundary>

			<StatusBar barStyle="light-content" />
		</>
	);
}
