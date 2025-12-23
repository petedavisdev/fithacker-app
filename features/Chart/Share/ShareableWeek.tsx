import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { ChartData } from '../getChartData';
import { formatWeekFull } from '../getWeekText';
import { ShareableChartDay } from './ShareableChartDay';

type ShareableWeekProps = {
	weekData: ChartData;
	username?: string | null;
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
			<View className="flex-row">
				<Text className="font-mono text-xl text-yellow-500">FIT</Text>
				<Text className="font-mono text-xl text-cyan-500">HACKER</Text>
			</View>

			<View className="h-12">
				{props.username && (
					<Text className="font-mono text-2xl text-pink-400 text-center">
						{props.username}
					</Text>
				)}
			</View>

			<View className="flex-row">
				{Object.entries(props.weekData.days).map(([date, exercises]) => (
					<ShareableChartDay date={date} exercises={exercises} key={date} />
				))}
			</View>

			<Text className="text-cyan-500 text-2xl font-mono text-center">
				{weekText}
			</Text>

			<View className="flex-row items-center gap-2">
				<Text className="text-yellow-500 text-7xl font-extralight font-mono">
					{props.weekData.total}
				</Text>
				{props.weekData.badges.length > 0 && (
					<Text className="text-yellow-500 text-6xl font-extralight font-mono">
						{props.weekData.badges.join('')}
					</Text>
				)}
			</View>
		</LinearGradient>
	);
}
