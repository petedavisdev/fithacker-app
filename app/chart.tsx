import { FlatList, Text, View } from 'react-native';
import { useRef, useState } from 'react';
import { Link } from 'expo-router';
import { ChartDay } from '@/components/ChartDay';
import { ActivityDay, ActivityLog } from '../constants/ACTIVITIES';
import { EXERCISE_LOG } from '@/constants/EXERCISE_LOG';
import { useTranslation } from 'react-i18next';

type ExerciseLog = keyof typeof EXERCISE_LOG;

export default function chart() {
	const { t } = useTranslation();
	const flatListRef = useRef<FlatList>(null);
	const [weekCount, setWeekCount] = useState(2);

	return (
		<FlatList
			ref={flatListRef}
			horizontal
			initialNumToRender={2}
			inverted
			showsHorizontalScrollIndicator={true}
			data={getWeeks(weekCount)}
			keyExtractor={(week) => Object.keys(week)[0]}
			renderItem={({ item: week }) => (
				<View className="justify-center items-end gap-2 ml-1">
					<View className="flex-row gap-1">
						{Object.keys(week).map((date) => {
							const jsDate = new Date(date);
							const day = jsDate.getDay();
							const isFuture = jsDate > new Date();

							if (isFuture)
								return (
									<ChartDay
										key={date}
										day={day}
										isFuture={isFuture}
										activities={week[date]}
									/>
								);

							return (
								<Link
									key={date}
									href={`/${date}`}
									disabled={isFuture}
								>
									<ChartDay
										day={day}
										isFuture={isFuture}
										activities={week[date]}
									/>
								</Link>
							);
						})}
					</View>
					<Text className="text-blue-300 font-semibold text-xl px-2">
						{t(getWeekText(Object.keys(week)))}
					</Text>
					<Text className="text-blue-400 text-6xl -mt-1 font-extralight px-1">
						{Object.values(week).flat().length}
					</Text>
				</View>
			)}
		/>
	);
}

function getWeeks(count: number) {
	const weeks: ActivityLog[] = Array.from({ length: count }, () => ({}));

	const startDate = new Date();
	startDate.setDate(startDate.getDate() - startDate.getDay());

	weeks.forEach((week) => {
		for (let d = 1; d <= 7; d++) {
			const currentDate = new Date(startDate);
			currentDate.setDate(currentDate.getDate() + d);
			const date = currentDate.toISOString().slice(0, 10);

			week[date] =
				(EXERCISE_LOG[date as ExerciseLog] as unknown as
					| ActivityDay
					| undefined) ?? [];
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
