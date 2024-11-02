import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Exercise, ExerciseDay } from '../constants/EXERCISES';
import { type Href, Link } from 'expo-router';
import { getDateInfo } from '../utils/dateInfo';

type ChartDayProps = {
	date: string;
	exercises: ExerciseDay;
	filter?: Exercise;
};

export function ExerciseChartDay(props: ChartDayProps) {
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
			href={`/${props.date}` as Href<string | object>}
			disabled={dateInfo.category === 'future'}
		>
			<View className="justify-end items-center h-96 gap-2">
				{props.exercises.map((exerciseItem, index) => {
					const note =
						typeof exerciseItem !== 'string' && exerciseItem[1];
					const exercise = note ? exerciseItem[0] : exerciseItem;

					if (!props.filter || exercise === props.filter)
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
									key={`exercise${index}`}
									className="text-yellow-500 text-4xl"
								>
									{typeof exercise === 'string'
										? exercise
										: exercise[0]}
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
