import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

// Hook to read network status from cache
export function useIsOnline() {
	const { data } = useQuery({
		queryKey: queryKeys.network,
		queryFn: () => ({ isOnline: false }),
		staleTime: Infinity,
		initialData: { isOnline: false },
	});

	return data.isOnline;
}
