import { Text, View } from 'react-native';
import { TheHeader } from '@/features/TheHeader/TheHeader';

type OfflineMessageProps = {
	loggedIn: boolean;
};

export function OfflineMessage({ loggedIn }: OfflineMessageProps) {
	return (
		<>
			<TheHeader buttonLeft="account" />
			<View className="flex-1 items-center justify-center p-4">
				<Text className="font-mono text-cyan-400 text-2xl font-bold text-center">
					You are offline
				</Text>
				<Text className="font-mono text-cyan-400 mt-4 text-center">
					{loggedIn
						? 'No problem! Your data will sync automatically when you are online again.'
						: 'No problem! When you are online, login to backup and sync your data.'}
				</Text>
			</View>
		</>
	);
}

