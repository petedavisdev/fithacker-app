import { FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getChartData } from './getChartData';
import { ChartWeek } from './ChartWeek';
import { filterExerciseLog } from '@/shared/utils/filterExerciseLog';
import { type ExerciseLog, type Exercise, URL_PARAMS } from '@/shared/utils/constants';

type ChartProps = {
	readOnly: boolean;
	exerciseLog?: ExerciseLog;
	onBadgePress: () => void;
};

export function Chart(props: ChartProps) {
	const params = useLocalSearchParams<{ [URL_PARAMS.FILTER]?: string }>();
	const filter = params[URL_PARAMS.FILTER] as Exercise | undefined;

	if (!props.exerciseLog) {
		return null;
	}

	const filteredLog =
		filter && props.exerciseLog
			? filterExerciseLog(props.exerciseLog, filter)
			: props.exerciseLog;

	const chartData = getChartData(filteredLog);

	return (
		<FlatList
			horizontal
			showsHorizontalScrollIndicator={false}
			initialNumToRender={2}
			inverted
			data={chartData}
			keyExtractor={({ days }) => Object.keys(days)[0]}
			renderItem={({ item: weekData }) => (
				<ChartWeek weekData={weekData} readOnly={props.readOnly} onBadgePress={props.onBadgePress} />
			)}
			ListEmptyComponent={null}
		/>
	);
}

