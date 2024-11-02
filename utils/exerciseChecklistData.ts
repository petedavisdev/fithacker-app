import {
	EXERCISES,
	type Exercise,
	EXERCISE_PRIORITIES,
	type ExerciseDay,
	type ExerciseLog,
} from '../constants/EXERCISES';
import { DateInfo } from './dateInfo';

export function getExerciseChecklistData(
	dateInfo: DateInfo,
	exerciseLog: ExerciseLog,
	dayLog: ExerciseDay
) {
	const dayCounts = getDayCounts(exerciseLog, dateInfo.date);
	const priorityEXERCISES = getPriorityEXERCISES(dayCounts);
	const isDisabled = ['future', 'tomorrow'].includes(dateInfo.category);

	return EXERCISES.map((exercise) => ({
		exercise,
		isChecked: dayLog.flat().includes(exercise),
		note: dayLog.find((item) => item[0] === exercise)?.[1],
		dayCount: dayCounts.find((count) => count[0] === exercise)?.[1],
		isPriority: priorityEXERCISES.includes(exercise),
		isDisabled,
	}));
}

function getDayCounts(
	exerciseLog: ExerciseLog,
	date: string
): [Exercise, number?][] {
	return EXERCISES.map((exercise) => [
		exercise,
		getDayCount(exercise, date, exerciseLog),
	]);
}

function getDayCount(
	exercise: Exercise,
	date: string,
	exerciseLog: ExerciseLog
) {
	const prevDate = Object.keys(exerciseLog)
		.filter(
			(key) => key < date && exerciseLog[key]?.flat().includes(exercise)
		)
		.sort()
		.at(-1);

	if (!prevDate) return;

	const time = new Date(date).getTime();
	const prevTime = new Date(prevDate).getTime();

	return Math.floor((time - prevTime) / (1000 * 60 * 60 * 24));
}

function getPriorityEXERCISES(dayCounts: [Exercise, number?][]) {
	return dayCounts
		.sort(
			(countA, countB) =>
				(countB[1] ?? 1000) +
				EXERCISE_PRIORITIES[countB[0] as Exercise] -
				((countA[1] ?? 1000) +
					EXERCISE_PRIORITIES[countA[0] as Exercise])
		)
		.map((count) => count[0] as Exercise)
		.slice(0, 2);
}
