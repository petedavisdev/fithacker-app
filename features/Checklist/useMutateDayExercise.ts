import AsyncStorage from '@/shared/utils/asyncStorage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	type Exercise,
	type ExerciseLog,
	EXERCISES,
} from '@/shared/utils/constants';
import { addToPendingSync } from '@/shared/supabase/syncState';
import { queryKeys } from '@/shared/queries/queryKeys';
import { STORAGE_KEYS } from '@/shared/utils/constants';

type MutateParams = 
	| { exercise: Exercise; note?: string; remove?: false }
	| { exercise: Exercise; remove: true };

export function useMutateDayExercise(date: string) {
	const queryClient = useQueryClient();

	const {
		mutate: mutateDayExercise,
		isPending: isMutatingDayExercise,
		error: errorMutateDayExercise,
	} = useMutation({
		mutationFn: async (params: MutateParams) => {
			// Cache guaranteed to exist since Checklist only renders when query succeeds
			const currentLog = queryClient.getQueryData<ExerciseLog>(queryKeys.exerciseLog) ?? {};

			const dayLog = currentLog[date] ?? [];

			// Filter out the exercise
			const filtered = dayLog.filter((item) => {
				const ex = typeof item === 'string' ? item : item[0];
				return ex !== params.exercise;
			});

			// Add back if not removing
			const newDayExercises = params.remove
				? filtered
				: [...filtered, params.note ? [params.exercise, params.note] : params.exercise].sort((a, b) => {
						const exA = (typeof a === 'string' ? a : a[0]) as Exercise;
						const exB = (typeof b === 'string' ? b : b[0]) as Exercise;
						return EXERCISES.indexOf(exA) - EXERCISES.indexOf(exB);
					});

			const newLog = { ...currentLog, [date]: newDayExercises };

			await AsyncStorage.setItem(STORAGE_KEYS.EXERCISE_LOG, JSON.stringify(newLog));
			await addToPendingSync(date, new Date().toISOString());

			return newLog;
		},
		onSuccess: (newLog) => {
			queryClient.setQueryData(queryKeys.exerciseLog, newLog);
			queryClient.invalidateQueries({ queryKey: queryKeys.pendingSync });
		},
	});

	return { mutateDayExercise, isMutatingDayExercise, errorMutateDayExercise };
}

