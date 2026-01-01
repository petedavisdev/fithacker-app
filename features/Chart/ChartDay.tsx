import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { ExerciseDay, Exercise } from '@/shared/utils/constants';
import { URL_PARAMS } from '@/shared/utils/constants';
import { type Href, Link, useLocalSearchParams } from 'expo-router';
import { getDateInfo } from '@/shared/utils/dateInfo';

type ChartDayProps = {
	date: string;
	exercises?: ExerciseDay;
	readOnly?: boolean;
	indicatorDate?: string;
};

export function ChartDay(props: ChartDayProps) {
	const { t } = useTranslation();
	const params = useLocalSearchParams<{ [URL_PARAMS.FILTER]?: string }>();
	const filter = params[URL_PARAMS.FILTER] as Exercise | undefined;
	const dateInfo = getDateInfo(props.date);
	const isDisabled = dateInfo.category === 'future' || props.readOnly;

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
		tomorrow: 'bg-slate-700',
		today: 'bg-pink-500',
		weekend: 'bg-yellow-500',
		weekday: 'bg-cyan-500',
	};

	const DATE_LINE_SHADOW_COLORS = {
		future: undefined,
		tomorrow: '#334155',
		today: '#ec4899',
		weekend: '#eab308',
		weekday: '#06b6d4',
	};

	const dateLineColor = DATE_LINE_COLORS[dateInfo.category];
	const dateLineShadowColor = DATE_LINE_SHADOW_COLORS[dateInfo.category];

	const DATE_UNDERLINE_COLORS = {
		future: '',
		tomorrow: 'border-slate-600',
		today: 'border-pink-600',
		weekend: 'border-yellow-700',
		weekday: 'border-cyan-700',
	};

	const dateUnderlineColor = DATE_UNDERLINE_COLORS[dateInfo.category];

	const content = (
		<View className="justify-end items-center h-96 gap-2">
			{props.date === props.indicatorDate ? (
				<Text className="text-yellow-500 text-4xl">👇</Text>
			) : (
				props.exercises?.map((exerciseItem, index) => {
					const note = typeof exerciseItem !== 'string' && exerciseItem[1];
					const exercise = note ? exerciseItem[0] : exerciseItem;

					return (
						<View key={`${props.date}${index}`} className="relative">
							{!!filter && note && (
								<View className="absolute -top-12 w-full -rotate-90">
									<Text className="font-mono text-pink-500 w-80 h-12 p-3">
										{note}
									</Text>
								</View>
							)}

							<Text className="text-yellow-500 text-4xl">
								{typeof exercise === 'string' ? exercise : exercise[0]}
							</Text>
						</View>
					);
				})
			)}

			{/* scale-x to remove gap in ios */}
			<View
				className={`h-[2px] w-12 scale-x-[1.01] ${dateLineColor}`}
				style={
					dateLineShadowColor
						? {
								shadowColor: dateLineShadowColor,
								shadowOffset: { width: 0, height: 1 },
								shadowOpacity: 0.3,
								shadowRadius: 2,
								elevation: 3,
							}
						: undefined
				}
			/>

			<Text
				className={`font-mono leading pb-0.5 border-b ${dateTextColor} ${
					isDisabled ? 'border-transparent' : `${dateUnderlineColor}`
				}`}
			>
				{t(`_day.${dateInfo.dayIndex}`).slice(0, 3)}
			</Text>
		</View>
	);

	if (props.readOnly || dateInfo.category === 'future') {
		return content;
	}

	return <Link href={`/?date=${props.date}` as Href}>{content}</Link>;
}
