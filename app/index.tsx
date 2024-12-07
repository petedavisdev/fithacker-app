import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { getDateInfo } from '../features/dateInfo';
import { Checklist } from '../features/Checklist/Checklist';
import { AButton } from '../features/Atoms/AButton';
import { TheHeader } from '../features/TheHeader/TheHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function HomeScreen() {
	const { t } = useTranslation();

	const { date } = useLocalSearchParams<{ date: string }>();
	const dateInfo = getDateInfo(date?.toString());

	const DATE_CLASS_NAMES = {
		future: 'text-slate-500',
		today: 'text-pink-500',
		tomorrow: 'text-slate-400',
		weekend: 'text-yellow-500',
		weekday: 'text-cyan-500',
	};

	const dateClassName = DATE_CLASS_NAMES[dateInfo.category];

	return (
		<View className="flex-1 items-center gap-10">
			<TheHeader
				buttonRight={dateInfo.category === 'today' ? 'help' : undefined}
			/>

			<View className="w-96 px-4 flex flex-grow justify-center">
				<Text
					className={` text-cyan-300 text-2xl text-center text-balance font-mono capitalize ${dateClassName}`}
				>
					{date ? t(dateInfo.text) : t('_.whatExerciseToday')}
				</Text>
			</View>

			<KeyboardAwareScrollView keyboardOpeningTime={0}>
				<Checklist dateInfo={dateInfo} />
			</KeyboardAwareScrollView>

			<View className="flex-grow">
				<AButton href="/chart">👉</AButton>
			</View>
		</View>
	);
}
