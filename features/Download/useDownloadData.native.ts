import { useMutation } from '@tanstack/react-query';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { convertExerciseLogToCsv } from './convertExerciseLog';
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
			const csvFilename = `${getFilename()}.csv`;
			const csvContent = convertExerciseLogToCsv(exerciseLog);
			const csvFile = new File(Paths.cache, csvFilename);

			try {
				(csvFile as any).write(csvContent);

				const isAvailable = await Sharing.isAvailableAsync();
				if (!isAvailable) {
					throw new Error('Sharing is not available on this platform');
				}

				await Sharing.shareAsync((csvFile as any).uri);

				setTimeout(() => {
					try {
						(csvFile as any).delete();
					} catch (cleanupError) {
						console.warn('Failed to clean up temp file:', cleanupError);
					}
				}, 2000);
			} catch (error) {
				try {
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
