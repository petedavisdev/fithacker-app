import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/Account/useAuthSession';
import { useIsOnline } from './useNetworkStatus';
import { queryKeys } from './queryKeys';
import { syncAll } from '@/shared/supabase/syncHelpers';
import { STALE_TIME } from '@/shared/utils/constants';

export function useBackgroundSync() {
	const queryClient = useQueryClient();
	const { authSession } = useAuthSession();
	const isOnline = useIsOnline();

	const canSync = !!(authSession?.user && isOnline);

	const {
		isFetching: isBackgroundSyncFetching,
		error: errorBackgroundSync,
		refetch: triggerSync,
	} = useQuery({
		queryKey: queryKeys.backgroundSync(authSession?.user?.id),
		queryFn: async () => {
			const exerciseSuccess = await syncAll();

			// Invalidate queries based on what synced
			if (exerciseSuccess) {
				queryClient.invalidateQueries({ queryKey: queryKeys.exerciseLog });
				queryClient.invalidateQueries({ queryKey: queryKeys.pendingSync });
			}

			return exerciseSuccess;
		},
		enabled: canSync,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		staleTime: STALE_TIME.BACKGROUND_SYNC,
		networkMode: 'online',
	});

	return {
		isBackgroundSyncFetching,
		errorBackgroundSync,
		triggerSync,
	};
}
