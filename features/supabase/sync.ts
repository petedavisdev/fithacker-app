import AsyncStorage from '@react-native-async-storage/async-storage'
import type { ExerciseDay, ExerciseLog } from '../EXERCISES'
import { getCurrentUserId } from './auth'
import { supabase } from './client'
import type { Database } from './database.types'
import { getPendingSync } from './syncState'

type ExerciseLogRow = Database['public']['Tables']['exercise_logs']['Row']
type ExerciseLogInsert = Database['public']['Tables']['exercise_logs']['Insert']

export async function fetchAllRemoteData(
	userId: string,
): Promise<ExerciseLogRow[]> {
	const { data, error } = await supabase
		.from('exercise_logs')
		.select('*')
		.eq('user_id', userId)

	if (error) {
		console.error('Failed to fetch remote data:', error)
		return []
	}

	return data ?? []
}

export async function pushDayToRemote(
	userId: string,
	date: string,
	dayLog: ExerciseDay,
): Promise<boolean> {
	const row: ExerciseLogInsert = {
		user_id: userId,
		day: date,
		log: dayLog as any, // JSONB - same format as client
	}

	const { error } = await supabase.from('exercise_logs').upsert(row)

	if (error) {
		console.error('Failed to push day to remote:', error)
		return false
	}

	return true
}

export async function deleteDayFromRemote(
	userId: string,
	date: string,
): Promise<boolean> {
	const { error } = await supabase
		.from('exercise_logs')
		.delete()
		.eq('user_id', userId)
		.eq('day', date)

	if (error) {
		console.error('Failed to delete day from remote:', error)
		return false
	}

	return true
}

export async function syncAll(): Promise<void> {
	const userId = await getCurrentUserId()
	if (!userId) {
		// Not logged in, skip sync
		return
	}

	// 1. Fetch ALL remote data
	const remoteRows = await fetchAllRemoteData(userId)

	// 2. Load local data and pending changes
	const localLogStr = await AsyncStorage.getItem('exerciseLog')
	const localLog: ExerciseLog = localLogStr ? JSON.parse(localLogStr) : {}
	const pendingSync = await getPendingSync()

	// 3. Process: Compare timestamps, newer wins
	let hasChanges = false

	for (const row of remoteRows) {
		const date = row.day
		const remoteTimestamp = new Date(row.updated_at)
		const localTimestamp = pendingSync[date]
			? new Date(pendingSync[date])
			: null

		if (localTimestamp && localTimestamp > remoteTimestamp) {
			// Local is newer - skip (will push later)
			continue
		} else {
			// Remote is newer OR no local changes - use remote
			localLog[date] = row.log as ExerciseDay
			delete pendingSync[date]
			hasChanges = true
		}
	}

	// 4. Save if we got newer data from remote
	if (hasChanges) {
		await AsyncStorage.setItem('exerciseLog', JSON.stringify(localLog))
		await AsyncStorage.setItem(
			'exerciseLogUpdatedAt',
			new Date().toISOString(),
		)
		await AsyncStorage.setItem(
			'exerciseLogPendingSync',
			JSON.stringify(pendingSync),
		)
	}

	// 5. Push pending changes to remote
	const pendingDates = Object.keys(pendingSync)
	for (const date of pendingDates) {
		if (localLog[date]) {
			// Day exists locally: upsert
			const success = await pushDayToRemote(userId, date, localLog[date])
			if (success) {
				delete pendingSync[date]
			}
		} else {
			// Day deleted locally: DELETE from remote
			const success = await deleteDayFromRemote(userId, date)
			if (success) {
				delete pendingSync[date]
			}
		}
	}

	// 6. Update pending sync state
	await AsyncStorage.setItem(
		'exerciseLogPendingSync',
		JSON.stringify(pendingSync),
	)
}

