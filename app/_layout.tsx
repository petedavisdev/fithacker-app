import '@/i18n';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';
import { TheHeader } from '../features/TheHeader/TheHeader';

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
					<TheHeader />

					<View className="flex-1 items-center justify-center gap-10">
						<Slot />
					</View>
				</SafeAreaView>
			</LinearGradient>

			<StatusBar barStyle="light-content" />
		</>
	);
}
