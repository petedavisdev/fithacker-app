import type { Exercise, ExerciseLog } from '../EXERCISES';

export function filterExerciseLog(exerciseLog: ExerciseLog, filter?: Exercise) {
	if (!filter) return exerciseLog;

	return Object.fromEntries(
		Object.entries(exerciseLog).map(([date, exerciseDay]) => [
			date,
			exerciseDay?.filter(
				(exerciseItem) => exerciseItem === filter || exerciseItem[0] === filter,
			),
		]),
	);
}
