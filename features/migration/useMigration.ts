/**
 * MIGRATION HOOK - CAN BE REMOVED AFTER [DATE]
 * 
 * Migration Strategy:
 * 1. Reads old `exerciseLog` data
 * 2. Transforms to new format
 * 3. Saves to `exerciseLogV2`
 * 4. Sets `exerciseLogMigrated` flag
 * 5. Deletes old `exerciseLog` key immediately after successful migration
 * 
 * Error Handling:
 * - On migration failure, does NOT mark as migrated (allows retry on next app load)
 * - Returns `isLoading`, `isMigrated`, and `error` states
 * - App routes show loading spinner during migration
 * - App routes show error message if migration fails (prevents data loss)
 * 
 * Cleanup Plan (after all users migrated):
 * 1. Wait for 100% migration (check analytics/usage data)
 * 2. Remove features/migration/ folder
 * 3. Remove useMigration() calls from app routes (app/index.tsx, app/chart.tsx)
 * 4. Remove EXERCISES.old.ts file
 * 5. Remove `exerciseLogMigrated` flag via cleanup script (optional - can be left as harmless)
 * 
 * The old `exerciseLog` key is already deleted during migration, so no cleanup needed.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import type { ExerciseLog as OldExerciseLog } from '../EXERCISES.old';
import type { ExerciseLog } from '../EXERCISES';
import { transformExerciseLog } from './transformExerciseLog';

export function useMigration() {
	const [isMigrated, setIsMigrated] = useState<boolean | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		(async () => {
			try {
				setError(null);
				
				// Check if migration has already been completed
				const migrationFlag = await AsyncStorage.getItem('exerciseLogMigrated');
				if (migrationFlag === 'true') {
					setIsMigrated(true);
					return;
				}

				// Check if old data exists
				const oldLogJSON = await AsyncStorage.getItem('exerciseLog');
				if (!oldLogJSON) {
					// No old data, mark as migrated (new user)
					await AsyncStorage.setItem('exerciseLogMigrated', 'true');
					setIsMigrated(true);
					return;
				}

				// Parse old data
				const oldLog = JSON.parse(oldLogJSON) as OldExerciseLog;

				// Transform to new format
				const newLog = transformExerciseLog(oldLog);

				// Save new format
				await AsyncStorage.setItem('exerciseLogV2', JSON.stringify(newLog));

				// Mark migration as complete
				await AsyncStorage.setItem('exerciseLogMigrated', 'true');

				// Delete old log after successful migration
				// Keep migration flag for tracking purposes
				await AsyncStorage.removeItem('exerciseLog');

				setIsMigrated(true);
			} catch (err) {
				const migrationError = err instanceof Error ? err : new Error(String(err));
				console.error('Migration failed:', migrationError);
				setError(migrationError);
				// On error, DON'T mark as migrated - allow retry on next app load
				setIsMigrated(false);
			}
		})();
	}, []);

	const isLoading = isMigrated === null;
	const canRetry = isMigrated === false && error !== null;

	return { 
		isMigrated: isMigrated === true, 
		isLoading,
		error: canRetry ? error : null,
	};
}
