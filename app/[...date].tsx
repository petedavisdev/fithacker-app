import { Text, View } from 'react-native';
import { ActivityCheckbox } from '@/components/ActivityCheckbox';
import { useState } from 'react';
import {
	ACTIVITIES,
	Activity,
	ActivityDay,
	ActivityItem,
} from '@/constants/ACTIVITIES';
import { useTranslation } from 'react-i18next';
import { Link, useLocalSearchParams } from 'expo-router';
import { getDateInfo } from '../utils/getDateInfo';
import { EXERCISE_LOG } from '@/constants/EXERCISE_LOG';

export default function HomeScreen() {
	const { t } = useTranslation();

	const { date } = useLocalSearchParams();

	const [dayActivities, setDayActivities] = useState<ActivityDay>([
		...(EXERCISE_LOG[date] ?? []),
	]);

	const dateInfo = getDateInfo(date?.toString() ?? '');

	const DATE_CLASS_NAMES = {
		future: 'text-slate-500',
		today: 'text-pink-400',
		weekend: 'text-yellow-400',
		weekday: 'text-cyan-400',
	};

	const dateClassNames = DATE_CLASS_NAMES[dateInfo.category];

	function updateDayActivity(activity: Activity, note: string) {
		setDayActivities((prev) =>
			[
				...prev.filter(
					(item) => item !== activity && item[0] !== activity
				),
				(note ? [activity, note] : activity) as ActivityItem,
			].sort((a: ActivityItem, b: ActivityItem) => {
				const activityA = typeof a === 'string' ? a : a[0];
				const activityB = typeof b === 'string' ? b : b[0];
				return (
					ACTIVITIES.indexOf(activityA) -
					ACTIVITIES.indexOf(activityB)
				);
			})
		);
	}

	function removeDayActivity(activity: Activity) {
		setDayActivities((prev) =>
			prev.filter((item) => item !== activity && item[0] !== activity)
		);
	}

	return (
		<>
			<Text
				className={`w-96 text-cyan-300 text-2xl font-semibold text-center text-balance ${dateClassNames}`}
			>
				{t(dateInfo.text)}
			</Text>

			<View className="w-96 flex gap-2">
				{ACTIVITIES.map((activity) => {
					const isChecked = dayActivities.flat().includes(activity);
					const note = dayActivities.find(
						(item) => item[0] === activity
					)?.[1];

					return (
						<ActivityCheckbox
							key={activity}
							activity={activity}
							isChecked={isChecked}
							note={note}
							onCheckboxChange={(note: string) => {
								if (isChecked) {
									removeDayActivity(activity);
								} else {
									updateDayActivity(activity, note);
								}
							}}
							onNoteChange={(note: string) => {
								if (isChecked) {
									updateDayActivity(activity, note);
								}
							}}
						/>
					);
				})}
			</View>

			<Link href="/chart">
				<View className="w-20 h-20 flex items-center justify-center border border-yellow-500 rounded-full">
					<Text className="text-4xl">👉</Text>
				</View>
			</Link>
		</>
	);
}
