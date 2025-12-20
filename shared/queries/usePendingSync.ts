import { useQuery } from '@tanstack/react-query';
import { getPendingSync } from '@/shared/supabase/syncState';
import { queryKeys } from './queryKeys';

export function usePendingSync() {
	const { data, isLoading, error } = useQuery({
		queryKey: queryKeys.pendingSync,
		queryFn: async () => {
			return await getPendingSync();
		},
		staleTime: 0,
	});

	return {
		pendingSync: data ?? {},
		isLoadingPendingSync: isLoading,
		errorPendingSync: error,
	};
}
