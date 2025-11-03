import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import type { ExerciseCode, ExerciseDay, ExerciseLog } from './EXERCISES';

export function useExerciseLog(date?: string) {
	const [exerciseLog, setExerciseLog] = useState<ExerciseLog>({});

	const dayLog: ExerciseDay = date ? (exerciseLog[date] ?? {}) : {};

	function updateDayExercise(exercise: ExerciseCode, note?: string) {
		if (!date) return;

		const newDayExercises: ExerciseDay = {
			...dayLog,
			[exercise]: note ?? '',
		};

		setExerciseLog((prev) => {
			const newLog = {
				...prev,
				[date]: newDayExercises,
			};
			storeExerciseLog(newLog);
			return newLog;
		});
	}

	function removeDayExercise(exercise: ExerciseCode) {
		if (!date) return;

		const { [exercise]: _, ...newDayExercises } = dayLog;

		if (Object.keys(newDayExercises).length) {
			setExerciseLog((prev) => {
				const newLog = {
					...prev,
					[date]: newDayExercises,
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
		await AsyncStorage.setItem('exerciseLogV2', JSON.stringify(exerciseLog));
		await AsyncStorage.setItem(
			'exerciseLogUpdatedAt',
			new Date().toISOString(),
		);
	}

	useEffect(() => {
		(async () => {
			const exerciseLogJSON = await AsyncStorage.getItem('exerciseLogV2');
			const exerciseLogData = exerciseLogJSON
				? JSON.parse(exerciseLogJSON)
				: ({} as ExerciseLog);

			setExerciseLog(exerciseLogData);
		})();
	}, []);

	return { exerciseLog, dayLog, updateDayExercise, removeDayExercise };
}