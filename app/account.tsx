import { useIsOnline } from '@/shared/queries/useNetworkStatus';
import { useAuthSession } from '@/features/Account/useAuthSession';
import { OfflineMessage } from '@/features/Account/OfflineMessage';
import { LoginForm } from '@/features/Account/LoginForm';
import { AccountInfo } from '@/features/Account/AccountInfo';

export default function AccountScreen() {
	const isOnline = useIsOnline();
	const { authSession } = useAuthSession();
	const loggedIn = !!authSession?.user;

	if (!isOnline) {
		return <OfflineMessage />;
	}

	if (!loggedIn) {
		return <LoginForm />;
	}

	return <AccountInfo />;
}
