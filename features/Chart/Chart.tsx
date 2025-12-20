import { FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getChartData } from './getChartData';
import { ChartWeek } from './ChartWeek';
import { useExerciseLog } from '@/shared/queries/useExerciseLog';
import { filterExerciseLog } from '@/features/ExerciseFilter/filterExerciseLog';
import { type Exercise } from '@/shared/utils/constants';

export function Chart() {
	const params = useLocalSearchParams<{ filter?: Exercise }>();
	const { exerciseLog, isLoadingExerciseLog, errorExerciseLog } =
		useExerciseLog();

	// Don't render if there's an error - component depends on exerciseLog
	if (errorExerciseLog) {
		return null;
	}

	const filteredLog =
		params.filter && exerciseLog
			? filterExerciseLog(exerciseLog, params.filter)
			: (exerciseLog ?? {});

	const chartData = getChartData(filteredLog);

	return (
		<FlatList
			horizontal
			showsHorizontalScrollIndicator={false}
			initialNumToRender={2}
			inverted
			data={chartData}
			keyExtractor={({ days }) => Object.keys(days)[0]}
			renderItem={({ item: weekData }) => <ChartWeek weekData={weekData} />}
			ListEmptyComponent={isLoadingExerciseLog ? undefined : null}
		/>
	);
}
