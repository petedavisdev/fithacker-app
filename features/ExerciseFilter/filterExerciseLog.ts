import type { ExerciseCode, ExerciseDay, ExerciseLog } from '../EXERCISES';

export function filterExerciseLog(
	exerciseLog: ExerciseLog,
	filter?: ExerciseCode,
): ExerciseLog {
	if (!filter) return exerciseLog;

	return Object.fromEntries(
		Object.entries(exerciseLog).map(([date, exerciseDay]) => {
			if (!exerciseDay) return [date, {}];
			const filteredDay: ExerciseDay = {};
			if (filter in exerciseDay) {
				filteredDay[filter] = exerciseDay[filter];
			}
			return [date, filteredDay];
		}),
	);
}