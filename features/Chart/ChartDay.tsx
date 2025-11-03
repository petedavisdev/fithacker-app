import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { ExerciseCode, ExerciseDay } from '../EXERCISES';
import { EXERCISE_CODES, EXERCISE_METADATA } from '../EXERCISES';
import { type Href, Link, useLocalSearchParams } from 'expo-router';
import { getDateInfo } from '../dateInfo';

type ChartDayProps = {
	date: string;
	exercises?: ExerciseDay;
};

export function ChartDay(props: ChartDayProps) {
	const { t } = useTranslation();
	const { filter } = useLocalSearchParams<{ filter?: ExerciseCode | '' }>();
	const dateInfo = getDateInfo(props.date);
	const isDisabled = dateInfo.category === 'future';

	const DATE_TEXT_COLORS = {
		future: 'text-slate-500',
		today: 'text-pink-400',
		tomorrow: 'text-slate-400',
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

	const DATE_UNDERLINE_COLORS = {
		future: '',
		tomorrow: 'border-slate-600',
		today: 'border-pink-600',
		weekend: 'border-yellow-700',
		weekday: 'border-cyan-700',
	};

	const dateUnderlineColor = DATE_UNDERLINE_COLORS[dateInfo.category];

	const exercisesInDay = props.exercises
		? EXERCISE_CODES.filter((code) => code in props.exercises!)
		: [];

	return (
		<Link href={`/?date=${props.date}` as Href} disabled={isDisabled}>
			<View className="justify-end items-center h-96 gap-2">
				{exercisesInDay.map((code, index) => {
					const note = props.exercises![code];

					return (
						<View key={`${props.date}${code}${index}`} className="relative">
							{!!filter && note && note !== '' && (
								<View className="absolute -top-12 w-full -rotate-90">
									<Text className="font-mono text-pink-500 w-80 h-12 p-3">
										{note}
									</Text>
								</View>
							)}

							<Text className="text-yellow-500 text-4xl">
								{EXERCISE_METADATA[code].emoji}
							</Text>
						</View>
					);
				})}

				{/* scale-x to remove gap in ios */}
				<View className={`h-[2px] w-12 scale-x-[1.01] ${dateLineColor}`} />

				<Text
					className={`font-mono leading pb-0.5 border-b ${dateTextColor} ${
						isDisabled ? 'border-transparent' : `${dateUnderlineColor}`
					}`}
				>
					{t(`_day.${dateInfo.dayIndex}`).slice(0, 3)}
				</Text>
			</View>
		</Link>
	);
}