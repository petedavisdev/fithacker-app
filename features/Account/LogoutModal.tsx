import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AModal } from '@/shared/components/AModal';
import { AText } from '@/shared/components/AText';
import { useLogoutDetection } from './useLogoutDetection';

export function LogoutModal() {
	const { t } = useTranslation();
	const { wasLoggedOut, dismissLogout } = useLogoutDetection();

	return (
		<AModal isOpen={wasLoggedOut} onClose={dismissLogout}>
			<View className="flex gap-6 items-center">
				<AText size="xl" className="text-center">
					{t('_auth.loggedOut')}
				</AText>
			</View>
		</AModal>
	);
}
