import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { TheHeader } from '@/features/TheHeader/TheHeader';
import { useAuthSession } from './useAuthSession';

export function OfflineMessage() {
	const { t } = useTranslation();
	const { authSession } = useAuthSession();
	const loggedIn = !!authSession?.user;

	return (
		<>
			<TheHeader buttonLeft="account" />
			<View className="flex-1 items-center justify-center p-4">
				<Text className="font-mono text-cyan-400 text-2xl font-bold text-center">
					{t('_@.offlineTitle')}
				</Text>
				<Text className="font-mono text-cyan-400 mt-4 text-center">
					{loggedIn
						? t('_@.offlineLoggedIn')
						: t('_@.offlineLoggedOut')}
				</Text>
			</View>
		</>
	);
}

