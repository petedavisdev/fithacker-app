import { Keyboard, View } from 'react-native';
import { getChecklistData } from './getChecklistData';
import { type DateInfo } from '../dateInfo';
import { ChecklistInput } from './ChecklistInput';
import { useExerciseLog } from '../useExerciseLog';

type ChecklistProps = {
	dateInfo: DateInfo;
};

export function Checklist(props: ChecklistProps) {
	const { exerciseLog, updateDayExercise, removeDayExercise } =
		useExerciseLog();

	const dayLog = exerciseLog[props.dateInfo.date] ?? [];

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
