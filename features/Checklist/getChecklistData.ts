import {
	EXERCISE_CODES,
	type ExerciseCode,
	EXERCISE_METADATA,
	type ExerciseDay,
	type ExerciseLog,
} from '../EXERCISES';
import { DateInfo } from '../dateInfo';

export function getChecklistData(
	dateInfo: DateInfo,
	exerciseLog: ExerciseLog,
	dayLog: ExerciseDay,
) {
	const dayCounts = getDayCounts(exerciseLog, dateInfo.date);
	const priorityExercises = getPriorityExercises(dayCounts);

	return EXERCISE_CODES.map((code) => ({
		exercise: code,
		isChecked: code in dayLog,
		note: dayLog[code] === '' ? undefined : dayLog[code],
		dayCount: dayCounts.find((count) => count[0] === code)?.[1],
		isPriority: priorityExercises.includes(code),
	}));
}

function getDayCounts(
	exerciseLog: ExerciseLog,
	date: string,
): [ExerciseCode, number?][] {
	return EXERCISE_CODES.map((code) => [
		code,
		getDayCount(code, date, exerciseLog),
	]);
}

function getDayCount(
	exercise: ExerciseCode,
	date: string,
	exerciseLog: ExerciseLog,
) {
	const prevDate = Object.keys(exerciseLog)
		.filter((key) => key < date && exercise in (exerciseLog[key] ?? {}))
		.sort()
		.at(-1);

	if (!prevDate) return;

	const time = new Date(date).getTime();
	const prevTime = new Date(prevDate).getTime();

	return Math.floor((time - prevTime) / (1000 * 60 * 60 * 24));
}

function getPriorityExercises(dayCounts: [ExerciseCode, number?][]) {
	return dayCounts
		.sort(
			(countA, countB) =>
				(countB[1] ?? 1000) +
				EXERCISE_METADATA[countB[0]].priority -
				((countA[1] ?? 1000) + EXERCISE_METADATA[countA[0]].priority),
		)
		.map((count) => count[0])
		.slice(0, 2);
}