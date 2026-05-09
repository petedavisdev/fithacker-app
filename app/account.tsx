import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useIsOnline } from '@/shared/queries/useNetworkStatus';
import { useAuthSession } from '@/features/Account/useAuthSession';
import { OfflineMessage } from '@/features/Account/OfflineMessage';
import { LoginForm } from '@/features/Account/LoginForm';
import { AccountInfo } from '@/features/Account/AccountInfo';
import { DownloadData } from '@/features/Download/DownloadData';
import { TheHeader } from '@/shared/components/TheHeader';
import { InstallLinks } from '@/features/Install/InstallLinks';

export default function AccountScreen() {
	const isOnline = useIsOnline();
	const { authSession } = useAuthSession();
	const loggedIn = !!authSession?.user;

	return (
		<View className="flex-1">
			<TheHeader buttonLeft="back" buttonRight="chart" />

			<KeyboardAwareScrollView
				keyboardOpeningTime={0}
				contentContainerClassName="flex-1"
			>
				<View className="flex-1 justify-center">
					{!isOnline ? (
						<OfflineMessage />
					) : !loggedIn ? (
						<LoginForm />
					) : (
						<AccountInfo />
					)}
				</View>

				<View className="w-96 self-center items-center gap-2 px-4 pb-8">
					<DownloadData />
				</View>

				<View>
					<InstallLinks />
				</View>
			</KeyboardAwareScrollView>
		</View>
	);
}
