import React, { useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import {
	EXERCISES,
	type Exercise,
	type ExerciseItem,
	type ExerciseLog,
} from '../constants/EXERCISES';
import { getExerciseChecklistData } from '../utils/exerciseChecklistData';
import { getExerciseLog, storeExerciseLog } from '../utils/exerciseLog';
import { type DateInfo } from '../utils/dateInfo';
import { ExerciseChecklistInput } from './ExerciseChecklistInput';

type ExerciseChecklistProps = {
	dateInfo: DateInfo;
};

export function ExerciseChecklist(props: ExerciseChecklistProps) {
	const [exerciseLog, setExerciseLog] = useState<ExerciseLog>({});

	const dayLog = exerciseLog[props.dateInfo.date?.toString()] ?? [];
	const checklist = getExerciseChecklistData(
		props.dateInfo,
		exerciseLog,
		dayLog
	);

	function updateDayExercise(exercise: Exercise, note?: string) {
		const newDayExercises = [
			...dayLog.filter(
				(item) => item !== exercise && item[0] !== exercise
			),
			(note ? [exercise, note] : exercise) as ExerciseItem,
		].sort((a: ExerciseItem, b: ExerciseItem) => {
			const exerciseA = typeof a === 'string' ? a : a[0];
			const exerciseB = typeof b === 'string' ? b : b[0];
			return EXERCISES.indexOf(exerciseA) - EXERCISES.indexOf(exerciseB);
		});

		setExerciseLog((prev) => {
			const newLog = { ...prev, [props.dateInfo.date]: newDayExercises };
			storeExerciseLog(newLog);
			return newLog;
		});
	}

	function removeDayExercise(exercise: Exercise) {
		const newDayExercises = dayLog.filter(
			(item) => item !== exercise && item[0] !== exercise
		);

		if (newDayExercises.length) {
			setExerciseLog((prev) => {
				const newLog = {
					...prev,
					[props.dateInfo.date]: newDayExercises.length
						? newDayExercises
						: undefined,
				};
				storeExerciseLog(newLog);
				return newLog;
			});
		} else {
			setExerciseLog((prev) => {
				const { [props.dateInfo.date]: _, ...rest } = prev;
				const newLog = { ...rest };
				storeExerciseLog(newLog);
				return newLog;
			});
		}
	}

	useEffect(() => {
		(async () => {
			setExerciseLog(await getExerciseLog());
		})();
	}, []);

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
						isDisabled={item.isDisabled}
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
