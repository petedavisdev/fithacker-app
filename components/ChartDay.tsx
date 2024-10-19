import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ActivityDay } from '../constants/ACTIVITIES';

type ChartDayProps = {
	isFuture: boolean;
	day: number;
	activities: ActivityDay;
};

export function ChartDay(props: ChartDayProps) {
	const { t } = useTranslation();
	return (
		<View className="justify-end items-center h-full gap-2">
			{props.activities.map((activity, index) => (
				<Text key={index} className="text-blue-300 text-4xl">
					{typeof activity === 'string' ? activity : activity[0]}
				</Text>
			))}
			<Text
				className={`w-12 h-12 flex justify-center items-center border-t font-mono ${
					props.isFuture
						? 'border-slate-700 text-slate-500'
						: [0, 6].includes(props.day)
						? 'border-yellow-600 text-yellow-400 bg-neutral-800'
						: 'border-blue-600 bg-blue-950 text-blue-300'
				}`}
			>
				{t(`_day.${props.day}`).slice(0, 3)}
			</Text>
		</View>
	);
}
