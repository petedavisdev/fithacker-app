import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { AText } from '@/shared/components/AText';
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
				<Pressable
					onPress={() => {
						setIsDeleteModalOpen(true);
					}}
				>
					<AText color="pink" size="sm" className="underline">
						❌ {t('_account.deleteCloudBackup')}
					</AText>
				</Pressable>

				<Pressable
					onPress={() => {
						logout();
					}}
					disabled={isLoggingOut}
				>
					<View
						className={`px-4 py-2 items-center justify-center border-2 border-pink-500 rounded-full ${
							isLoggingOut ? 'opacity-35' : ''
						}`}
						style={{
							shadowColor: '#ec4899',
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.25,
							shadowRadius: 3.84,
							elevation: 5,
						}}
					>
						<AText color="pink" size="sm" className="text-balance text-center">
							{isLoggingOut ? '⏳' : '🚪'} {t('_auth.signOut')}
						</AText>
					</View>
				</Pressable>
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
