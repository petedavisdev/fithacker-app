import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/queries/queryKeys';
import { seedScreenshotData } from '@/shared/utils/seedScreenshotData';

// Suppress all warnings for screenshot mode
LogBox.ignoreAllLogs(true);

export default function SeedRoute() {
	const queryClient = useQueryClient();

	useEffect(() => {
		(async () => {
			await seedScreenshotData();
			queryClient.invalidateQueries({ queryKey: queryKeys.exerciseLog });
			queryClient.invalidateQueries({ queryKey: queryKeys.pendingSync });
		})();
	}, [queryClient]);

	return null;
}
