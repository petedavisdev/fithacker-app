import { Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

export function HelpSuggestions() {
	const { t } = useTranslation();

	const dot = (
		<View className="w-4 h-4 bg-pink-500 rounded-full shadow border-2 border-black" />
	);

	return (
		<>
			<View className="w-12 h-12 justify-center items-center rounded-lg border-2 bg-black relative border-cyan-500 shadow shadow-cyan-700">
				<Text className="text-cyan-400 font-mono">2</Text>
				<View className="absolute -top-1 -right-1">{dot}</View>
			</View>

			<View className="flex items-start gap-5">
				<View className="flex-row items-center">
					{dot}
					<Text className="text-pink-400"> = {t('_?.suggestion')}</Text>
				</View>

				<Text className="text-pink-400">{t('_?.suggestionsEachDay')}</Text>

				<Text className="text-pink-400">{t('_?.suggestionsTomorrow')}</Text>

				<Text className="text-cyan-400">
					<Text className="font-mono">2</Text> = {t('_?.daysSince')}
				</Text>
			</View>
		</>
	);
}
