import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useIsOnline } from '@/shared/queries/useNetworkStatus';
import { useAuthSession } from '@/features/Account/useAuthSession';
import { OfflineMessage } from '@/features/Account/OfflineMessage';
import { LoginForm } from '@/features/Account/LoginForm';
import { AccountInfo } from '@/features/Account/AccountInfo';
import { TheHeader } from '@/shared/components/TheHeader';
import { InstallLinks } from '@/features/Account/InstallLinks';

export default function AccountScreen() {
	const isOnline = useIsOnline();
	const { authSession } = useAuthSession();
	const loggedIn = !!authSession?.user;

	return (
		<View className="flex-1">
			<TheHeader buttonLeft="back" buttonRight="chart" />

			<KeyboardAwareScrollView keyboardOpeningTime={0} className="flex-1">
				{!isOnline ? (
					<OfflineMessage />
				) : !loggedIn ? (
					<LoginForm />
				) : (
					<AccountInfo />
				)}
			</KeyboardAwareScrollView>

			<InstallLinks />
		</View>
	);
}
