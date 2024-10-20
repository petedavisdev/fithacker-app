import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ActivityDay } from '../constants/ACTIVITIES';
import { Link } from 'expo-router';
import { getDateInfo } from '../utils/dateInfo';

type ChartDayProps = {
	date: string;
	activities: ActivityDay;
};

export function ChartDay(props: ChartDayProps) {
	const { t } = useTranslation();
	const dateInfo = getDateInfo(props.date);

	const DATE_TEXT_COLORS = {
		future: 'text-slate-500',
		today: 'text-pink-400 shadow shadow-pink-500',
		weekend: 'text-yellow-400 shadow shadow-yellow-600',
		weekday: 'text-cyan-400 shadow shadow-cyan-500',
	};

	const dateTextColor = DATE_TEXT_COLORS[dateInfo.category];

	const DATE_LINE_COLORS = {
		future: 'bg-slate-500',
		today: 'bg-pink-600 shadow shadow-pink-500',
		weekend: 'bg-yellow-600 shadow shadow-yellow-500',
		weekday: 'bg-cyan-600 shadow shadow-cyan-500',
	};

	const dateLineColor = DATE_LINE_COLORS[dateInfo.category];

	return (
		<Link
			key={props.date}
			href={`/${props.date}`}
			disabled={dateInfo.type === 'future'}
		>
			<View className="justify-end items-center h-96 gap-2">
				{props.activities.map((activity, index) => (
					<Text key={index} className="text-yellow-500 text-4xl">
						{typeof activity === 'string' ? activity : activity[0]}
					</Text>
				))}

				<View className={`h-0.5 w-12 ${dateLineColor}`} />

				<Text
					className={`font-mono font-semibold leading ${dateTextColor}`}
				>
					{t(`_day.${dateInfo.dayIndex}`).slice(0, 3)}
				</Text>
			</View>
		</Link>
	);
}
