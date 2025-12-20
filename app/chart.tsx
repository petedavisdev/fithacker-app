import { Chart as ChartComponent } from '../features/Chart/Chart';
import { ChartHelp } from '../features/Chart/ChartHelp';
import { ExerciseFilter } from '../features/ExerciseFilter/ExerciseFilter';
import { TheHeader } from '../features/TheHeader/TheHeader';
import { View } from 'react-native';
import { useExerciseLog } from '@/shared/queries/useExerciseLog';
import { getChartData } from '../features/Chart/getChartData';
import { hasMedals } from '../features/Chart/hasAchievements';
import { AButton } from '@/shared/components/AButton';
import { AModal } from '@/shared/components/AModal';
import { useState } from 'react';
import { filterExerciseLog } from '../features/ExerciseFilter/filterExerciseLog';
import { useLocalSearchParams } from 'expo-router';
import { type Exercise } from '@/shared/utils/constants';
import { BADGES } from '@/shared/utils/constants';

export default function Chart() {
	const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
	const params = useLocalSearchParams<{ filter?: Exercise }>();
	const { exerciseLog, isLoadingExerciseLog, errorExerciseLog } =
		useExerciseLog();

	const filteredLog =
		params.filter && exerciseLog
			? filterExerciseLog(exerciseLog, params.filter)
			: (exerciseLog ?? {});

	// Don't render chart if there's an error - component depends on exerciseLog
	if (errorExerciseLog) {
		return (
			<>
				<TheHeader buttonLeft="account" />
				<View className="flex-1 items-center justify-center gap-10">
					<ExerciseFilter />
				</View>
			</>
		);
	}

	const chartData = getChartData(filteredLog);
	const userHasMedals = hasMedals(chartData);
	const achievementEmoji = userHasMedals ? BADGES[2] : BADGES[1];

	// Only show achievement button if there's chart data with actual exercises
	const showAchievementButton =
		!isLoadingExerciseLog && chartData.some((week) => week.total > 0);

	const achievementButton = showAchievementButton ? (
		<AButton
			onPress={() => setIsAchievementModalOpen(true)}
			color="pink"
			size="sm"
		>
			{achievementEmoji}
		</AButton>
	) : null;

	return (
		<>
			<TheHeader buttonLeft="account" customButtonRight={achievementButton} />

			<AModal
				isOpen={isAchievementModalOpen}
				onClose={() => setIsAchievementModalOpen(false)}
			>
				<ChartHelp hasMedals={userHasMedals} />
			</AModal>

			<View className="flex-1 items-center justify-center gap-10">
				<ChartComponent />
				<ExerciseFilter />
			</View>
		</>
	);
}
