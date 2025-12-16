import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	type Exercise,
	type ExerciseLog,
	EXERCISES,
} from '@/shared/EXERCISES';
import { addToPendingSync } from '@/shared/supabase/syncState';
import { pushDayToRemote } from '@/shared/supabase/syncHelpers';
import { queryKeys } from '@/shared/queryKeys';

export function useUpdateDayExercise(date: string) {
	const queryClient = useQueryClient();

	const {
		mutate: updateDayExercise,
		isPending: isUpdatingDayExercise,
		error: errorUpdateDayExercise,
	} = useMutation({
		mutationFn: async ({ exercise, note }: { exercise: Exercise; note?: string }) => {
			const cached = queryClient.getQueryData(queryKeys.exerciseLog) as ExerciseLog | undefined;
			const currentLog: ExerciseLog = cached ?? JSON.parse(await AsyncStorage.getItem('exerciseLog') ?? '{}');

			const dayLog = currentLog[date] ?? [];

			const newDayExercises = [
				...dayLog.filter((item) => {
					const ex = typeof item === 'string' ? item : item[0];
					return ex !== exercise;
				}),
				note ? [exercise, note] : exercise,
			].sort((a, b) => {
				const exA = typeof a === 'string' ? a : a[0];
				const exB = typeof b === 'string' ? b : b[0];
				return EXERCISES.indexOf(exA) - EXERCISES.indexOf(exB);
			});

			const newLog = { ...currentLog, [date]: newDayExercises };

			await AsyncStorage.setItem('exerciseLog', JSON.stringify(newLog));
			await AsyncStorage.setItem('exerciseLogUpdatedAt', new Date().toISOString());
			await addToPendingSync(date, new Date().toISOString());

			// Fire-and-forget background sync
			const session = queryClient.getQueryData(queryKeys.auth.session) as { user?: { id: string } } | null;
			const network = queryClient.getQueryData(queryKeys.network) as { isOnline?: boolean } | undefined;

			if (session?.user && network?.isOnline) {
				pushDayToRemote(session.user.id, date, newDayExercises).catch((err) => {
					console.warn('Background sync failed:', err);
				});
			}

			return newLog;
		},
		onSuccess: (newLog) => {
			queryClient.setQueryData(queryKeys.exerciseLog, newLog);
			queryClient.invalidateQueries({ queryKey: queryKeys.pendingSync });
		},
	});

	return { updateDayExercise, isUpdatingDayExercise, errorUpdateDayExercise };
}
