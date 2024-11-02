import { Link, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { getDateInfo } from '../utils/dateInfo';
import { ExerciseChecklist } from '../components/ExerciseChecklist';

export default function HomeScreen() {
	const { t } = useTranslation();

	const { date } = useLocalSearchParams();
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
				<ExerciseChecklist dateInfo={dateInfo} />
			</KeyboardAvoidingView>

			<Link href="/chart">
				<View className="w-20 h-20 flex items-center justify-center border-2 border-yellow-500 rounded-full bg-black shadow shadow-yellow-700">
					<Text className="text-4xl">👉</Text>
				</View>
			</Link>
		</>
	);
}
