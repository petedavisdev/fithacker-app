import {
	hasPendingSyncKey,
	getExerciseLog,
	addToPendingSync,
	clearSyncState,
} from './syncState';

/**
 * Migrates existing exerciseLog data to pendingSync format.
 * This runs once at app startup if the migration hasn't been done yet.
 */
export async function runMigration(): Promise<void> {
	const hasKey = await hasPendingSyncKey();
	if (hasKey) {
		// Migration already done
		return;
	}

	const exerciseLog = await getExerciseLog();

	if (Object.keys(exerciseLog).length > 0) {
		// Migrate all existing dates to pending sync
		for (const date of Object.keys(exerciseLog)) {
			// Use end of day (23:59:59.999Z) as timestamp - assumes data was edited late in the day
			// This prevents remote data from the same day (edited earlier) from overwriting local,
			// but allows remote data from later days to win
			const timestamp = new Date(date + 'T23:59:59.999Z').toISOString();
			await addToPendingSync(date, timestamp);
		}
	} else {
		// No exercise log, just initialize empty pending sync
		await clearSyncState();
	}
}
