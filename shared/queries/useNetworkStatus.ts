import { useEffect } from 'react';
import * as Network from 'expo-network';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

export function useNetworkStatus() {
	const queryClient = useQueryClient();

	useEffect(() => {
		const subscription = Network.addNetworkStateListener((state) => {
			queryClient.setQueryData(queryKeys.network, {
				isOnline: state.isConnected ?? false,
			});
		});

		return () => subscription?.remove();
	}, [queryClient]);

	const { data, isLoading, error } = useQuery({
		queryKey: queryKeys.network,
		queryFn: async () => {
			const state = await Network.getNetworkStateAsync();
			return { isOnline: state.isConnected ?? false };
		},
		staleTime: Infinity,
	});

	return {
		networkStatus: data ?? { isOnline: false },
		isLoadingNetworkStatus: isLoading,
		errorNetworkStatus: error,
	};
}

export function useIsOnline() {
	const { networkStatus } = useNetworkStatus();
	return networkStatus.isOnline;
}
