import '../global.css';
import '@/i18n';
import { useFonts } from 'expo-font';
import { Link, Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontLoaded] = useFonts({
		UbuntuMono: require('../assets/fonts/UbuntuMono-Regular.ttf'),
		UbuntuMonoBold: require('../assets/fonts/UbuntuMono-Bold.ttf'),
		UbuntuMonoItalic: require('../assets/fonts/UbuntuMono-Italic.ttf'),
		UbuntuMonoBoldItalic: require('../assets/fonts/UbuntuMono-BoldItalic.ttf'),
	});

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
			<LinearGradient
				colors={['black', '#112', '#112', 'black']}
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<SafeAreaView className="flex-1 w-full">
					<View className="w-full flex-row justify-between p-4">
						<Link href="/chart" className="flex-row">
							<Text className="font-mono text-lg text-yellow-500">
								FIT
							</Text>
							<Text className="font-mono text-lg text-cyan-500">
								HACKER
							</Text>
						</Link>

						{/* <Link href="/account">
							<View className="w-12 h-12 flex items-center justify-center border-2 border-yellow-500 rounded-full shadow shadow-yellow-500">
								<Text className="text-2xl">👋</Text>
							</View>
						</Link> */}
					</View>

					<View className="flex-1 items-center justify-center gap-10">
						<Slot />
					</View>
				</SafeAreaView>
			</LinearGradient>
			<StatusBar barStyle="light-content" />
		</>
	);
}
