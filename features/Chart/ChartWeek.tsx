import { Text, View } from 'react-native';
import { ChartDay } from './ChartDay';
import { type ChartData } from './getChartData';
import { useTranslation } from 'react-i18next';

type ChartWeekProps = {
	weekData: ChartData;
};

export function ChartWeek(props: ChartWeekProps) {
	const { t } = useTranslation();

	return (
		<View className="justify-center items-end gap-2 ml-2">
			<View className="flex-row">
				{Object.entries(props.weekData.days).map(([date, exercises]) => (
					<ChartDay date={date} exercises={exercises} key={date} />
				))}
			</View>

			<Text className="text-cyan-500 text-xl px-2 font-mono">
				{t(props.weekData.text)}
			</Text>

			<View className="flex-row items-baseline">
				{props.weekData.badge && (
					<Text className="text-yellow-500 text-5xl -mt-1 font-extralight px-1 font-mono">
						{props.weekData.badge}{' '}
					</Text>
				)}
				<Text className="text-yellow-500 text-6xl -mt-1 font-extralight px-1 font-mono">
					{props.weekData.total}
				</Text>
			</View>

			<View className="h-48" />
		</View>
	);
}
