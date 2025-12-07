import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
	type Exercise,
	type ExerciseItem,
	type ExerciseDay,
	type ExerciseLog,
	EXERCISES,
} from './EXERCISES';
import { addToPendingSync, hasPendingSyncKey } from './supabase/syncState';
import {
	deleteDayFromRemote,
	pushDayToRemote,
} from './supabase/sync';
import { getCurrentUserId, isLoggedIn } from './supabase/auth';
import { useNetworkStatus } from './supabase/useNetworkStatus';
import { useBackgroundSync } from './supabase/useBackgroundSync';

export function useExerciseLog(date?: string) {
	const [exerciseLog, setExerciseLog] = useState<ExerciseLog>({});
	const { isOnline } = useNetworkStatus();
	useBackgroundSync(); // Activates background sync if logged in

	const dayLog = date ? (exerciseLog[date] ?? []) : [];

	async function updateDayExercise(exercise: Exercise, note?: string) {
		if (!date) return;

		const newDayExercises = [
			...dayLog.filter((item) => item !== exercise && item[0] !== exercise),
			(note ? [exercise, note] : exercise) as ExerciseItem,
		].sort((a: ExerciseItem, b: ExerciseItem) => {
			const exerciseA = typeof a === 'string' ? a : a[0];
			const exerciseB = typeof b === 'string' ? b : b[0];
			return EXERCISES.indexOf(exerciseA) - EXERCISES.indexOf(exerciseB);
		});

		setExerciseLog((prev) => {
			const newLog = {
				...prev,
				[date]: newDayExercises,
			};
			storeExerciseLog(newLog, date, newDayExercises);
			return newLog;
		});
	}

	async function removeDayExercise(exercise: Exercise) {
		if (!date) return;

		const newDayExercises = dayLog.filter(
			(item) => item !== exercise && item[0] !== exercise,
		);

		if (newDayExercises.length) {
			setExerciseLog((prev) => {
				const newLog = {
					...prev,
					[date]: newDayExercises.length ? newDayExercises : undefined,
				};
				storeExerciseLog(newLog, date, newDayExercises);
				return newLog;
			});
		} else {
			setExerciseLog((prev) => {
				const { [date]: _, ...rest } = prev;
				const newLog = { ...rest };
				storeExerciseLog(newLog, date, undefined);
				return newLog;
			});
		}
	}

	async function storeExerciseLog(
		exerciseLog: ExerciseLog = {},
		date?: string,
		dayLog?: ExerciseDay | undefined,
	) {
		await AsyncStorage.setItem('exerciseLog', JSON.stringify(exerciseLog));
		await AsyncStorage.setItem(
			'exerciseLogUpdatedAt',
			new Date().toISOString(),
		);

		// Add to pending sync if date provided
		if (date) {
			const now = new Date().toISOString();
			const loggedIn = await isLoggedIn();

			// Add this day to pending sync with timestamp
			await addToPendingSync(date, now);

			// If online AND logged in, push/delete immediately (fire and forget)
			if (isOnline && loggedIn) {
				const userId = await getCurrentUserId();
				if (userId) {
					if (dayLog) {
						// Day exists: push to remote
						pushDayToRemote(userId, date, dayLog).catch((error) => {
							console.error('Failed to push to remote:', error);
						});
					} else {
						// Day deleted: delete from remote
						deleteDayFromRemote(userId, date).catch((error) => {
							console.error('Failed to delete from remote:', error);
						});
					}
				}
			}
		}
	}

	// MIGRATION: Initialize pendingSync on first launch after update
	useEffect(() => {
		async function initializePendingSync() {
			const hasKey = await hasPendingSyncKey();

			if (!hasKey) {
				// First time running new version - migrate existing data
				const logStr = await AsyncStorage.getItem('exerciseLog');
				const now = new Date().toISOString();

				if (logStr) {
					const log: ExerciseLog = JSON.parse(logStr);
					const pending: Record<string, string> = {};

					// Mark all existing days with current timestamp (migration time)
					for (const date of Object.keys(log)) {
						pending[date] = now;
					}

					await AsyncStorage.setItem(
						'exerciseLogPendingSync',
						JSON.stringify(pending),
					);
				} else {
					// No data to migrate, just initialize empty
					await AsyncStorage.setItem('exerciseLogPendingSync', '{}');
				}
			}
		}

		initializePendingSync().catch((error) => {
			console.error('Failed to initialize pending sync:', error);
		});
	}, []);

	useEffect(() => {
		(async () => {
			const exerciseLogJSON = await AsyncStorage.getItem('exerciseLog');
			const exerciseLogData = exerciseLogJSON
				? JSON.parse(exerciseLogJSON)
				: ({} as ExerciseLog);

			setExerciseLog(exerciseLogData);
		})();
	}, []);

	return { exerciseLog, dayLog, updateDayExercise, removeDayExercise };
}
