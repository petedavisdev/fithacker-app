import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Text } from 'react-native';
import { getDateInfo } from '../features/dateInfo';
import { Checklist } from '../features/Checklist/Checklist';
import { AButton } from '../features/Atoms/AButton';

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
		<>
			<Text
				className={`w-96 px-4 text-cyan-300 text-2xl text-center text-balance font-mono capitalize ${dateClassName}`}
			>
				{date ? t(dateInfo.text) : t('_.whatExerciseToday')}
			</Text>

			<KeyboardAvoidingView behavior="padding">
				<Checklist dateInfo={dateInfo} />
			</KeyboardAvoidingView>

			<AButton href="/chart">👉</AButton>
		</>
	);
}
