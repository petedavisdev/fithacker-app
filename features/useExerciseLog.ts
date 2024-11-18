import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
	type Exercise,
	type ExerciseItem,
	type ExerciseLog,
	EXERCISES,
} from './EXERCISES';

export function useExerciseLog(date?: string) {
	const [exerciseLog, setExerciseLog] = useState<ExerciseLog>({});

	const dayLog = date ? exerciseLog[date] ?? [] : [];

	function updateDayExercise(exercise: Exercise, note?: string) {
		if (!date) return;

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
			const newLog = {
				...prev,
				[date]: newDayExercises,
			};
			storeExerciseLog(newLog);
			return newLog;
		});
	}

	function removeDayExercise(exercise: Exercise) {
		if (!date) return;

		const newDayExercises = dayLog.filter(
			(item) => item !== exercise && item[0] !== exercise
		);

		if (newDayExercises.length) {
			setExerciseLog((prev) => {
				const newLog = {
					...prev,
					[date]: newDayExercises.length
						? newDayExercises
						: undefined,
				};
				storeExerciseLog(newLog);
				return newLog;
			});
		} else {
			setExerciseLog((prev) => {
				const { [date]: _, ...rest } = prev;
				const newLog = { ...rest };
				storeExerciseLog(newLog);
				return newLog;
			});
		}
	}

	async function storeExerciseLog(exerciseLog: ExerciseLog = {}) {
		await AsyncStorage.setItem('exerciseLog', JSON.stringify(exerciseLog));
		await AsyncStorage.setItem(
			'exerciseLogUpdatedAt',
			new Date().toISOString()
		);
	}

	useEffect(() => {
		(async () => {
			const exerciseLogJSON = await AsyncStorage.getItem('exerciseLog');
			const exerciseLogData = exerciseLogJSON
				? JSON.parse(exerciseLogJSON)
				: ({} as ExerciseLog);

			setExerciseLog(exerciseLogData);
		})();
	}, []);

	return { exerciseLog, dayLog, updateDayExercise, removeDayExercise };
}
