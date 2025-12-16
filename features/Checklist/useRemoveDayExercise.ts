import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Exercise, type ExerciseLog } from '@/shared/EXERCISES';
import { addToPendingSync } from '@/shared/supabase/syncState';
import { deleteDayFromRemote, pushDayToRemote } from '@/shared/supabase/syncHelpers';
import { queryKeys } from '@/shared/queryKeys';

export function useRemoveDayExercise(date: string) {
	const queryClient = useQueryClient();

	const {
		mutate: removeDayExercise,
		isPending: isRemovingDayExercise,
		error: errorRemoveDayExercise,
	} = useMutation({
		mutationFn: async ({ exercise }: { exercise: Exercise }) => {
			const cached = queryClient.getQueryData(queryKeys.exerciseLog) as ExerciseLog | undefined;
			const currentLog: ExerciseLog = cached ?? JSON.parse(await AsyncStorage.getItem('exerciseLog') ?? '{}');

			const dayLog = currentLog[date] ?? [];
			const newDayExercises = dayLog.filter((item) => {
				const ex = typeof item === 'string' ? item : item[0];
				return ex !== exercise;
			});

			const newLog = newDayExercises.length
				? { ...currentLog, [date]: newDayExercises }
				: (({ [date]: _, ...rest }) => rest)(currentLog);

			await AsyncStorage.setItem('exerciseLog', JSON.stringify(newLog));
			await AsyncStorage.setItem('exerciseLogUpdatedAt', new Date().toISOString());
			await addToPendingSync(date, new Date().toISOString());

			// Fire-and-forget background sync
			const session = queryClient.getQueryData(queryKeys.auth.session) as { user?: { id: string } } | null;
			const network = queryClient.getQueryData(queryKeys.network) as { isOnline?: boolean } | undefined;

			if (session?.user && network?.isOnline) {
				if (newDayExercises.length) {
					pushDayToRemote(session.user.id, date, newDayExercises).catch((err) => {
						console.warn('Background sync failed:', err);
					});
				} else {
					deleteDayFromRemote(session.user.id, date).catch((err) => {
						console.warn('Background delete failed:', err);
					});
				}
			}

			return newLog;
		},
		onSuccess: (newLog) => {
			queryClient.setQueryData(queryKeys.exerciseLog, newLog);
			queryClient.invalidateQueries({ queryKey: queryKeys.pendingSync });
		},
	});

	return { removeDayExercise, isRemovingDayExercise, errorRemoveDayExercise };
}
