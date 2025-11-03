import type { ExerciseLog as OldExerciseLog } from '../EXERCISES.old';
import type { ExerciseLog, ExerciseCode } from '../EXERCISES';

const EMOJI_TO_CODE: Record<string, ExerciseCode> = {
	'🚶': 'a',
	'🏃‍♀️': 'b',
	'🤸': 'c',
	'💪': 'd',
	'🌴': 'e',
	'🦵': 'f',
};

/**
 * Pure function to transform old emoji-based array format to new code-based object format.
 * Handles corrupted data gracefully by skipping invalid entries.
 *
 * @param oldLog - Exercise log in old format
 * @returns Exercise log in new format
 */
export function transformExerciseLog(oldLog: OldExerciseLog): ExerciseLog {
	const newLog: ExerciseLog = {};

	for (const [date, dayData] of Object.entries(oldLog)) {
		// Skip undefined days
		if (dayData === undefined) {
			newLog[date] = {};
			continue;
		}

		// Skip non-array day values
		if (!Array.isArray(dayData)) {
			newLog[date] = {};
			continue;
		}

		const newDay: Record<ExerciseCode, string> = {} as Record<
			ExerciseCode,
			string
		>;

		for (const item of dayData) {
			// Skip null or undefined items
			if (item === null || item === undefined) {
				continue;
			}

			let exercise: string;
			let note: string | undefined;

			if (typeof item === 'string') {
				// Simple exercise string (no note)
				exercise = item;
				note = undefined;
			} else if (Array.isArray(item) && item.length >= 1) {
				// Array format: [exercise, note?]
				exercise = item[0];
				note = item.length >= 2 ? String(item[1]) : undefined;
			} else {
				// Invalid item format, skip
				continue;
			}

			// Skip unknown emojis
			const code = EMOJI_TO_CODE[exercise];
			if (!code) {
				continue;
			}

			// Convert note to string if needed, use empty string if no note
			newDay[code] = note !== undefined ? String(note) : '';
		}

		newLog[date] = newDay;
	}

	return newLog;
}
