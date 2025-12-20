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
	const now = new Date().toISOString();

	if (Object.keys(exerciseLog).length > 0) {
		// Migrate all existing dates to pending sync
		for (const date of Object.keys(exerciseLog)) {
			await addToPendingSync(date, now);
		}
	} else {
		// No exercise log, just initialize empty pending sync
		await clearSyncState();
	}
}
