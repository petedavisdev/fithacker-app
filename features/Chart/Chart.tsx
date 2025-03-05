import { FlatList } from 'react-native';
import { type ExerciseLog } from '../EXERCISES';
import { getChartData } from './getChartData';
import { ChartWeek } from './ChartWeek';

type ChartProps = {
	exerciseLog: ExerciseLog;
};

export function Chart(props: ChartProps) {
	const chartData = getChartData(props.exerciseLog);

	return (
		<FlatList
			horizontal
			showsHorizontalScrollIndicator={false}
			initialNumToRender={2}
			inverted
			data={chartData}
			keyExtractor={({ days }) => Object.keys(days)[0]}
			renderItem={({ item: weekData }) => (
				<ChartWeek weekData={weekData} />
			)}
		/>
	);
}
