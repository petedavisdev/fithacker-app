import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { AButton } from '@/shared/components/AButton';
import { TheHeader } from '@/features/TheHeader/TheHeader';

export function ChartNotFound() {
	const { t } = useTranslation();

	return (
		<>
			<TheHeader buttonLeft="account" />
			<View className="flex-1 items-center justify-center p-4">
				<Text className="font-mono text-pink-400 text-2xl font-bold text-center">
					{t('_@.userNotFound')}
				</Text>
				<View className="mt-10">
					<AButton href="/chart">👈</AButton>
				</View>
			</View>
		</>
	);
}
