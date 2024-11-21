import { useRef } from 'react';
import { FlatList } from 'react-native';
import { type ExerciseLog } from '../EXERCISES';
import { getChartData } from './getChartData';
import { ExerciseChartWeek } from './ChartWeek';

type ChartProps = {
	exerciseLog: ExerciseLog;
};

export function Chart(props: ChartProps) {
	const flatListRef = useRef<FlatList>(null);

	const chartData = getChartData(props.exerciseLog);

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
				<ExerciseChartWeek weekData={weekData} />
			)}
		/>
	);
}
