import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Network from 'expo-network';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/queries/queryKeys';
import { TIMING } from '@/shared/utils/constants';

// navigator.onLine is unreliable in some Chromium-based browsers (e.g. Edge on macOS),
// returning false at startup even when online. When that happens, probe with a real fetch
// to distinguish the browser bug from genuine offline state.
async function resolveIsConnected(
	isConnected: boolean | null | undefined,
): Promise<boolean> {
	if (isConnected === true) return true;
	if (Platform.OS !== 'web') return false;
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 3000);
	try {
		await fetch('https://www.google.com/generate_204', {
			method: 'HEAD',
			mode: 'no-cors',
			cache: 'no-store',
			signal: controller.signal,
		});
		return true;
	} catch {
		return false;
	} finally {
		clearTimeout(timeout);
	}
}

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

		Network.getNetworkStateAsync()
			.then((state) => resolveIsConnected(state.isConnected))
			.then(updateNetworkStatus)
			.catch(() => {});

		const subscription = Network.addNetworkStateListener((state) => {
			resolveIsConnected(state.isConnected)
				.then(updateNetworkStatus)
				.catch(() => {});
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
