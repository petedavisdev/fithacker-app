import AsyncStorage from '@/shared/utils/asyncStorage';
import type { ExerciseDay, ExerciseLog } from '@/shared/utils/constants'
import { getCurrentUserId } from '@/features/Account/authHelpers'
import { supabase } from './client'
import type { Json } from './database.types'
import { getPendingSync } from './syncState'
import { STORAGE_KEYS } from '@/shared/utils/constants'

async function fetchAllRemoteData(userId: string) {
	const { data, error } = await supabase
		.from('exercise_logs')
		.select('*')
		.eq('user_id', userId)

	if (error) throw error

	return data ?? []
}

async function pushDayToRemote(userId: string, date: string, dayLog: ExerciseDay) {
	const { error } = await supabase.from('exercise_logs').upsert({
		user_id: userId,
		day: date,
		log: dayLog as Json,
	})

	if (error) {
		console.error('Failed to push day to remote:', error)
		return false
	}

	return true
}

/**
 * Syncs local data with remote Supabase.
 * 1. Pull: Fetch remote, update local if remote is newer
 * 2. Push: Push local changes that are newer than remote
 * 3. Clear pendingSync for successfully synced dates
 */
export async function syncAll(): Promise<boolean> {
	const userId = await getCurrentUserId()
	if (!userId) return false

	const remoteRows = await fetchAllRemoteData(userId)
	const localLogStr = await AsyncStorage.getItem(STORAGE_KEYS.EXERCISE_LOG)
	const localLog: ExerciseLog = localLogStr ? JSON.parse(localLogStr) : {}
	const pendingSync = await getPendingSync()

	// Pull phase: Update local with newer remote data
	let hasLocalChanges = false
	for (const row of remoteRows) {
		const date = row.day
		const remoteTimestamp = new Date(row.updated_at)
		const localTimestamp = pendingSync[date] ? new Date(pendingSync[date]) : null

		if (localTimestamp && localTimestamp > remoteTimestamp) {
			// Local is newer - keep in pendingSync to push later
			continue
		} else {
			// Remote is newer or equal - pull it and clear from pendingSync
			localLog[date] = row.log as ExerciseDay
			delete pendingSync[date]
			hasLocalChanges = true
		}
	}

	if (hasLocalChanges) {
		await AsyncStorage.setItem(STORAGE_KEYS.EXERCISE_LOG, JSON.stringify(localLog))
	}

	// Push phase: Push local changes to remote
	for (const date of Object.keys(pendingSync)) {
		const dayLog = localLog[date] ?? []
		const success = await pushDayToRemote(userId, date, dayLog)
		if (success) delete pendingSync[date]
	}

	// Always save pendingSync (clears successfully synced dates)
	await AsyncStorage.setItem(STORAGE_KEYS.EXERCISE_LOG_PENDING_SYNC, JSON.stringify(pendingSync))
	return true
}
