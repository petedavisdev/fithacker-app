import { Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

export function HelpSuggestions() {
	const { t } = useTranslation();

	const dot = (
		<View
			className="w-4 h-4 bg-pink-500 rounded-full border-2 border-black"
			style={{
				shadowColor: '#ec4899',
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.3,
				shadowRadius: 2,
				elevation: 3,
			}}
		/>
	);

	return (
		<>
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
				<Text className="text-cyan-400 font-mono">2</Text>
				<View className="absolute -top-1 -right-1">{dot}</View>
			</View>

			<View className="flex items-start gap-5">
				<Text className="text-cyan-400">
					<Text className="font-mono mx-1">2</Text> = {t('_?.daysSince')}
				</Text>

				<View className="flex-row items-center">
					{dot}
					<Text className="text-pink-400"> = {t('_?.suggestion')}</Text>
				</View>

				<Text className="text-pink-400">{t('_?.suggestionsEachDay')}</Text>

				<Text className="text-pink-400">{t('_?.suggestionsTomorrow')}</Text>
			</View>
		</>
	);
}
