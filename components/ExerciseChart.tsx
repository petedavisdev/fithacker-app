import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';
import { Exercise, ExerciseLog } from '../constants/EXERCISES';
import { getExerciseLog } from '../utils/exerciseLog';
import { ExerciseChartDay } from './ExerciseChartDay';
import { getWeekData, getWeekText } from '../utils/weekData';

type ExerciseChartProps = {
	filter?: Exercise;
	weekCount: number;
};

export function ExerciseChart(props: ExerciseChartProps) {
	const { t } = useTranslation();
	const flatListRef = useRef<FlatList>(null);

	const [exerciseLog, setExerciseLog] = useState<ExerciseLog>({});

	useEffect(() => {
		(async () => {
			setExerciseLog(await getExerciseLog());
		})();
	}, []);

	return (
		<FlatList
			ref={flatListRef}
			horizontal
			showsHorizontalScrollIndicator={false}
			initialNumToRender={2}
			inverted
			data={getWeekData(exerciseLog, props.weekCount)}
			keyExtractor={(week) => Object.keys(week)[0]}
			renderItem={({ item: week }) => (
				<View className="justify-center items-end gap-2 ml-1">
					<View className="flex-row gap-1">
						{Object.keys(week).map((date) => (
							<ExerciseChartDay
								date={date}
								exercises={week[date]}
								key={date}
								filter={props.filter}
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
									(exerciseItem) =>
										!props.filter ||
										(Array.isArray(exerciseItem)
											? exerciseItem[0] === props.filter
											: exerciseItem === props.filter)
								).length
						}
					</Text>
					<View className="h-48" />
				</View>
			)}
		/>
	);
}
