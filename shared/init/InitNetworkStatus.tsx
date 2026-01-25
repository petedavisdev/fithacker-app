import { useEffect, useRef } from 'react';
import * as Network from 'expo-network';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/queries/queryKeys';
import { TIMING } from '@/shared/utils/constants';

export function InitNetworkStatus() {
	const queryClient = useQueryClient();
	const offlineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		function updateNetworkStatus(isOnline: boolean) {
			if (offlineTimerRef.current) {
				clearTimeout(offlineTimerRef.current);
				offlineTimerRef.current = null;
			}

			if (isOnline) {
				queryClient.setQueryData(queryKeys.network, { isOnline: true });
			} else {
				// Debounce going offline to avoid flaky connection thrashing
				offlineTimerRef.current = setTimeout(() => {
					queryClient.setQueryData(queryKeys.network, { isOnline: false });
				}, TIMING.OFFLINE_DETECTION_DEBOUNCE_MS);
			}
		}

		Network.getNetworkStateAsync().then((state) => {
			updateNetworkStatus(state.isConnected === true);
		});

		const subscription = Network.addNetworkStateListener((state) => {
			updateNetworkStatus(state.isConnected === true);
		});

		return () => {
			subscription?.remove();
			if (offlineTimerRef.current) {
				clearTimeout(offlineTimerRef.current);
			}
		};
	}, [queryClient]);

	return null;
}
