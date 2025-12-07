import AsyncStorage from '@react-native-async-storage/async-storage'

const PENDING_SYNC_KEY = 'exerciseLogPendingSync'

export type PendingSync = Record<string, string> // { date: timestamp }

export async function getPendingSync(): Promise<PendingSync> {
	const value = await AsyncStorage.getItem(PENDING_SYNC_KEY)
	return value ? JSON.parse(value) : {}
}

export async function addToPendingSync(
	date: string,
	timestamp: string,
): Promise<void> {
	const pending = await getPendingSync()
	pending[date] = timestamp
	await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(pending))
}

export async function removeFromPendingSync(date: string): Promise<void> {
	const pending = await getPendingSync()
	delete pending[date]
	await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(pending))
}

export async function clearPendingSync(): Promise<void> {
	// Set to empty object, never remove key (preserves migration state)
	await AsyncStorage.setItem(PENDING_SYNC_KEY, '{}')
}

export async function clearSyncState(): Promise<void> {
	// Called on sign-out - set to empty, don't remove
	await AsyncStorage.setItem(PENDING_SYNC_KEY, '{}')
}

export async function hasPendingSyncKey(): Promise<boolean> {
	// Check if migration has been done (key exists)
	const value = await AsyncStorage.getItem(PENDING_SYNC_KEY)
	return value !== null
}

