import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AText } from '@/shared/components/AText';
import { useAuthSession } from './useAuthSession';

export function OfflineMessage() {
	const { t } = useTranslation();
	const { authSession } = useAuthSession();
	const loggedIn = !!authSession?.user;

	return (
		<View className="flex-1 items-center justify-center p-4">
			<AText size="2xl" className="font-bold text-center">
				{t('_@.offlineTitle')}
			</AText>
			<AText className="mt-4 text-center">
				{loggedIn ? t('_@.offlineLoggedIn') : t('_@.offlineLoggedOut')}
			</AText>
		</View>
	);
}
