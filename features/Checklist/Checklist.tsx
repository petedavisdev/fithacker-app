import { Keyboard, View } from 'react-native';
import { getChecklistData } from './getChecklistData';
import { type DateInfo } from '@/shared/dateInfo';
import { ChecklistInput } from './ChecklistInput';
import { useExerciseLog } from '@/shared/useExerciseLog';
import { useUpdateDayExercise } from './useUpdateDayExercise';
import { useRemoveDayExercise } from './useRemoveDayExercise';

type ChecklistProps = {
	dateInfo: DateInfo;
};

export function Checklist(props: ChecklistProps) {
	const { exerciseLog, isLoadingExerciseLog } = useExerciseLog();

	const { updateDayExercise } = useUpdateDayExercise(
		props.dateInfo.date,
	);
	const { removeDayExercise } = useRemoveDayExercise(
		props.dateInfo.date,
	);

	const dayLog = exerciseLog?.[props.dateInfo.date] ?? [];

	const checklist = getChecklistData(props.dateInfo, exerciseLog, dayLog);

	const isDisabled = ['future', 'tomorrow'].includes(props.dateInfo.category);

	return (
		<View className="w-96 flex gap-6 px-4">
			{/* Optionally could show loading state; keeping UI minimal */}
			{checklist.map((item) => {
				return (
					<ChecklistInput
						key={item.exercise}
						exercise={item.exercise}
						note={item.note}
						dayCount={item.dayCount}
						isChecked={item.isChecked}
						isPriority={item.isPriority}
						isDisabled={isDisabled || isLoadingExerciseLog}
						onCheckboxChange={(note?: string) => {
							Keyboard.dismiss();
							if (item.isChecked) {
								removeDayExercise({ exercise: item.exercise });
							} else {
								updateDayExercise({ exercise: item.exercise, note });
							}
						}}
						onNoteChange={(note?: string) => {
							if (item.isChecked) {
								updateDayExercise({ exercise: item.exercise, note });
							}
						}}
					/>
				);
			})}
		</View>
	);
}
