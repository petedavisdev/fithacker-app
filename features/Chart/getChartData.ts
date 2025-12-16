import type { Exercise, ExerciseItem, ExerciseLog } from '@/shared/EXERCISES';
import { EXERCISES } from '@/shared/EXERCISES';
import { getLastMonday, getDate } from '@/shared/dateInfo';
import { checkThisWeek, getWeekText } from './getWeekText';

export type ChartData = {
	days: ExerciseLog;
	text: string;
	total: number;
	badge: '🏅' | '🏆' | '';
};

function getExerciseType(item: ExerciseItem): Exercise {
	return typeof item === 'string' ? item : item[0];
}

function calculateBadge(days: ExerciseLog): '🏅' | '🏆' | '' {
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

	// Check if all exercise types appear at least twice
	const allAtLeastTwice = EXERCISES.every(
		(exercise) => exerciseCounts[exercise] >= 2,
	);
	if (allAtLeastTwice) {
		return '🏆';
	}

	// Check if all exercise types appear at least once
	const allAtLeastOnce = EXERCISES.every(
		(exercise) => exerciseCounts[exercise] >= 1,
	);
	if (allAtLeastOnce) {
		return '🏅';
	}

	return '';
}

export function getChartData(exerciseLog: ExerciseLog) {
	const firstDate = Object.keys(exerciseLog).sort()[0] ?? getDate();
	let date = getLastMonday(firstDate);

	const weeks: ChartData[] = [];

	const SAFE_LIMIT = 5000;

	for (let i = 0; i < SAFE_LIMIT; i++) {
		const days: ExerciseLog = {};

		for (let d = 1; d <= 7; d++) {
			days[date] = exerciseLog[date] ?? [];

			const currentDate = new Date(date);
			currentDate.setDate(currentDate.getDate() + 1);
			date = getDate(currentDate);
		}

		const dates = Object.keys(days);
		const text = getWeekText(dates);
		const total = Object.values(days).flat().length;
		const badge = calculateBadge(days);

		weeks.unshift({ days, text, total, badge });

		if (checkThisWeek(dates)) break;
	}

	return weeks;
}
