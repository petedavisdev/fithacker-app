import { FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getChartData } from './getChartData';
import { ChartWeek } from './ChartWeek';
import { useExerciseLog } from '@/shared/useExerciseLog';
import { filterExerciseLog } from '@/features/ExerciseFilter/filterExerciseLog';
import { type Exercise } from '@/shared/EXERCISES';

export function Chart() {
	const params = useLocalSearchParams<{ filter?: Exercise }>();
	const {
		exerciseLog,
		isLoadingExerciseLog,
		errorExerciseLog,
	} = useExerciseLog();

	const filteredLog =
		params.filter && exerciseLog
			? filterExerciseLog(exerciseLog, params.filter)
			: exerciseLog ?? {};

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
			ListEmptyComponent={
				isLoadingExerciseLog ? undefined : errorExerciseLog ? null : null
			}
		/>
	);
}
