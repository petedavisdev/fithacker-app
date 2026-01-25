import { useMutation } from '@tanstack/react-query';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
	convertExerciseLogToCsv,
	formatExerciseLogAsJson,
} from './convertExerciseLog';
import type { ExerciseLog } from '@/shared/utils/constants';

function getFilename(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
	// Use hyphens instead of colons for iOS filesystem compatibility
	return `fithacker-data-${year}-${month}-${day}T${hours}-${minutes}-${seconds}`;
}

export function useDownloadData() {
	const {
		mutate: downloadData,
		isPending: isDownloading,
		error,
	} = useMutation({
		mutationFn: async (exerciseLog: ExerciseLog) => {
			const baseFilename = getFilename();
			const jsonFilename = `${baseFilename}.json`;
			const csvFilename = `${baseFilename}.csv`;

			// Convert data to formats
			const jsonContent = formatExerciseLogAsJson(exerciseLog);
			const csvContent = convertExerciseLogToCsv(exerciseLog);

			// Create files in cache directory
			const jsonFile = new File(Paths.cache, jsonFilename);
			const csvFile = new File(Paths.cache, csvFilename);

			try {
				// Write both files
				(jsonFile as any).write(jsonContent);
				(csvFile as any).write(csvContent);

				// Check if sharing is available
				const isAvailable = await Sharing.isAvailableAsync();
				if (!isAvailable) {
					throw new Error('Sharing is not available on this platform');
				}

				// Share JSON file first, then CSV
				// Note: On iOS, sharing multiple files sequentially works well
				await Sharing.shareAsync((jsonFile as any).uri);
				// Small delay to allow first share dialog to appear
				await new Promise((resolve) => setTimeout(resolve, 500));
				await Sharing.shareAsync((csvFile as any).uri);

				// Clean up files after a delay (to ensure sharing completes)
				setTimeout(async () => {
					try {
						(jsonFile as any).delete();
						(csvFile as any).delete();
					} catch (cleanupError) {
						// Ignore cleanup errors
						console.warn('Failed to clean up temp files:', cleanupError);
					}
				}, 2000);
			} catch (error) {
				// Clean up on error
				try {
					(jsonFile as any).delete();
					(csvFile as any).delete();
				} catch (cleanupError) {
					// Ignore cleanup errors
				}
				throw error;
			}
		},
		onError: (error) => {
			console.error('Download mutation error:', error);
		},
	});

	return {
		downloadData,
		isDownloading,
		error,
	};
}
