import AsyncStorage from '@react-native-async-storage/async-storage'
import type { ExerciseDay, ExerciseLog } from '@/shared/EXERCISES'
import { getCurrentUserId } from '@/features/Account/authHelpers'
import { supabase } from './client'
import type { Json } from './database.types'
import { getPendingSync } from './syncState'

export async function fetchAllRemoteData(userId: string) {
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

export async function pushDayToRemote(userId: string, date: string, dayLog: ExerciseDay) {
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

export async function deleteDayFromRemote(userId: string, date: string) {
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

export async function syncAll() {
	const userId = await getCurrentUserId()
	if (!userId) return

	const remoteRows = await fetchAllRemoteData(userId)
	const localLogStr = await AsyncStorage.getItem('exerciseLog')
	const localLog: ExerciseLog = localLogStr ? JSON.parse(localLogStr) : {}
	const pendingSync = await getPendingSync()

	let hasChanges = false

	for (const row of remoteRows) {
		const date = row.day
		const remoteTimestamp = new Date(row.updated_at)
		const localTimestamp = pendingSync[date] ? new Date(pendingSync[date]) : null

		if (localTimestamp && localTimestamp > remoteTimestamp) {
			continue
		} else {
			localLog[date] = row.log as ExerciseDay
			delete pendingSync[date]
			hasChanges = true
		}
	}

	if (hasChanges) {
		await AsyncStorage.setItem('exerciseLog', JSON.stringify(localLog))
		await AsyncStorage.setItem('exerciseLogUpdatedAt', new Date().toISOString())
		await AsyncStorage.setItem('exerciseLogPendingSync', JSON.stringify(pendingSync))
	}

	for (const date of Object.keys(pendingSync)) {
		if (localLog[date]) {
			const success = await pushDayToRemote(userId, date, localLog[date])
			if (success) delete pendingSync[date]
		} else {
			const success = await deleteDayFromRemote(userId, date)
			if (success) delete pendingSync[date]
		}
	}

	await AsyncStorage.setItem('exerciseLogPendingSync', JSON.stringify(pendingSync))
}
