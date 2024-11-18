import { Text, View } from 'react-native';
import { ChartDay } from './ChartDay';
import { type ChartData } from './getChartData';
import { useTranslation } from 'react-i18next';
import { Exercise } from '../EXERCISES';

type ExerciseChartWeekProps = {
	filter: Exercise | undefined;
	weekData: ChartData;
};

export function ExerciseChartWeek(props: ExerciseChartWeekProps) {
	const { t } = useTranslation();

	return (
		<>
			<View className="justify-center items-end gap-2 ml-1">
				<View className="flex-row gap-1">
					{Object.entries(props.weekData.days).map(
						([date, exercises]) => (
							<ChartDay
								date={date}
								exercises={exercises}
								key={date}
								filter={props.filter}
							/>
						)
					)}
				</View>

				<Text className="text-cyan-500 text-xl px-2 font-mono">
					{t(props.weekData.text)}
				</Text>

				<Text className="text-yellow-500 text-6xl -mt-1 font-extralight px-1 font-mono">
					{
						Object.values(props.weekData.days)
							.flat()
							.filter(
								(exerciseItem) =>
									!props.filter ||
									(Array.isArray(exerciseItem)
										? exerciseItem[0] === props.filter
										: exerciseItem === props.filter)
							).length
					}
				</Text>

				<View className="h-48" />
			</View>
		</>
	);
}
