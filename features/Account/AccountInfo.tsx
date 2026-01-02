import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { AText } from '@/shared/components/AText';
import { useLogout } from './useLogout';
import { useAuthSession } from './useAuthSession';
import { useBackgroundSync } from '@/shared/queries/useBackgroundSync';
import { usePendingSync } from '@/shared/queries/usePendingSync';
import { useUserProfile } from './useUserProfile';
import { ProfileInfo } from './ProfileInfo';
import { ProfileSetup } from './ProfileSetup';
import { DeleteAccountModal } from './DeleteAccountModal';

export function AccountInfo() {
	const { t } = useTranslation();
	const { logout, isLoggingOut } = useLogout();
	const { authSession } = useAuthSession();
	const { isBackgroundSyncFetching } = useBackgroundSync();
	const { pendingSync } = usePendingSync();
	const { userProfile } = useUserProfile();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const userEmail = authSession?.user?.email ?? null;
	const pendingCount = Object.keys(pendingSync ?? {}).length;

	return (
		<View className="flex-1 items-center p-4">
			<View className="w-full items-center pt-8 mb-8">
				<AText size="2xl" className="font-bold text-center">
					{t('_@.loggedInAs', { email: userEmail })}
				</AText>

				<AText className="mt-4 text-center">{t('_@.backupDescription')}</AText>

				<AText color="yellow" className="mt-4 text-center">
					{isBackgroundSyncFetching && pendingCount > 0
						? t('_@.daysSyncingNow', { count: pendingCount })
						: !isBackgroundSyncFetching && pendingCount === 0
							? t('_@.syncComplete')
							: t('_@.daysWaitingSync', { count: pendingCount })}
				</AText>
			</View>

			<View className="flex-1 w-full items-center justify-center">
				{!userProfile ? <ProfileSetup /> : <ProfileInfo />}
			</View>

			<View className="mt-10 items-center pb-8 gap-4">
				<Pressable
					onPress={() => {
						setIsDeleteModalOpen(true);
					}}
				>
					<AText color="pink" size="sm" className="underline">
						❌ {t('_@.deleteCloudBackup')}
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
							{isLoggingOut ? '⏳' : '🚪'} {t('_@.signOut')}
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
