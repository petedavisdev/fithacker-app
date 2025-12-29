import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { AModal } from '@/shared/components/AModal';
import { useLogoutDetection } from './useLogoutDetection';

export function LogoutModal() {
	const { t } = useTranslation();
	const { wasLoggedOut, dismissLogout } = useLogoutDetection();

	return (
		<AModal isOpen={wasLoggedOut} onClose={dismissLogout}>
			<View className="flex gap-6 items-center">
				<Text className="font-mono text-cyan-400 text-xl text-center">
					{t('_@.loggedOut')}
				</Text>
			</View>
		</AModal>
	);
}

