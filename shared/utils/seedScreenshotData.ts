import AsyncStorage from './asyncStorage';
import { STORAGE_KEYS } from './constants';
import type { ExerciseLog } from './constants';
import screenshotSampleData from '../../data/screenshot-sample.json';

/**
 * Converts relative date strings to actual YYYY-MM-DD date strings
 * Supports: "today", "yesterday", "-N" (days ago), "+N" (days from now)
 */
function convertRelativeDate(relativeDate: string): string {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (relativeDate === 'today') {
		return formatDate(today);
	}

	if (relativeDate === 'yesterday') {
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		return formatDate(yesterday);
	}

	// Handle numeric offsets like "-7", "+3"
	const match = relativeDate.match(/^([+-]?)(\d+)$/);
	if (match) {
		const sign = match[1] === '-' ? -1 : 1;
		const days = parseInt(match[2], 10);
		const targetDate = new Date(today);
		targetDate.setDate(targetDate.getDate() + sign * days);
		return formatDate(targetDate);
	}

	// If it's already a valid date string (YYYY-MM-DD), return as-is
	if (/^\d{4}-\d{2}-\d{2}$/.test(relativeDate)) {
		return relativeDate;
	}

	// Fallback: treat as today
	console.warn(`Unknown relative date format: ${relativeDate}, using today`);
	return formatDate(today);
}

function formatDate(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

/**
 * Seeds AsyncStorage with screenshot sample data
 * Converts relative dates in the sample data to actual dates
 */
export async function seedScreenshotData(): Promise<void> {
	// Load sample data (with relative dates)
	const sampleData = screenshotSampleData as Record<string, unknown>;

	// Convert relative dates to actual dates
	const exerciseLog: ExerciseLog = {};
	for (const [relativeDate, exercises] of Object.entries(sampleData)) {
		const actualDate = convertRelativeDate(relativeDate);
		exerciseLog[actualDate] = exercises as ExerciseLog[string];
	}

	// Clear existing data and write new data
	await AsyncStorage.setItem(
		STORAGE_KEYS.EXERCISE_LOG,
		JSON.stringify(exerciseLog),
	);

	// Clear pending sync to avoid sync conflicts
	await AsyncStorage.setItem(
		STORAGE_KEYS.EXERCISE_LOG_PENDING_SYNC,
		JSON.stringify({}),
	);

	console.log('[Screenshot] Seeded exercise log data');
}

/**
 * Clears exercise log - seeds empty data for screenshot 1 (empty home)
 */
export async function seedEmptyScreenshotData(): Promise<void> {
	const emptyLog: ExerciseLog = {};
	await AsyncStorage.setItem(
		STORAGE_KEYS.EXERCISE_LOG,
		JSON.stringify(emptyLog),
	);
	await AsyncStorage.setItem(
		STORAGE_KEYS.EXERCISE_LOG_PENDING_SYNC,
		JSON.stringify({}),
	);
	console.log('[Screenshot] Seeded empty exercise log');
}
