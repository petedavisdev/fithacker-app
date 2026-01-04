import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AText } from '@/shared/components/AText';
import type { ChartData } from '../getChartData';
import { formatWeekFull } from '../getWeekText';
import { ShareableChartDay } from './ShareableChartDay';

type ShareableWeekProps = {
	weekData: ChartData;
};

export function ShareableWeek(props: ShareableWeekProps) {
	const dates = Object.keys(props.weekData.days);
	const weekText = formatWeekFull(dates[0], dates[6]);

	return (
		<LinearGradient
			colors={['black', '#112', '#112', 'black']}
			style={{
				width: 540,
				height: 720,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<View
				className="gap-4 items-center"
				style={{ transform: [{ scale: 1.3 }] }}
			>
				<View className="flex-row">
					<AText color="yellow" shade={500} size="xl">
						FIT
					</AText>
					<AText color="cyan" shade={500} size="xl">
						HACKER
					</AText>
				</View>

				<View className="flex-row">
					{Object.entries(props.weekData.days).map(([date, exercises]) => (
						<ShareableChartDay date={date} exercises={exercises} key={date} />
					))}
				</View>

				<AText color="cyan" shade={500} size="2xl" className="text-center">
					{weekText}
				</AText>

				<View className="flex-row items-center gap-2">
					<AText
						color="yellow"
						shade={500}
						size="7xl"
						className="font-extralight"
					>
						{props.weekData.total}
					</AText>
					{props.weekData.badges.length > 0 && (
						<AText size="6xl" className="font-extralight">
							{props.weekData.badges.join('')}
						</AText>
					)}
				</View>
			</View>
		</LinearGradient>
	);
}
