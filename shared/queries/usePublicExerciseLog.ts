import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/supabase/client';
import { queryKeys } from './queryKeys';
import type { ExerciseLog } from '@/shared/utils/constants';

export function usePublicExerciseLog(userId: string | null) {
	const {
		data: publicExerciseLog,
		isLoading: isLoadingPublicExerciseLog,
		error: errorPublicExerciseLog,
	} = useQuery({
		queryKey: queryKeys.publicExerciseLog(userId ?? ''),
		queryFn: async () => {
			if (!userId) return {};

			const { data, error } = await supabase
				.from('exercise_logs')
				.select('day, log')
				.eq('user_id', userId);

			if (error) throw error;

			// Transform array of rows into ExerciseLog format
			const log: ExerciseLog = {};
			for (const row of data ?? []) {
				log[row.day] = row.log as ExerciseLog[string];
			}

			return log;
		},
		enabled: !!userId,
		networkMode: 'online',
		staleTime: 0,
	});

	return {
		publicExerciseLog: publicExerciseLog ?? {},
		isLoadingPublicExerciseLog,
		errorPublicExerciseLog,
	};
}
