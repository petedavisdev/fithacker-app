import type {
	ExerciseLog,
	Exercise,
	ExerciseItem,
} from '@/shared/utils/constants';
import { EXERCISES } from '@/shared/utils/constants';

export type ValidationResult =
	| { valid: true; timestamp: string; data: ExerciseLog }
	| { valid: false; error: string };

/**
 * Extracts timestamp from filename like:
 * - fithacker-data-2026-01-24T12-30-00.json (hyphen format, preferred)
 * - fithacker-data-2026-01-24T12:30:00.json (colon format, for compatibility)
 */
function extractTimestampFromFilename(filename: string): string | null {
	// Match with consistent separators: all hyphens OR all colons
	const hyphenMatch = filename.match(
		/fithacker-data-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})\.json$/,
	);
	const colonMatch = filename.match(
		/fithacker-data-(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})\.json$/,
	);

	const match = hyphenMatch || colonMatch;
	if (!match) return null;

	// Replace hyphens with colons in time part if needed
	const timestamp = match[1].replace(/T(\d{2})-(\d{2})-(\d{2})/, 'T$1:$2:$3');

	// Validate it's a valid ISO date
	const date = new Date(timestamp);
	if (isNaN(date.getTime())) return null;

	return date.toISOString();
}

/**
 * Validates that the exercise item is valid
 */
function isValidExerciseItem(item: unknown): item is ExerciseItem {
	if (typeof item === 'string') {
		return EXERCISES.includes(item as Exercise);
	}
	if (Array.isArray(item) && item.length === 2) {
		const [exercise, note] = item;
		return EXERCISES.includes(exercise as Exercise) && typeof note === 'string';
	}
	return false;
}

/**
 * Validates that the data structure matches ExerciseLog format
 */
function validateExerciseLogStructure(data: unknown): data is ExerciseLog {
	if (typeof data !== 'object' || data === null) return false;

	const log = data as Record<string, unknown>;

	for (const [date, value] of Object.entries(log)) {
		// Date should be YYYY-MM-DD format
		if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

		// Value should be array of exercise items or undefined
		if (value === undefined) continue;
		if (!Array.isArray(value)) return false;

		// Each item should be valid exercise item
		for (const item of value) {
			if (!isValidExerciseItem(item)) return false;
		}
	}

	return true;
}

/**
 * Validates uploaded file and extracts data
 */
export function validateUpload(
	filename: string,
	content: string,
): ValidationResult {
	// Validate filename and extract timestamp
	const timestamp = extractTimestampFromFilename(filename);
	if (!timestamp) {
		return {
			valid: false,
			error:
				'Invalid filename. Expected format: fithacker-data-YYYY-MM-DDTHH:MM:SS.json',
		};
	}

	// Parse JSON
	let parsed: unknown;
	try {
		parsed = JSON.parse(content);
	} catch {
		return {
			valid: false,
			error: 'Invalid JSON file',
		};
	}

	// Validate structure
	if (!validateExerciseLogStructure(parsed)) {
		return {
			valid: false,
			error: 'Invalid exercise log format',
		};
	}

	return {
		valid: true,
		timestamp,
		data: parsed,
	};
}
