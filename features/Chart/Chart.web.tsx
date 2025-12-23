import { useEffect, useRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getChartData } from './getChartData';
import { ChartWeek } from './ChartWeek';
import { filterExerciseLog } from '@/shared/utils/filterExerciseLog';
import {
	type ExerciseLog,
	type Exercise,
	URL_PARAMS,
} from '@/shared/utils/constants';

type ChartProps = {
	readOnly: boolean;
	exerciseLog?: ExerciseLog;
	onBadgePress: () => void;
};

export function Chart(props: ChartProps) {
	const params = useLocalSearchParams<{ [URL_PARAMS.FILTER]?: string }>();
	const filter = params[URL_PARAMS.FILTER] as Exercise | undefined;
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollContainerRef.current && props.exerciseLog) {
			setTimeout(() => {
				if (scrollContainerRef.current) {
					scrollContainerRef.current.scrollLeft =
						scrollContainerRef.current.scrollWidth;
				}
			}, 100);
		}
	}, [props.exerciseLog]);

	if (!props.exerciseLog) {
		return null;
	}

	const filteredLog =
		filter && props.exerciseLog
			? filterExerciseLog(props.exerciseLog, filter)
			: props.exerciseLog;

	const chartData = getChartData(filteredLog);
	const reversedData = [...chartData].reverse();

	return (
		<div
			ref={scrollContainerRef}
			style={{
				width: 0,
				minWidth: '100%',
				overflowX: 'auto',
				overflowY: 'hidden',
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'flex-end',
				justifyContent: 'center',
			}}
		>
			{reversedData.map((weekData) => {
				const firstDate = Object.keys(weekData.days)[0];
				return (
					<div key={firstDate} style={{ flexShrink: 0 }}>
						<ChartWeek
							weekData={weekData}
							readOnly={props.readOnly}
							onBadgePress={props.onBadgePress}
						/>
					</div>
				);
			})}
		</div>
	);
}
