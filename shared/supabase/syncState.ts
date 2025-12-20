import AsyncStorage from '@/shared/utils/asyncStorage';
import { STORAGE_KEYS } from '@/shared/utils/constants';

export type PendingSync = Record<string, string>; // { date: timestamp }

export async function getPendingSync(): Promise<PendingSync> {
	const value = await AsyncStorage.getItem(
		STORAGE_KEYS.EXERCISE_LOG_PENDING_SYNC,
	);
	return value ? JSON.parse(value) : {};
}

export async function addToPendingSync(
	date: string,
	timestamp: string,
): Promise<void> {
	const pending = await getPendingSync();
	pending[date] = timestamp;
	await AsyncStorage.setItem(
		STORAGE_KEYS.EXERCISE_LOG_PENDING_SYNC,
		JSON.stringify(pending),
	);
}

export async function clearSyncState(): Promise<void> {
	// Called on sign-out - set to empty, don't remove key (preserves migration state)
	await AsyncStorage.setItem(STORAGE_KEYS.EXERCISE_LOG_PENDING_SYNC, '{}');
}

export async function hasPendingSyncKey(): Promise<boolean> {
	// Check if migration has been done (key exists)
	const value = await AsyncStorage.getItem(
		STORAGE_KEYS.EXERCISE_LOG_PENDING_SYNC,
	);
	return value !== null;
}

export async function getExerciseLog(): Promise<Record<string, unknown>> {
	const value = await AsyncStorage.getItem(STORAGE_KEYS.EXERCISE_LOG);
	return value ? JSON.parse(value) : {};
}
