import { ActivityInput } from '@/components/ActivityInput';
import {
	ACTIVITIES,
	type Activity,
	type ActivityItem,
	type ActivityLog,
} from '@/constants/ACTIVITIES';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, KeyboardAvoidingView, Text, View } from 'react-native';
import { getActivityLog, storeActivityLog } from '../utils/activityLog';
import { getDateInfo } from '../utils/dateInfo';
import { getActivityChecklist } from '../utils/activityChecklist';

export default function HomeScreen() {
	const { t } = useTranslation();

	const { date } = useLocalSearchParams();
	const dateInfo = getDateInfo(typeof date === 'string' ? date : '');

	const [activityLog, setActivityLog] = useState<ActivityLog>({});

	const dayLog = activityLog[dateInfo.date?.toString()] ?? [];
	const checklist = getActivityChecklist(dateInfo, activityLog, dayLog);

	const DATE_CLASS_NAMES = {
		future: 'text-slate-500',
		today: 'text-pink-500',
		tomorrow: 'text-slate-400',
		weekend: 'text-yellow-500',
		weekday: 'text-cyan-500',
	};

	const dateClassName = DATE_CLASS_NAMES[dateInfo.category];

	function updateDayActivity(activity: Activity, note?: string) {
		const newDayActivities = [
			...dayLog.filter(
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
		const newDayActivities = dayLog.filter(
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
				className={`w-96 px-4 text-cyan-300 text-2xl text-center text-balance font-mono capitalize ${dateClassName}`}
			>
				{t(dateInfo.text)}
			</Text>

			<KeyboardAvoidingView behavior="padding">
				<View className="w-96 flex gap-6">
					{checklist.map((item) => {
						return (
							<ActivityInput
								key={item.activity}
								activity={item.activity}
								note={item.note}
								dayCount={item.dayCount}
								isChecked={item.isChecked}
								isPriority={item.isPriority}
								isDisabled={item.isDisabled}
								onCheckboxChange={(note?: string) => {
									Keyboard.dismiss();
									if (item.isChecked) {
										removeDayActivity(item.activity);
									} else {
										updateDayActivity(item.activity, note);
									}
								}}
								onNoteChange={(note?: string) => {
									if (item.isChecked) {
										updateDayActivity(item.activity, note);
									}
								}}
							/>
						);
					})}
				</View>
			</KeyboardAvoidingView>

			<Link href="/chart">
				<View className="w-20 h-20 flex items-center justify-center border-2 border-yellow-500 rounded-full bg-black shadow shadow-yellow-700">
					<Text className="text-4xl">👉</Text>
				</View>
			</Link>
		</>
	);
}
