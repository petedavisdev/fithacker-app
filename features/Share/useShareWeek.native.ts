import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { type ViewShotRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export function useShareWeek() {
	const viewShotRef = useRef<ViewShotRef | null>(null);

	const {
		mutate: shareWeek,
		isPending: isSharingWeek,
		error: errorShareWeek,
	} = useMutation({
		mutationFn: async (firstDate: string) => {
			if (!viewShotRef.current?.capture) {
				const error = new Error('ViewShot ref not available');
				console.error('ViewShot error:', error);
				throw error;
			}

			// Wait for view to fully render before capturing
			// This ensures fonts, styles, and layout are complete
			await new Promise((resolve) => setTimeout(resolve, 300));

			const uri = await viewShotRef.current.capture();

			const isAvailable = await Sharing.isAvailableAsync();

			if (isAvailable) {
				await Sharing.shareAsync(uri);
			} else {
				throw new Error('Sharing is not available on this platform');
			}
		},
		onError: (error) => {
			console.error('Share mutation error:', error);
		},
	});

	return {
		viewShotRef,
		shareWeek,
		isSharingWeek,
		errorShareWeek,
	};
}
