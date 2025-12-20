import AsyncStorage from '@/shared/utils/asyncStorage';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { STORAGE_KEYS, STALE_TIME } from '@/shared/utils/constants';

export function useExerciseLog() {
	const { data, isLoading, error } = useQuery({
		queryKey: queryKeys.exerciseLog,
		queryFn: async () => {
			const json = await AsyncStorage.getItem(STORAGE_KEYS.EXERCISE_LOG);
			return json ? JSON.parse(json) : {};
		},
		staleTime: STALE_TIME.IMMEDIATE,
	});

	return {
		exerciseLog: data ?? {},
		isLoadingExerciseLog: isLoading,
		errorExerciseLog: error,
	};
}
