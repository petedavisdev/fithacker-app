import { Text, View } from 'react-native';
import { ChartDay } from './ChartDay';
import { type ChartData } from './getChartData';
import { useTranslation } from 'react-i18next';

type ExerciseChartWeekProps = {
	weekData: ChartData;
};

export function ExerciseChartWeek(props: ExerciseChartWeekProps) {
	const { t } = useTranslation();

	return (
		<>
			<View className="justify-center items-end gap-2 ml-1">
				<View className="flex-row">
					{Object.entries(props.weekData.days).map(
						([date, exercises]) => (
							<ChartDay
								date={date}
								exercises={exercises}
								key={date}
							/>
						)
					)}
				</View>

				<Text className="text-cyan-500 text-xl px-2 font-mono">
					{t(props.weekData.text)}
				</Text>

				<Text className="text-yellow-500 text-6xl -mt-1 font-extralight px-1 font-mono">
					{props.weekData.total}
				</Text>

				<View className="h-48" />
			</View>
		</>
	);
}
