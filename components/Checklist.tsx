import { Keyboard, View } from 'react-native';
import { getChecklistData } from '../utils/exerciseChecklistData';
import { type DateInfo } from '../utils/dateInfo';
import { ChecklistInput } from './ChecklistInput';
import { useExerciseLog } from '../hooks/useExerciseLog';

type ChecklistProps = {
	dateInfo: DateInfo;
};

export function Checklist(props: ChecklistProps) {
	const { exerciseLog, dayLog, updateDayExercise, removeDayExercise } =
		useExerciseLog(props.dateInfo.date);

	const checklist = getChecklistData(props.dateInfo, exerciseLog, dayLog);

	const isDisabled = ['future', 'tomorrow'].includes(props.dateInfo.category);

	return (
		<View className="w-96 flex gap-6">
			{checklist.map((item) => {
				return (
					<ChecklistInput
						key={item.exercise}
						exercise={item.exercise}
						note={item.note}
						dayCount={item.dayCount}
						isChecked={item.isChecked}
						isPriority={item.isPriority}
						isDisabled={isDisabled}
						onCheckboxChange={(note?: string) => {
							Keyboard.dismiss();
							if (item.isChecked) {
								removeDayExercise(item.exercise);
							} else {
								updateDayExercise(item.exercise, note);
							}
						}}
						onNoteChange={(note?: string) => {
							if (item.isChecked) {
								updateDayExercise(item.exercise, note);
							}
						}}
					/>
				);
			})}
		</View>
	);
}
