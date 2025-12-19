import '@/shared/i18n';
import { useFonts } from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LinearGradient } from 'expo-linear-gradient';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Platform, SafeAreaView, StatusBar, AppState, type AppStateStatus } from 'react-native';
import 'react-native-reanimated';
import '../global.css';
import { runMigration } from '@/shared/supabase/migration';
import { queryKeys } from '@/shared/queries/queryKeys';
import { QueryErrorBoundary } from '@/shared/components/AErrorBoundary';
import { useBackgroundSync } from '@/shared/queries/useBackgroundSync';

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

// Background sync hook - must be inside QueryClientProvider
// Syncs on app open, foreground, and when navigating with pending changes
function InitBackgroundSync() {
	useBackgroundSync();
	return null;
}

export default function RootLayout() {
	const [fontLoaded] = useFonts({
		UbuntuMono: require('../assets/fonts/UbuntuMono-Regular.ttf'),
		UbuntuMonoBold: require('../assets/fonts/UbuntuMono-Bold.ttf'),
		UbuntuMonoItalic: require('../assets/fonts/UbuntuMono-Italic.ttf'),
		UbuntuMonoBoldItalic: require('../assets/fonts/UbuntuMono-BoldItalic.ttf'),
	});

	const [day, setDay] = useState<number>(new Date().getDate());

	useEffect(() => {
		const eventListener = AppState.addEventListener('change', (newAppState: AppStateStatus) => {
			const newDay = new Date().getDate();
			if (newAppState === 'active' && day !== newDay) {
				setDay(newDay);
			}
		});
		return () => {
			eventListener.remove();
		};
	}, [day]);

	useEffect(() => {
		if (fontLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontLoaded]);

	if (!fontLoaded) {
		return null;
	}

	return (
		<>
			<QueryErrorBoundary>
				<QueryClientProvider client={queryClient}>
					<QueryErrorBoundary>
						<InitBackgroundSync />
						<LinearGradient
							colors={['black', '#112', '#112', 'black']}
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<SafeAreaView
								className={`flex-1 w-full ${
									Platform.OS === 'web' ? 'p-4' : ''
								}`}
							>
								<Slot key={day} />
							</SafeAreaView>
						</LinearGradient>
					</QueryErrorBoundary>
					<ReactQueryDevtools />
				</QueryClientProvider>
			</QueryErrorBoundary>

			<StatusBar barStyle="light-content" />
		</>
	);
}
