import type { ExerciseLog, Badge } from './constants';
import { getLastMonday } from './dateInfo';
import { DAYS } from './constants';
import { calculateBadges } from './calculateBadges';

export type ThisWeekData = {
	days: ExerciseLog;
	count: number;
	badges: Badge[];
};

/**
 * Extract this week's data from an exercise log.
 * Returns { days, count, badges } for current week.
 * Uses getLastMonday() to determine week boundaries.
 */
export function getThisWeekData(log: ExerciseLog): ThisWeekData {
	const monday = getLastMonday();
	const days: ExerciseLog = {};

	// Get all dates from Monday to Sunday (7 days)
	let currentDate = new Date(monday);
	for (let d = 0; d < DAYS.PER_WEEK; d++) {
		const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
		days[dateStr] = log[dateStr] ?? [];

		currentDate.setDate(currentDate.getDate() + 1);
	}

	// Calculate total count of all exercises this week
	const count = Object.values(days).flat().length;

	// Calculate badges using shared utility
	const badges = calculateBadges(days);

	return { days, count, badges };
}
