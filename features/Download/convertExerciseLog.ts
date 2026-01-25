import type { ExerciseItem, ExerciseLog } from '@/shared/utils/constants';

/**
 * Escapes a CSV field value, wrapping in quotes if necessary
 */
function escapeCsvField(value: string): string {
	// If value contains comma, quote, or newline, wrap in quotes and escape quotes
	if (value.includes(',') || value.includes('"') || value.includes('\n')) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

/**
 * Converts an ExerciseLog to CSV format
 * Format: Date,Exercise,Note
 * One row per exercise entry
 */
export function convertExerciseLogToCsv(exerciseLog: ExerciseLog): string {
	const rows: string[] = ['Date,Exercise,Note'];

	// Sort dates chronologically
	const sortedDates = Object.keys(exerciseLog).sort((a, b) => {
		return new Date(a).getTime() - new Date(b).getTime();
	});

	for (const date of sortedDates) {
		const exerciseDay = exerciseLog[date];
		if (!exerciseDay || exerciseDay.length === 0) {
			continue;
		}

		for (const exerciseItem of exerciseDay) {
			if (typeof exerciseItem === 'string') {
				// Just an exercise emoji, no note
				rows.push(`${date},${exerciseItem},`);
			} else if (Array.isArray(exerciseItem) && exerciseItem.length === 2) {
				// Exercise with note: [Exercise, string]
				const [exercise, note] = exerciseItem;
				rows.push(`${date},${exercise},${escapeCsvField(note)}`);
			}
		}
	}

	return rows.join('\n');
}

/**
 * Formats an ExerciseLog as pretty-printed JSON
 */
export function formatExerciseLogAsJson(exerciseLog: ExerciseLog): string {
	return JSON.stringify(exerciseLog, null, 2);
}
