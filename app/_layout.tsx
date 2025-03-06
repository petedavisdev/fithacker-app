import '@/i18n';
import 'react-native-reanimated';
import '../global.css';

import * as SplashScreen from 'expo-splash-screen';

import { SafeAreaView, StatusBar } from 'react-native';
import { createContext, useEffect, useState } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { Slot } from 'expo-router';
import { User } from '@supabase/supabase-js';
import { supabase } from '../features/User/supabase';
import { useFonts } from 'expo-font';
import { useNewDay } from '../features/useNewDay';

export const UserContext = createContext<User | null>(null);
SplashScreen.preventAutoHideAsync();

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

	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user || null);

			console.log('session', session?.user);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			console.log('session', session?.user);
			setUser(session?.user || null);
		});
	}, []);

	if (!fontLoaded) {
		return null;
	}

	return (
		<UserContext.Provider value={user}>
			<LinearGradient
				colors={['black', '#112', '#112', 'black']}
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<SafeAreaView className="flex-1 w-full">
					<Slot key={day} />
				</SafeAreaView>
			</LinearGradient>

			<StatusBar barStyle="light-content" />
		</UserContext.Provider>
	);
}
