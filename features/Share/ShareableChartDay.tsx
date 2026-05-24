import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AText } from '@/shared/components/AText';
import { AEmoji } from '@/shared/components/AEmoji';
import { getDateInfo } from '@/shared/utils/dateInfo';
import type { ExerciseDay } from '@/shared/utils/constants';

type ShareableChartDayProps = {
	date: string;
	exercises?: ExerciseDay;
};

export function ShareableChartDay(props: ShareableChartDayProps) {
	const dateInfo = getDateInfo(props.date);
	const isWeekend = dateInfo.dayIndex === 0 || dateInfo.dayIndex === 6; // 0 = Sunday, 6 = Saturday

	const dateLineColor = isWeekend ? 'bg-yellow-500' : 'bg-cyan-500';

	const { t } = useTranslation();

	return (
		<View className="justify-end items-center gap-2">
			{props.exercises?.map((exerciseItem, index) => {
				const exercise =
					typeof exerciseItem === 'string' ? exerciseItem : exerciseItem[0];

				return (
					<AEmoji key={`${props.date}${index}`} size="4xl">
						{exercise}
					</AEmoji>
				);
			})}

			<View className={`h-[2px] w-12 scale-x-[1.01] mt-2 ${dateLineColor}`} />

			<AText
				color={isWeekend ? 'yellow' : 'cyan'}
				shade={500}
				className="leading pb-0.5 -mt-2"
			>
				{t(`_day.${dateInfo.dayIndex}`).slice(0, 3)}
			</AText>
		</View>
	);
}
