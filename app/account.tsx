import { useIsOnline } from '@/shared/queries/useNetworkStatus';
import { useAuthSession } from '@/features/Account/useAuthSession';
import { OfflineMessage } from '@/features/Account/OfflineMessage';
import { LoginForm } from '@/features/Account/LoginForm';
import { AccountInfo } from '@/features/Account/AccountInfo';
import { useUserProfile } from '@/features/Account/useUserProfile';
import { TheHeader } from '@/features/TheHeader/TheHeader';

export default function AccountScreen() {
	const isOnline = useIsOnline();
	const { authSession } = useAuthSession();
	const { isLoadingUserProfile } = useUserProfile();
	const loggedIn = !!authSession?.user;

	if (!isOnline) {
		return (
			<>
				<TheHeader buttonLeft="account" />
				<OfflineMessage />
			</>
		);
	}

	if (!loggedIn) {
		return (
			<>
				<TheHeader buttonLeft="account" />
				<LoginForm />
			</>
		);
	}

	if (isLoadingUserProfile) {
		return null;
	}

	return (
		<>
			<TheHeader buttonLeft="account" />
			<AccountInfo />
		</>
	);
}
