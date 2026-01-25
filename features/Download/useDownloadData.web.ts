import { useMutation } from '@tanstack/react-query';
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
	// Use hyphens instead of colons for cross-platform compatibility
	return `fithacker-data-${year}-${month}-${day}T${hours}-${minutes}-${seconds}`;
}

function downloadBlob(blob: Blob, filename: string): void {
	if (typeof document === 'undefined') {
		throw new Error('Document not available');
	}

	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	// Clean up the object URL after a delay
	setTimeout(() => URL.revokeObjectURL(url), 100);
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

			// Create blobs
			const jsonBlob = new Blob([jsonContent], { type: 'application/json' });
			const csvBlob = new Blob([csvContent], { type: 'text/csv' });

			// Download both files sequentially
			downloadBlob(jsonBlob, jsonFilename);
			// Small delay to allow first download to start
			await new Promise((resolve) => setTimeout(resolve, 300));
			downloadBlob(csvBlob, csvFilename);
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
