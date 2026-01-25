import type { Exercise, ExerciseItem, ExerciseLog, Badge } from './constants';
import { EXERCISES, BADGES } from './constants';

function getExerciseType(item: ExerciseItem): Exercise {
	return typeof item === 'string' ? item : item[0];
}

/**
 * Calculate badges for a week's exercise log.
 * 1x = all exercises once, 2x = all exercises twice
 */
export function calculateBadges(days: ExerciseLog): Badge[] {
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

	// Solo mode: 1x and 2x badges
	const allAtLeastOnce = EXERCISES.every(
		(exercise) => exerciseCounts[exercise] >= 1,
	);
	if (allAtLeastOnce) {
		badges.push(BADGES[1]);
	}

	const allAtLeastTwice = EXERCISES.every(
		(exercise) => exerciseCounts[exercise] >= 2,
	);
	if (allAtLeastTwice) {
		badges.push(BADGES[2]);
	}

	return badges;
}
