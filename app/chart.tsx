import { Chart as ChartComponent } from '../features/Chart/Chart';
import { BadgesHelp } from '../features/Chart/BadgesHelp';
import { TheFilter } from '@/shared/components/TheFilter';
import { TheHeader } from '@/shared/components/TheHeader';
import { View } from 'react-native';
import { useExerciseLog } from '@/shared/queries/useExerciseLog';
import { AModal } from '@/shared/components/AModal';
import { useState } from 'react';

export default function Chart() {
	const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);

	const { exerciseLog, errorExerciseLog } = useExerciseLog();

	// Don't render chart if there's an error - component depends on exerciseLog
	if (errorExerciseLog) {
		return (
			<>
				<TheHeader buttonLeft="account" />
				<View className="flex-1 items-center justify-center gap-10">
					<TheFilter />
				</View>
			</>
		);
	}

	return (
		<>
			<TheHeader buttonLeft="account" buttonRight="notes" />

			<AModal
				isOpen={isAchievementModalOpen}
				onClose={() => setIsAchievementModalOpen(false)}
			>
				<BadgesHelp />
			</AModal>

			<View className="flex-1 items-center justify-center gap-10">
				<ChartComponent
					readOnly={false}
					exerciseLog={exerciseLog}
					onBadgePress={() => setIsAchievementModalOpen(true)}
				/>
				<TheFilter />
			</View>
		</>
	);
}
