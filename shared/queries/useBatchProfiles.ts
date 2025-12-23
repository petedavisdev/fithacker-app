import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/supabase/client';
import { queryKeys } from './queryKeys';

export function useBatchProfiles(userIds: string[]) {
	const {
		data: batchProfiles,
		isLoading: isLoadingBatchProfiles,
		error: errorBatchProfiles,
	} = useQuery({
		queryKey: queryKeys.profiles.batch(userIds),
		queryFn: async () => {
			if (userIds.length === 0) return [];

			const { data, error } = await supabase
				.from('user_profiles')
				.select('user_id, username')
				.in('user_id', userIds);

			if (error) throw error;
			return data ?? [];
		},
		enabled: userIds.length > 0,
		networkMode: 'online',
		staleTime: 0,
	});

	return {
		batchProfiles: batchProfiles ?? [],
		isLoadingBatchProfiles,
		errorBatchProfiles,
	};
}
