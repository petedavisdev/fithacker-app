import { Pressable, Text, View } from 'react-native';
import { AButton } from '@/shared/Atoms/AButton';
import { TheHeader } from '@/features/TheHeader/TheHeader';
import { useLogout } from './useLogout';

type AccountInfoProps = {
	userEmail: string | null;
	pendingCount: number;
	isOnline: boolean;
};

export function AccountInfo({
	userEmail,
	pendingCount,
	isOnline,
}: AccountInfoProps) {
	const logoutMutation = useLogout();

	return (
		<>
			<TheHeader buttonLeft="account" />
			<View className="flex-1 items-center justify-center p-4">
				<Text className="font-mono text-cyan-400 text-2xl font-bold text-center">
					Logged in as {userEmail}
				</Text>
				<Text className="font-mono text-cyan-400 mt-2 text-center">
					Your exercise log is safely backed-up and synced across all your
					devices
				</Text>
				{pendingCount > 0 && (
					<Text className="font-mono text-yellow-400 mt-2 text-center">
						{pendingCount} days waiting to sync
					</Text>
				)}

				{!isOnline && (
					<Text className="font-mono text-cyan-400 mt-4 text-center">
						You are offline. Sync will resume when you're back online.
					</Text>
				)}

				<View className="flex-row justify-center items-center px-4 mt-10">
					<AButton href="/chart">👍</AButton>
				</View>

				<View className="mt-10 items-center">
					<Pressable
						onPress={() => {
							logoutMutation.mutate();
						}}
					>
						<View className="min-h-20 max-w-60 p-6 items-center justify-center border-2 border-pink-500 rounded-full shadow shadow-pink-500">
							<Text className="text-lg text-pink-400 font-mono text-balance text-center">
								Sign Out
							</Text>
						</View>
					</Pressable>
				</View>
			</View>
		</>
	);
}

