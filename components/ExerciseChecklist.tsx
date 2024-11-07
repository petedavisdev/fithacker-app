import { Keyboard, View } from 'react-native';
import { getExerciseChecklistData } from '../utils/exerciseChecklistData';
import { type DateInfo } from '../utils/dateInfo';
import { ExerciseChecklistInput } from './ExerciseChecklistInput';
import { useExerciseLog } from '../hooks/useExerciseLog';

type ExerciseChecklistProps = {
	dateInfo: DateInfo;
};

export function ExerciseChecklist(props: ExerciseChecklistProps) {
	const { exerciseLog, dayLog, updateDayExercise, removeDayExercise } =
		useExerciseLog(props.dateInfo.date);

	const checklist = getExerciseChecklistData(
		props.dateInfo,
		exerciseLog,
		dayLog
	);

	const isDisabled = ['future', 'tomorrow'].includes(props.dateInfo.category);

	return (
		<View className="w-96 flex gap-6">
			{checklist.map((item) => {
				return (
					<ExerciseChecklistInput
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
