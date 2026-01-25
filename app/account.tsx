import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useIsOnline } from '@/shared/queries/useNetworkStatus';
import { useAuthSession } from '@/features/Account/useAuthSession';
import { OfflineMessage } from '@/features/Account/OfflineMessage';
import { LoginForm } from '@/features/Account/LoginForm';
import { AccountInfo } from '@/features/Account/AccountInfo';
import { DownloadData } from '@/features/Download/DownloadData';
import { UploadData } from '@/features/Upload/UploadData';
import { TheHeader } from '@/shared/components/TheHeader';
import { InstallLinks } from '@/features/Install/InstallLinks';

export default function AccountScreen() {
	const isOnline = useIsOnline();
	const { authSession } = useAuthSession();
	const loggedIn = !!authSession?.user;

	return (
		<View className="flex-1">
			<TheHeader buttonLeft="back" buttonRight="chart" />

			<View className="gap-6">
				<View>
					<KeyboardAwareScrollView
						keyboardOpeningTime={0}
						className="flex-1"
						contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
					>
						{!isOnline ? (
							<OfflineMessage />
						) : !loggedIn ? (
							<LoginForm />
						) : (
							<AccountInfo />
						)}
					</KeyboardAwareScrollView>
				</View>

				<View className="w-96 self-center items-center gap-2 px-4 py-8">
					<DownloadData />
					<UploadData />
				</View>

				<View>
					<InstallLinks />
				</View>
			</View>
		</View>
	);
}
