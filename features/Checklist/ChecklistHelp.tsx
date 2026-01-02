import { View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { AText } from '@/shared/components/AText';

export function ChecklistHelp() {
	const { t } = useTranslation();

	const dot = (
		<View className="w-4 h-4 bg-pink-500 rounded-full border-2 border-black" />
	);

	return (
		<View className="flex items-center gap-5 ">
			<View
				className="w-12 h-12 justify-center items-center rounded-lg border-2 bg-black relative border-cyan-500"
				style={{
					shadowColor: '#0e7490',
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.25,
					shadowRadius: 3.84,
					elevation: 5,
				}}
			>
				<AText>2</AText>
				<View className="absolute -top-1 -right-1">{dot}</View>
			</View>

			<View className="flex items-start gap-5">
				<AText>
					<AText className="mx-1">2</AText> = {t('_?.daysSince')}
				</AText>

				<View className="flex-row items-center">
					{dot}
					<AText color="pink"> = {t('_?.suggestion')}</AText>
				</View>

				<AText color="pink">{t('_?.suggestionsEachDay')}</AText>

				<AText color="pink">{t('_?.suggestionsTomorrow')}</AText>
			</View>
		</View>
	);
}
