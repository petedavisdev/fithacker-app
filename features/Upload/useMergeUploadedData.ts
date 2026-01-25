import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@/shared/utils/asyncStorage';
import { STORAGE_KEYS } from '@/shared/utils/constants';
import type { ExerciseLog } from '@/shared/utils/constants';
import { addToPendingSync } from '@/shared/supabase/syncState';
import { queryKeys } from '@/shared/queries/queryKeys';
import { validateUpload } from './validateUpload';
type MergeParams = {
	content: string;
	filename: string;
};

export function useMergeUploadedData() {
	const queryClient = useQueryClient();

	const {
		mutate: mergeUploadedData,
		isPending: isMerging,
		error,
	} = useMutation({
		mutationFn: async (params: MergeParams) => {
			// Validate again (should already be validated, but be safe)
			const validation = validateUpload(params.filename, params.content);
			if (!validation.valid) {
				throw new Error(validation.error);
			}

			// Get current local log
			const localLogStr = await AsyncStorage.getItem(STORAGE_KEYS.EXERCISE_LOG);
			const localLog: ExerciseLog = localLogStr ? JSON.parse(localLogStr) : {};

			// Merge uploaded data into local log
			const uploadedData = validation.data;
			const mergedLog = { ...localLog };
			let mergedCount = 0;

			for (const [date, dayLog] of Object.entries(uploadedData)) {
				if (dayLog !== undefined) {
					mergedLog[date] = dayLog;
					mergedCount++;
				}
			}

			// Save merged log
			await AsyncStorage.setItem(
				STORAGE_KEYS.EXERCISE_LOG,
				JSON.stringify(mergedLog),
			);

			// Mark all uploaded dates as pending sync with the file's timestamp
			for (const date of Object.keys(uploadedData)) {
				await addToPendingSync(date, validation.timestamp);
			}

			return { mergedCount };
		},
		onSuccess: () => {
			// Invalidate queries to refresh UI
			queryClient.invalidateQueries({ queryKey: queryKeys.exerciseLog });
			queryClient.invalidateQueries({ queryKey: queryKeys.pendingSync });
		},
		onError: (error) => {
			console.error('Merge uploaded data error:', error);
		},
	});

	return {
		mergeUploadedData,
		isMerging,
		error,
	};
}
