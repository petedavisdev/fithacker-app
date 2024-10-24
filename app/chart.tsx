import { FlatList, Pressable, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { ChartDay } from '@/components/ChartDay';
import {
	ACTIVITIES,
	Activity,
	ActivityItem,
	type ActivityLog,
} from '../constants/ACTIVITIES';
import { useTranslation } from 'react-i18next';
import { getActivityLog } from '../utils/activityLog';

export default function chart() {
	const { t } = useTranslation();
	const flatListRef = useRef<FlatList>(null);
	const WEEK_COUNT = 2;
	const [activityLog, setActivityLog] = useState<ActivityLog>({});
	const [filter, setFilter] = useState<Activity>();

	useEffect(() => {
		(async () => {
			setActivityLog(await getActivityLog());
		})();
	}, []);

	return (
		<>
			<FlatList
				ref={flatListRef}
				horizontal
				showsHorizontalScrollIndicator={false}
				initialNumToRender={2}
				inverted
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
									filter={filter}
								/>
							))}
						</View>
						<Text className="text-cyan-500 text-xl px-2 font-mono">
							{t(getWeekText(Object.keys(week)))}
						</Text>
						<Text className="text-yellow-500 text-6xl -mt-1 font-extralight px-1 font-mono">
							{
								Object.values(week)
									.flat()
									.filter(
										(activityItem) =>
											!filter ||
											(Array.isArray(activityItem)
												? activityItem[0] === filter
												: activityItem === filter)
									).length
							}
						</Text>
						<View className="h-48" />
					</View>
				)}
			/>
			<View className="flex-row justify-center items-center gap-1">
				<Pressable onPress={() => setFilter(undefined)}>
					<View
						className={`h-0.5 w-14 ${
							!filter
								? ' bg-pink-500 shadow shadow-pink-500'
								: 'bg-slate-800'
						}`}
					/>
					<Text className="text-cyan-500 w-14 h-12 text-center text-xs font-mono my-3">
						{ACTIVITIES.map((activity) => (
							<Text key={activity}>{activity}</Text>
						))}
					</Text>
				</Pressable>
				{Object.values(ACTIVITIES).map((activity) => (
					<Pressable
						key={activity}
						onPress={() => setFilter(activity)}
					>
						<View
							className={`h-[2px] w-14 shadow-none ${
								filter === activity
									? ' bg-pink-500 shadow-bg shadow-pink-500'
									: 'bg-slate-800'
							}`}
						/>
						<Text className="text-yellow-500 w-14 h-12 text-center text-3xl font-mono my-3">
							{activity}
						</Text>
					</Pressable>
				))}
			</View>
		</>
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
