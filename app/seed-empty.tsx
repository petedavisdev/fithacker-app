import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/queries/queryKeys';
import { seedEmptyScreenshotData } from '@/shared/utils/seedScreenshotData';

// Suppress all warnings for screenshot mode
LogBox.ignoreAllLogs(true);

export default function SeedEmptyRoute() {
	const queryClient = useQueryClient();

	useEffect(() => {
		(async () => {
			await seedEmptyScreenshotData();
			queryClient.invalidateQueries({ queryKey: queryKeys.exerciseLog });
			queryClient.invalidateQueries({ queryKey: queryKeys.pendingSync });
		})();
	}, [queryClient]);

	return null;
}
