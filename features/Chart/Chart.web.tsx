import { useEffect, useRef } from 'react';
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

	if (!data) {
		return null;
	}

	const reversedData = [...data.chartData].reverse();

	return (
		<div
			ref={scrollContainerRef}
			style={{
				width: 0,
				minWidth: '100%',
				overflowX: 'auto',
				overflowY: 'hidden',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'flex-end',
					marginLeft: 'auto',
					width: 'fit-content',
					minWidth: '100%',
					justifyContent: 'flex-end',
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
								indicatorDate={data.indicatorDate}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}
