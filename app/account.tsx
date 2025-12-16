import { useIsOnline } from '@/shared/useNetworkStatus';
import { useAuthSession } from '@/features/Account/useAuthSession';
import { usePendingSync } from '@/shared/usePendingSync';
import { useBackgroundSync } from '@/shared/useBackgroundSync';
import { OfflineMessage } from '@/features/Account/OfflineMessage';
import { LoginForm } from '@/features/Account/LoginForm';
import { AccountInfo } from '@/features/Account/AccountInfo';

export default function AccountScreen() {
	const isOnline = useIsOnline();
	useBackgroundSync(); // background sync when logged-in + online

	const { authSession } = useAuthSession();
	const loggedIn = !!authSession?.user;
	const userEmail = authSession?.user?.email ?? null;
	const { pendingSync } = usePendingSync();

	const pendingCount = Object.keys(pendingSync ?? {}).length;

	if (!isOnline) {
		return <OfflineMessage loggedIn={loggedIn} />;
	}

	if (!loggedIn) {
		return <LoginForm />;
	}

	return (
		<AccountInfo
			userEmail={userEmail}
			pendingCount={pendingCount}
			isOnline={isOnline}
		/>
	);
}
