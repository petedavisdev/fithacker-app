import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AText } from '@/shared/components/AText';
import { AButton } from '@/shared/components/AButton';
import { useLogout } from './useLogout';
import { useAuthSession } from './useAuthSession';
import { useBackgroundSync } from '@/shared/queries/useBackgroundSync';
import { usePendingSync } from '@/shared/queries/usePendingSync';
import { DeleteAccountModal } from './DeleteAccountModal';

export function AccountInfo() {
	const { t } = useTranslation();
	const { logout, isLoggingOut } = useLogout();
	const { authSession } = useAuthSession();
	const { isBackgroundSyncFetching } = useBackgroundSync();
	const { pendingSync } = usePendingSync();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const userEmail = authSession?.user?.email ?? null;
	const pendingCount = Object.keys(pendingSync ?? {}).length;

	return (
		<View className="flex-1 items-center p-4">
			<View className="w-full items-center pt-8 mb-8">
				<AText size="2xl" className="font-bold text-center">
					{t('_auth.loggedInAs', { email: userEmail })}
				</AText>

				<AText className="mt-4 text-center">
					{t('_account.backupDescription')}
				</AText>

				<AText color="yellow" className="mt-4 text-center">
					{isBackgroundSyncFetching && pendingCount > 0
						? t('_account.daysSyncingNow', { count: pendingCount })
						: !isBackgroundSyncFetching && pendingCount === 0
							? t('_account.syncComplete')
							: t('_account.daysWaitingSync', { count: pendingCount })}
				</AText>
			</View>

			<View className="mt-10 items-center pb-8 gap-4">
				<AButton
					color="pink"
					onPress={() => {
						logout();
					}}
					isDisabled={isLoggingOut}
				>
					{isLoggingOut ? '⏳' : '🚪'} {t('_auth.signOut')}
				</AButton>

				<AButton
					color="pink"
					onPress={() => {
						setIsDeleteModalOpen(true);
					}}
				>
					❌ {t('_account.deleteCloudBackup')}
				</AButton>
			</View>

			<DeleteAccountModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
				}}
			/>
		</View>
	);
}
