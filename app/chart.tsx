import { FlatList, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { ChartDay } from '@/components/ChartDay';
import { ActivityDay, ActivityLog } from '../constants/ACTIVITIES';
import { useTranslation } from 'react-i18next';
import { getActivityLog } from '../utils/activityLog';

export default function chart() {
	const { t } = useTranslation();
	const flatListRef = useRef<FlatList>(null);
	const WEEK_COUNT = 2;
	const [activityLog, setActivityLog] = useState<ActivityLog>({});

	useEffect(() => {
		(async () => {
			setActivityLog(await getActivityLog());
		})();
	}, []);

	return (
		<FlatList
			ref={flatListRef}
			horizontal
			initialNumToRender={2}
			inverted
			showsHorizontalScrollIndicator={true}
			data={getWeeks(activityLog, WEEK_COUNT)}
			keyExtractor={(week) => Object.keys(week)[0]}
			renderItem={({ item: week }) => (
				<View className="justify-center items-end gap-2 ml-1">
					<View className="flex-row gap-1">
						{Object.keys(week).map((date) => (
							<ChartDay
								date={date}
								activities={week[date]}
								key={date}
							/>
						))}
					</View>
					<Text className="text-cyan-500 font-semibold text-xl px-2 font-mono">
						{t(getWeekText(Object.keys(week)))}
					</Text>
					<Text className="text-yellow-500 text-6xl -mt-1 font-extralight px-1 font-mono">
						{Object.values(week).flat().length}
					</Text>
				</View>
			)}
		/>
	);
}

function getWeeks(activityLog: ActivityLog, count: number) {
	const weeks: ActivityLog[] = Array.from({ length: count }, () => ({}));

	const startDate = new Date();
	startDate.setDate(startDate.getDate() - (startDate.getDay() || 7));

	weeks.forEach((week) => {
		for (let d = 1; d <= 7; d++) {
			const currentDate = new Date(startDate);
			currentDate.setDate(currentDate.getDate() + d);
			const date = currentDate.toISOString().slice(0, 10);

			week[date] = activityLog[date] ?? [];
		}
		startDate.setDate(startDate.getDate() - 7);
	});

	return weeks;
}

function getWeekText(weekDates: string[]) {
	const today = new Date().toISOString().slice(0, 10);
	if (weekDates.includes(today)) return '_.thisWeek';
	return '_.lastWeek';
}
