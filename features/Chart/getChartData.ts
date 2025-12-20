import type {
	Exercise,
	ExerciseItem,
	ExerciseLog,
	Badge,
} from '@/shared/utils/constants';
import { EXERCISES } from '@/shared/utils/constants';
import { getLastMonday, getDate } from '@/shared/utils/dateInfo';
import { checkThisWeek, getWeekText } from './getWeekText';
import { LIMITS, BADGES, DAYS } from '@/shared/utils/constants';

export type ChartData = {
	days: ExerciseLog;
	text: string;
	total: number;
	badges: Badge[];
};

function getExerciseType(item: ExerciseItem): Exercise {
	return typeof item === 'string' ? item : item[0];
}

function calculateBadges(days: ExerciseLog): Badge[] {
	// Flatten all exercises from all days in the week
	const allExercises: ExerciseItem[] = [];
	for (const dayExercises of Object.values(days)) {
		if (dayExercises) {
			allExercises.push(...dayExercises);
		}
	}

	// Count occurrences of each exercise type
	const exerciseCounts: Record<Exercise, number> = {
		'🚶': 0,
		'🏃‍♀️': 0,
		'🤸': 0,
		'💪': 0,
		'🌴': 0,
		'🦵': 0,
	};

	for (const item of allExercises) {
		const exerciseType = getExerciseType(item);
		exerciseCounts[exerciseType]++;
	}

	const badges: Badge[] = [];

	// Check if all exercise types appear at least once
	const allAtLeastOnce = EXERCISES.every(
		(exercise) => exerciseCounts[exercise] >= 1,
	);
	if (allAtLeastOnce) {
		badges.push(BADGES[1]);
	}

	// Check if all exercise types appear at least twice
	const allAtLeastTwice = EXERCISES.every(
		(exercise) => exerciseCounts[exercise] >= 2,
	);
	if (allAtLeastTwice) {
		badges.push(BADGES[2]);
	}

	return badges;
}

export function getChartData(exerciseLog: ExerciseLog) {
	const firstDate = Object.keys(exerciseLog).sort()[0] ?? getDate();
	let date = getLastMonday(firstDate);

	const weeks: ChartData[] = [];

	for (let i = 0; i < LIMITS.CHART_WEEKS_SAFE_LIMIT; i++) {
		const days: ExerciseLog = {};

		for (let d = 1; d <= DAYS.PER_WEEK; d++) {
			days[date] = exerciseLog[date] ?? [];

			const currentDate = new Date(date);
			currentDate.setDate(currentDate.getDate() + 1);
			date = getDate(currentDate);
		}

		const dates = Object.keys(days);
		const text = getWeekText(dates);
		const total = Object.values(days).flat().length;
		const badges = calculateBadges(days);

		weeks.unshift({ days, text, total, badges });

		if (checkThisWeek(dates)) break;
	}

	return weeks;
}
