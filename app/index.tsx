import { Text, View } from 'react-native';

import { AButton } from '../features/Atoms/AButton';
import { Checklist } from '../features/Checklist/Checklist';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TheHeader } from '../features/TheHeader/TheHeader';
import { getDateInfo } from '../features/dateInfo';
import { getDateSteps } from '../features/Checklist/getDateSteps';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
// TODO: REMOVE AFTER MIGRATION - Delete this import and the useMigration hook call below
import { useMigration } from '../features/migration/useMigration';

export default function HomeScreen() {
	const { t } = useTranslation();
	// TODO: REMOVE AFTER MIGRATION - Delete this line and the if (!isMigrated) guard below
	const { isMigrated } = useMigration();

	const { date } = useLocalSearchParams<{ date: string }>();
	const dateInfo = getDateInfo(date?.toString());
	const { prev, next } = getDateSteps(dateInfo.date);

	const DATE_CLASS_NAMES = {
		future: 'text-slate-500',
		today: 'text-pink-500',
		tomorrow: 'text-slate-400',
		weekend: 'text-yellow-500',
		weekday: 'text-cyan-500',
	};

	const dateClassName = DATE_CLASS_NAMES[dateInfo.category];

	// TODO: REMOVE AFTER MIGRATION - Delete this entire if block
	if (!isMigrated) {
		return null;
	}

	return (
		<View className="flex-1 items-center gap-5">
			<TheHeader
				buttonRight={dateInfo.category === 'today' ? 'help' : undefined}
			/>

			<View className="w-96 px-4 flex flex-grow justify-center">
				<Text
					className={` text-cyan-300 text-2xl text-center text-balance font-mono first-letter:uppercase ${dateClassName}`}
				>
					{date ? t(dateInfo.text) : t('_.whatExerciseToday')}
				</Text>
			</View>

			<KeyboardAwareScrollView keyboardOpeningTime={0}>
				<Checklist dateInfo={dateInfo} />
			</KeyboardAwareScrollView>

			<View className="flex-grow w-96 flex-row justify-between items-center px-4">
				<AButton href={`/?date=${prev}`} size="sm">
					👈
				</AButton>
				<AButton href="/chart">👍</AButton>
				<AButton href={`/?date=${next}`} size="sm" isDisabled={!next}>
					👉
				</AButton>
			</View>
		</View>
	);
}
