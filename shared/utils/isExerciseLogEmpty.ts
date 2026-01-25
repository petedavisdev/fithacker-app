import type { ExerciseLog } from './constants';

/**
 * Checks if the exercise log has no actual exercise data
 * Returns true if:
 * - exerciseLog is null/undefined
 * - No dates exist in the log
 * - All days are empty or undefined
 */
export function isExerciseLogEmpty(
	exerciseLog: ExerciseLog | null | undefined,
): boolean {
	if (!exerciseLog) return true;

	const dates = Object.keys(exerciseLog);
	if (dates.length === 0) return true;

	return Object.values(exerciseLog).every(
		(day) => !day || (Array.isArray(day) && day.length === 0),
	);
}
