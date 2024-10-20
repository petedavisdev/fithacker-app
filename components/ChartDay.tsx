import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ActivityDay } from '../constants/ACTIVITIES';
import { Link } from 'expo-router';
import { getDateInfo } from '../utils/getDateInfo';

type ChartDayProps = {
	date: string;
	activities: ActivityDay;
};

export function ChartDay(props: ChartDayProps) {
	const { t } = useTranslation();
	const dateInfo = getDateInfo(props.date);

	const DATE_CLASS_NAMES = {
		future: 'border-slate-600 text-slate-500',
		today: 'border-pink-400 text-pink-300',
		weekend: 'border-yellow-400 text-yellow-300',
		weekday: 'border-cyan-500 text-cyan-300',
	};

	const dateClassNames = DATE_CLASS_NAMES[dateInfo.category];

	return (
		<Link
			key={props.date}
			href={`/${props.date}`}
			disabled={dateInfo.type === 'future'}
			className={`pointer`}
		>
			<View className="justify-end items-center h-96 gap-2">
				{props.activities.map((activity, index) => (
					<Text key={index} className="text-blue-300 text-4xl">
						{typeof activity === 'string' ? activity : activity[0]}
					</Text>
				))}
				<View
					className={`w-12 h-12 flex justify-center items-center border-t ${dateClassNames}`}
				>
					<Text className={`font-mono leading ${dateClassNames}`}>
						{t(`_day.${dateInfo.dayIndex}`).slice(0, 3)}
					</Text>
				</View>
			</View>
		</Link>
	);
}
