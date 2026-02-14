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
	LogBox,
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
import { AutoInstallPrompt } from '@/features/Install/AutoInstallPrompt';
import * as Linking from 'expo-linking';
import { seedScreenshotData } from '@/shared/utils/seedScreenshotData';

// Suppress non-actionable warnings from RN internals
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

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

	// Handle deep links for screenshot seeding
	useEffect(() => {
		const handleDeepLink = async (url: string) => {
			const parsed = Linking.parse(url);
			// Handle fithacker://seed deep link
			if (
				parsed.scheme === 'fithacker' &&
				(parsed.hostname === 'seed' || parsed.path === '/seed')
			) {
				try {
					await seedScreenshotData();
					// Invalidate queries to refresh UI
					queryClient.invalidateQueries({ queryKey: queryKeys.exerciseLog });
					queryClient.invalidateQueries({ queryKey: queryKeys.pendingSync });
				} catch (error) {
					console.error('[Screenshot] Failed to seed data:', error);
				}
			}
		};

		// Handle initial URL (if app was opened via deep link)
		Linking.getInitialURL().then((url) => {
			if (url) {
				handleDeepLink(url);
			}
		});

		// Listen for deep links while app is running
		const subscription = Linking.addEventListener('url', (event) => {
			handleDeepLink(event.url);
		});

		return () => {
			subscription.remove();
		};
	}, []);

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
