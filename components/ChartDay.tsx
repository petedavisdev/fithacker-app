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
		<View className="justify-end items-center h-96 gap-2">
			{props.activities.map((activity, index) => (
				<Text key={index} className="text-blue-300 text-4xl">
					{typeof activity === 'string' ? activity : activity[0]}
				</Text>
			))}
			<View
				className={`w-12 h-12 flex justify-center items-center border-t ${
					props.isFuture
						? 'border-slate-700'
						: [0, 6].includes(props.day)
						? 'border-yellow-600  bg-neutral-800'
						: 'border-blue-600 bg-blue-950'
				}`}
			>
				<Text
					className={`font-mono ${
						props.isFuture
							? ' text-slate-400'
							: [0, 6].includes(props.day)
							? ' text-yellow-300'
							: 'text-blue-200'
					}`}
				>
					{t(`_day.${props.day}`).slice(0, 3)}
				</Text>
			</View>
		</View>
	);
}
