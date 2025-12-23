import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export function useShareWeek() {
	const viewShotRef = useRef<ViewShot>(null);

	const {
		mutate: shareWeek,
		isPending: isSharingWeek,
		error: errorShareWeek,
	} = useMutation({
		mutationFn: async (firstDate: string) => {
			console.log('shareWeek mutation called (native)', firstDate);

			if (!viewShotRef.current?.capture) {
				const error = new Error('ViewShot ref not available');
				console.error('ViewShot error:', error);
				throw error;
			}

			console.log('Capturing view with ViewShot...');
			const uri = await viewShotRef.current.capture();
			console.log('Capture result:', uri);

			const isAvailable = await Sharing.isAvailableAsync();
			console.log('Sharing.isAvailableAsync():', isAvailable);

			if (isAvailable) {
				await Sharing.shareAsync(uri);
				console.log('Native share successful');
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
