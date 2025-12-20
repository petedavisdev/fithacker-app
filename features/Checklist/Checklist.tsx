import { View } from 'react-native';
import { getChecklistData } from './getChecklistData';
import { getDateInfo } from '@/shared/utils/dateInfo';
import { ChecklistInput } from './ChecklistInput';
import { useExerciseLog } from '@/shared/queries/useExerciseLog';
import { useLocalSearchParams } from 'expo-router';

export function Checklist() {
	const { date } = useLocalSearchParams<{ date: string }>();
	const dateInfo = getDateInfo(date?.toString());
	const { exerciseLog, isLoadingExerciseLog, errorExerciseLog } =
		useExerciseLog();

	// Don't render if there's an error - component depends on exerciseLog
	if (errorExerciseLog) {
		return null;
	}

	const dayLog = exerciseLog?.[dateInfo.date] ?? [];
	const checklist = getChecklistData(dateInfo, exerciseLog, dayLog);
	const isDisabled = ['future', 'tomorrow'].includes(dateInfo.category);

	return (
		<View className="w-96 flex gap-6 px-4">
			{checklist.map((item) => {
				return (
					<ChecklistInput
						key={`${dateInfo.date}-${item.exercise}`}
						exercise={item.exercise}
						note={item.note}
						dayCount={item.dayCount}
						isChecked={item.isChecked}
						isPriority={item.isPriority}
						isDisabled={isDisabled || isLoadingExerciseLog}
					/>
				);
			})}
		</View>
	);
}
