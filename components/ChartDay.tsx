import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Activity, ActivityDay } from '../constants/ACTIVITIES';
import { Link } from 'expo-router';
import { getDateInfo } from '../utils/dateInfo';

type ChartDayProps = {
	date: string;
	activities: ActivityDay;
	filter?: Activity;
};

export function ChartDay(props: ChartDayProps) {
	const { t } = useTranslation();
	const dateInfo = getDateInfo(props.date);

	const DATE_TEXT_COLORS = {
		future: 'text-slate-500',
		today: 'text-pink-400',
		tomorrow: 'text-slate-500',
		weekend: 'text-yellow-500',
		weekday: 'text-cyan-500',
	};

	const dateTextColor = DATE_TEXT_COLORS[dateInfo.category];

	const DATE_LINE_COLORS = {
		future: 'bg-black',
		tomorrow: 'bg-slate-700 shadow shadow-slate-700',
		today: 'bg-pink-500 shadow shadow-pink-500',
		weekend: 'bg-yellow-500 shadow shadow-yellow-500',
		weekday: 'bg-cyan-500 shadow shadow-cyan-500',
	};

	const dateLineColor = DATE_LINE_COLORS[dateInfo.category];

	return (
		<Link
			key={props.date}
			href={`/${props.date}`}
			disabled={dateInfo.category === 'future'}
		>
			<View className="justify-end items-center h-96 gap-2">
				{props.activities.map((activityItem, index) => {
					const note =
						typeof activityItem !== 'string' && activityItem[1];
					const activity = note ? activityItem[0] : activityItem;

					if (!props.filter || activity === props.filter)
						return (
							<View key={index} className="relative">
								{props.filter && note && (
									<View className="absolute -top-12 w-full -rotate-90">
										<Text
											key={`note${index}`}
											className="font-mono text-pink-500 w-80 h-12 p-3"
										>
											{note}
										</Text>
									</View>
								)}
								<Text
									key={`activity${index}`}
									className="text-yellow-500 text-4xl"
								>
									{typeof activity === 'string'
										? activity
										: activity[0]}
								</Text>
							</View>
						);
				})}

				<View className={`h-[2px] w-12 ${dateLineColor}`} />

				<Text className={`font-mono leading ${dateTextColor}`}>
					{t(`_day.${dateInfo.dayIndex}`).slice(0, 3)}
				</Text>
			</View>
		</Link>
	);
}
