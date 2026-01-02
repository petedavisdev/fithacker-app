import { View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { AText } from '@/shared/components/AText';
import { BADGES } from '@/shared/utils/constants';

export function BadgesHelp() {
	const { t } = useTranslation();

	return (
		<View className="flex items-start gap-5">
			<View className="flex-row items-center gap-2">
				<AText size="5xl">{BADGES[1]}</AText>
				<AText color="pink">= {t('_chart.medalDescription')}</AText>
			</View>

			<View className="flex-row items-center gap-2">
				<AText size="5xl">{BADGES[2]}</AText>
				<AText color="pink">= {t('_chart.trophyDescription')}</AText>
			</View>
		</View>
	);
}
