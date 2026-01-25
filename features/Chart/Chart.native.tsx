import { FlatList } from 'react-native';
import { ChartWeek } from './ChartWeek';
import { useChart } from './useChart';
import type { ExerciseLog } from '@/shared/utils/constants';

type ChartProps = {
	readOnly: boolean;
	exerciseLog?: ExerciseLog;
	onBadgePress: () => void;
};

export function Chart(props: ChartProps) {
	const data = useChart(props);

	if (!data) {
		return null;
	}

	return (
		<FlatList
			horizontal
			showsHorizontalScrollIndicator={false}
			initialNumToRender={2}
			inverted
			data={data.chartData}
			keyExtractor={({ days }) => Object.keys(days)[0]}
			renderItem={({ item: weekData }) => (
				<ChartWeek
					weekData={weekData}
					readOnly={props.readOnly}
					onBadgePress={props.onBadgePress}
					indicatorDate={data.indicatorDate}
				/>
			)}
			ListEmptyComponent={null}
		/>
	);
}
