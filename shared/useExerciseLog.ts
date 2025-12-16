import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/queryKeys';

export function useExerciseLog() {
	const { data, isLoading, error } = useQuery({
		queryKey: queryKeys.exerciseLog,
		queryFn: async () => {
			const json = await AsyncStorage.getItem('exerciseLog');
			return json ? JSON.parse(json) : {};
		},
		staleTime: 0,
	});

	return {
		exerciseLog: data ?? {},
		isLoadingExerciseLog: isLoading,
		errorExerciseLog: error,
	};
}


