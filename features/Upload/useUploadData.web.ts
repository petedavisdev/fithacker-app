import { useMutation } from '@tanstack/react-query';
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
			return new Promise((resolve) => {
				if (typeof document === 'undefined') {
					resolve({ success: false, error: 'Document not available' });
					return;
				}

				// Create file input
				const input = document.createElement('input');
				input.type = 'file';
				input.accept = '.json,application/json';

				input.onchange = async (e) => {
					const file = (e.target as HTMLInputElement).files?.[0];
					if (!file) {
						resolve({ success: false, error: 'No file selected' });
						return;
					}

					// Read file
					const reader = new FileReader();
					reader.onload = (event) => {
						const content = event.target?.result as string;

						// Validate
						const validation = validateUpload(file.name, content);
						if (!validation.valid) {
							resolve({ success: false, error: validation.error });
							return;
						}

						resolve({
							success: true,
							filename: file.name,
							timestamp: validation.timestamp,
							dateCount: Object.keys(validation.data).length,
							content,
						});
					};

					reader.onerror = () => {
						resolve({ success: false, error: 'Failed to read file' });
					};

					reader.readAsText(file);
				};

				input.oncancel = () => {
					resolve({ success: false, error: 'Upload cancelled' });
				};

				// Trigger file picker
				input.click();
			});
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
