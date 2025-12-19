import { Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { BADGES } from '@/shared/utils/constants';

type ChartHelpProps = {
	hasMedals?: boolean;
};

export function ChartHelp(props: ChartHelpProps) {
	const { t } = useTranslation();

	return (
		<View className="flex items-start gap-5">
			<View className="flex-row items-center gap-2">
				<Text className="text-yellow-500 text-5xl">{BADGES[1]}</Text>
				<Text className="text-pink-400">
					= {t('_chart.medalDescription')}
				</Text>
			</View>

			{(props.hasMedals ?? false) && (
				<View className="flex-row items-center gap-2">
					<Text className="text-yellow-500 text-5xl">{BADGES[2]}</Text>
					<Text className="text-pink-400">
						= {t('_chart.trophyDescription')}
					</Text>
				</View>
			)}
		</View>
	);
}

