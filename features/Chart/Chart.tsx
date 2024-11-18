import { useRef } from 'react';
import { FlatList } from 'react-native';
import { type Exercise } from '../EXERCISES';
import { useExerciseLog } from '../useExerciseLog';
import { checkDatesBeforeThisWeek } from '../dateInfo';
import { getChartData } from './getChartData';
import { ExerciseChartWeek } from './ChartWeek';

type ChartProps = {
	filter?: Exercise;
};

export function Chart(props: ChartProps) {
	const flatListRef = useRef<FlatList>(null);

	const { exerciseLog } = useExerciseLog();

	const hasDatesBeforeThisWeek = checkDatesBeforeThisWeek(
		Object.keys(exerciseLog)
	);

	const weeksToShow = hasDatesBeforeThisWeek ? 2 : 1;

	const chartData = getChartData(exerciseLog, weeksToShow);

	return (
		<FlatList
			ref={flatListRef}
			horizontal
			showsHorizontalScrollIndicator={false}
			initialNumToRender={2}
			inverted
			data={chartData}
			keyExtractor={({ days }) => Object.keys(days)[0]}
			renderItem={({ item: weekData }) => (
				<ExerciseChartWeek weekData={weekData} filter={props.filter} />
			)}
		/>
	);
}
