import { View } from 'react-native';
import { Platform } from 'react-native';

export function AppStoreLink() {
	// Only show on web, not on Android
	if (Platform.OS !== 'web' || typeof window === 'undefined') {
		return null;
	}

	const ua = navigator.userAgent.toLowerCase();
	const isAndroid = ua.includes('android');

	if (isAndroid) {
		return null;
	}

	return (
		<View className="items-center">
			<a
				href="https://apps.apple.com/us/app/fithacker/id6737473687?platform=iphone"
				target="_blank"
				rel="noopener noreferrer"
			>
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
					alt="Download on the App Store"
					className="h-10"
				/>
			</a>
		</View>
	);
}

