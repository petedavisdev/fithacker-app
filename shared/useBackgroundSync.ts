import { useQuery } from '@tanstack/react-query';
import { useAuthSession } from '@/features/Account/useAuthSession';
import { useNetworkStatus } from './useNetworkStatus';
import { queryKeys } from '@/shared/queryKeys';
import { syncAll } from '@/shared/supabase/syncHelpers';

export function useBackgroundSync() {
	const { authSession } = useAuthSession();
	const { networkStatus } = useNetworkStatus();

	const { isFetching, error } = useQuery({
		queryKey: queryKeys.backgroundSync(
			authSession?.user?.id,
			networkStatus?.isOnline,
		),
		queryFn: async () => {
			if (authSession?.user && networkStatus?.isOnline) {
				await syncAll();
			}
			return null;
		},
		enabled: !!(authSession?.user && networkStatus?.isOnline),
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
	});

	return {
		isBackgroundSyncFetching: isFetching,
		errorBackgroundSync: error,
	};
}


