import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { AButton } from '@/shared/components/AButton';
import { TheHeader } from '@/features/TheHeader/TheHeader';
import { useLogout } from './useLogout';
import { useAuthSession } from './useAuthSession';
import { useBackgroundSync } from '@/shared/queries/useBackgroundSync';
import { usePendingSync } from '@/shared/queries/usePendingSync';

export function AccountInfo() {
	const { t } = useTranslation();
	const { logout } = useLogout();
	const { authSession } = useAuthSession();
	const { isBackgroundSyncFetching } = useBackgroundSync();
	const { pendingSync } = usePendingSync();

	const userEmail = authSession?.user?.email ?? null;
	const pendingCount = Object.keys(pendingSync ?? {}).length;

	return (
		<>
			<TheHeader buttonLeft="account" />
			<View className="flex-1 items-center justify-center p-4">
				<Text className="font-mono text-cyan-400 text-2xl font-bold text-center">
					{t('_@.loggedInAs', { email: userEmail })}
				</Text>

				<Text className="font-mono text-cyan-400 mt-4 text-center">
					{t('_@.backupDescription')}
				</Text>

				<Text className="font-mono text-yellow-400 mt-8 text-center">
					{isBackgroundSyncFetching && pendingCount > 0
						? t('_@.daysSyncingNow', { count: pendingCount })
						: !isBackgroundSyncFetching && pendingCount === 0
							? t('_@.syncComplete')
							: t('_@.daysWaitingSync', { count: pendingCount })}
				</Text>

				<View className="flex-row justify-center items-center px-4 mt-10">
					<AButton href="/chart">👍</AButton>
				</View>

				<View className="mt-10 items-center">
					<Pressable
						onPress={() => {
							logout();
						}}
					>
						<View className="px-4 py-2 items-center justify-center border-2 border-pink-500 rounded-full shadow shadow-pink-500">
							<Text className="text-sm text-pink-400 font-mono text-balance text-center">
								🚪 {t('_@.signOut')}
							</Text>
						</View>
					</Pressable>
				</View>
			</View>
		</>
	);
}
