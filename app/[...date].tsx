import { Text, View } from 'react-native';
import { ActivityCheckbox } from '@/components/ActivityCheckbox';
import { useEffect, useState } from 'react';
import {
	ACTIVITIES,
	type Activity,
	type ActivityItem,
	type ActivityLog,
} from '@/constants/ACTIVITIES';
import { useTranslation } from 'react-i18next';
import { Link, useLocalSearchParams } from 'expo-router';
import { getDateInfo } from '../utils/dateInfo';
import { getActivityLog, storeActivityLog } from '../utils/activityLog';

export default function HomeScreen() {
	const { t } = useTranslation();

	const { date } = useLocalSearchParams();
	const dateInfo = getDateInfo(date ? date.toString() : '');

	const [activityLog, setActivityLog] = useState<ActivityLog>({});

	const dayActivities = activityLog[dateInfo.date?.toString()] ?? [];

	const DATE_CLASS_NAMES = {
		future: 'text-slate-500',
		today: 'text-pink-400',
		weekend: 'text-yellow-400',
		weekday: 'text-cyan-400',
	};

	const dateClassNames = DATE_CLASS_NAMES[dateInfo.category];

	function updateDayActivity(activity: Activity, note: string) {
		const newDayActivities = [
			...dayActivities.filter(
				(item) => item !== activity && item[0] !== activity
			),
			(note ? [activity, note] : activity) as ActivityItem,
		].sort((a: ActivityItem, b: ActivityItem) => {
			const activityA = typeof a === 'string' ? a : a[0];
			const activityB = typeof b === 'string' ? b : b[0];
			return (
				ACTIVITIES.indexOf(activityA) - ACTIVITIES.indexOf(activityB)
			);
		});

		setActivityLog((prev) => ({
			...prev,
			[dateInfo.date]: newDayActivities,
		}));
	}

	function removeDayActivity(activity: Activity) {
		const newDayActivities = dayActivities.filter(
			(item) => item !== activity && item[0] !== activity
		);

		if (newDayActivities.length) {
			setActivityLog((prev) => ({
				...prev,
				[dateInfo.date]: newDayActivities.length
					? newDayActivities
					: undefined,
			}));
		} else {
			const { [dateInfo.date]: _, ...rest } = activityLog;
			setActivityLog(rest);
		}
	}

	useEffect(() => {
		(async () => {
			setActivityLog(await getActivityLog());
		})();
	}, []);

	useEffect(() => {
		storeActivityLog(activityLog ?? {});
		console.log(activityLog);
	}, [activityLog]);

	return (
		<>
			<Text
				className={`w-96 text-cyan-300 text-2xl font-semibold text-center text-balance font-mono ${dateClassNames}`}
			>
				{t(dateInfo.text)}
			</Text>

			<View className="w-96 flex gap-6">
				{ACTIVITIES.map((activity) => {
					const isChecked = dayActivities.flat().includes(activity);
					const dayCount = isChecked
						? undefined
						: getDayCount(activity, dateInfo.date, activityLog);
					const note = dayActivities.find(
						(item) => item[0] === activity
					)?.[1];

					return (
						<ActivityCheckbox
							key={activity}
							activity={activity}
							isChecked={isChecked}
							dayCount={dayCount}
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
				<View className="w-20 h-20 flex items-center justify-center border-2 border-yellow-500 rounded-full shadow shadow-yellow-500">
					<Text className="text-4xl">👉</Text>
				</View>
			</Link>
		</>
	);
}

function getDayCount(
	activity: Activity,
	date: string,
	activityLog: ActivityLog
) {
	const prevDate = Object.keys(activityLog)
		.filter(
			(key) => key < date && activityLog[key]?.flat().includes(activity)
		)
		.sort()
		.at(-1);

	if (!prevDate) return;

	const time = new Date(date).getTime();
	const prevTime = new Date(prevDate).getTime();

	return Math.floor((time - prevTime) / (1000 * 60 * 60 * 24));
}
