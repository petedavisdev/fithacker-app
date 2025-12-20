import { useEffect } from 'react';
import * as Network from 'expo-network';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

export function useNetworkStatus() {
	const queryClient = useQueryClient();

	useEffect(() => {
		Network.getNetworkStateAsync().then((state) => {
			// Default to true (optimistic) if null/undefined, only false if explicitly false
			const isOnline = state.isConnected !== false;
			queryClient.setQueryData(queryKeys.network, {
				isOnline,
			});
		});

		const subscription = Network.addNetworkStateListener((state) => {
			// Default to true (optimistic) if null/undefined, only false if explicitly false
			const isOnline = state.isConnected !== false;
			queryClient.setQueryData(queryKeys.network, {
				isOnline,
			});
		});

		return () => subscription?.remove();
	}, [queryClient]);

	const { data, isLoading, error } = useQuery({
		queryKey: queryKeys.network,
		queryFn: async () => {
			const state = await Network.getNetworkStateAsync();
			// Default to true (optimistic) if null/undefined, only false if explicitly false
			const isOnline = state.isConnected !== false;
			return { isOnline };
		},
		staleTime: Infinity,
		// Optimistically assume online until we know otherwise
		initialData: { isOnline: true },
	});

	return {
		networkStatus: data ?? { isOnline: true },
		isLoadingNetworkStatus: isLoading,
		errorNetworkStatus: error,
	};
}

export function useIsOnline() {
	const { networkStatus } = useNetworkStatus();
	return networkStatus.isOnline;
}
