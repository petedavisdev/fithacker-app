import { Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

export function ChartHelp() {
	const { t } = useTranslation();

	return (
		<View className="flex items-start gap-5">
			<View className="flex-row items-center gap-2">
				<Text className="text-yellow-500 text-5xl">🏅</Text>
				<Text className="text-pink-400">
					= {t('_chart.medalDescription')}
				</Text>
			</View>

			<View className="flex-row items-center gap-2">
				<Text className="text-yellow-500 text-5xl">🏆</Text>
				<Text className="text-pink-400">
					= {t('_chart.trophyDescription')}
				</Text>
			</View>
		</View>
	);
}

