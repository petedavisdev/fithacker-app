import '@/shared/i18n';
import { useFonts } from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LinearGradient } from 'expo-linear-gradient';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, SafeAreaView, StatusBar } from 'react-native';
import 'react-native-reanimated';
import { useNewDay } from '@/shared/useNewDay';
import '../global.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hasPendingSyncKey } from '@/shared/supabase/syncState';
import { queryKeys } from '@/shared/queryKeys';
import { QueryErrorBoundary } from '@/shared/Atoms/AErrorBoundary';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
			refetchOnReconnect: true,
			retry: 1,
		},
	},
});

// Run migration once at startup (only client-side, not during SSR)
// On web with static output, this code runs in Node.js during build where window is undefined
if (Platform.OS !== 'web' || typeof window !== 'undefined') {
	hasPendingSyncKey()
		.then(async (hasKey) => {
			if (hasKey) return;

			const logStr = await AsyncStorage.getItem('exerciseLog');
			const now = new Date().toISOString();

			if (logStr) {
				const log = JSON.parse(logStr) as Record<string, unknown>;
				const pending = Object.keys(log).reduce<Record<string, string>>(
					(acc, date) => {
						acc[date] = now;
						return acc;
					},
					{},
				);
				await AsyncStorage.setItem(
					'exerciseLogPendingSync',
					JSON.stringify(pending),
				);
			} else {
				await AsyncStorage.setItem('exerciseLogPendingSync', '{}');
			}

			queryClient.invalidateQueries({ queryKey: queryKeys.pendingSync });
		})
		.catch((error) => {
			console.error('Migration failed:', error);
		});
}

export default function RootLayout() {
	const [fontLoaded] = useFonts({
		UbuntuMono: require('../assets/fonts/UbuntuMono-Regular.ttf'),
		UbuntuMonoBold: require('../assets/fonts/UbuntuMono-Bold.ttf'),
		UbuntuMonoItalic: require('../assets/fonts/UbuntuMono-Italic.ttf'),
		UbuntuMonoBoldItalic: require('../assets/fonts/UbuntuMono-BoldItalic.ttf'),
	});

	const day = useNewDay();

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
