import { useMutation } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { validateUpload } from './validateUpload';

export type UploadResult =
	| {
			success: true;
			filename: string;
			timestamp: string;
			dateCount: number;
			content: string;
	  }
	| { success: false; error: string };

export function useUploadData() {
	const {
		mutateAsync: selectAndValidateFile,
		isPending: isSelecting,
		error,
	} = useMutation({
		mutationFn: async (): Promise<UploadResult> => {
			// Pick document
			const result = await DocumentPicker.getDocumentAsync({
				type: 'application/json',
				copyToCacheDirectory: true,
			});

			if (result.canceled) {
				return { success: false, error: 'Upload cancelled' };
			}

			const file = result.assets[0];
			if (!file) {
				return { success: false, error: 'No file selected' };
			}

			// Read file content
			const uploadedFile = new File(file.uri);
			const content = await (uploadedFile as any).text();

			// Validate
			const validation = validateUpload(file.name, content);
			if (!validation.valid) {
				return { success: false, error: validation.error };
			}

			return {
				success: true,
				filename: file.name,
				timestamp: validation.timestamp,
				dateCount: Object.keys(validation.data).length,
				content,
			};
		},
		onError: (error) => {
			console.error('Upload file selection error:', error);
		},
	});

	return {
		selectAndValidateFile,
		isSelecting,
		error,
	};
}
