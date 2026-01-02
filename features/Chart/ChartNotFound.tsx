import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AButton } from '@/shared/components/AButton';
import { AText } from '@/shared/components/AText';
import { TheHeader } from '@/shared/components/TheHeader';

export function ChartNotFound() {
	const { t } = useTranslation();

	return (
		<>
			<TheHeader buttonLeft="account" />
			<View className="flex-1 items-center justify-center p-4">
				<AText color="pink" size="2xl" className="font-bold text-center">
					{t('_@.userNotFound')}
				</AText>
				<View className="mt-10">
					<AButton href="/chart">👈</AButton>
				</View>
			</View>
		</>
	);
}
