import { useLocalSearchParams } from 'expo-router';
import { getChartData } from './getChartData';
import { filterExerciseLog } from '@/shared/utils/filterExerciseLog';
import { getDate } from '@/shared/utils/dateInfo';
import {
	type ExerciseLog,
	type Exercise,
	URL_PARAMS,
} from '@/shared/utils/constants';

type UseChartProps = {
	exerciseLog?: ExerciseLog;
	readOnly: boolean;
};

export function useChart(props: UseChartProps) {
	const params = useLocalSearchParams<{ [URL_PARAMS.FILTER]?: string }>();
	const filter = params[URL_PARAMS.FILTER] as Exercise | undefined;

	if (!props.exerciseLog) {
		return null;
	}

	const filteredLog =
		filter && props.exerciseLog
			? filterExerciseLog(props.exerciseLog, filter)
			: props.exerciseLog;

	const isExerciseLogEmpty =
		!filteredLog ||
		Object.values(filteredLog).every((day) => !day || day.length === 0);

	const indicatorDate =
		!props.readOnly && isExerciseLogEmpty && !filter ? getDate() : undefined;

	const chartData = getChartData(filteredLog);

	return {
		chartData,
		indicatorDate,
	};
}

