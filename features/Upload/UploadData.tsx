import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AText } from '@/shared/components/AText';
import { AButton } from '@/shared/components/AButton';
import { AModal } from '@/shared/components/AModal';
import { useUploadData, type UploadResult } from './useUploadData';
import { useMergeUploadedData } from './useMergeUploadedData';
import { useBackgroundSync } from '@/shared/queries/useBackgroundSync';
import { useExerciseLog } from '@/shared/queries/useExerciseLog';

export function UploadData() {
	const { t } = useTranslation();
	const router = useRouter();
	const { exerciseLog } = useExerciseLog();
	const { selectAndValidateFile, isSelecting } = useUploadData();
	const { mergeUploadedData, isMerging } = useMergeUploadedData();
	const { triggerSync } = useBackgroundSync();

	const [validatedFile, setValidatedFile] = useState<UploadResult | null>(null);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isSuccessOpen, setIsSuccessOpen] = useState(false);
	const [uploadedCount, setUploadedCount] = useState(0);

	const handleSelectFile = async () => {
		setUploadError(null);
		const result = await selectAndValidateFile();

		if (!result.success) {
			setUploadError(result.error);
			return;
		}

		// Check if there's local data
		const hasLocalData = Object.keys(exerciseLog).length > 0;

		if (!hasLocalData) {
			// No local data - proceed directly without confirmation
			mergeUploadedData(
				{
					content: result.content,
					filename: result.filename,
				},
				{
					onSuccess: () => {
						// Show success modal
						setUploadedCount(result.dateCount);
						setIsSuccessOpen(true);
						// Trigger sync to push to remote if logged in
						triggerSync();
					},
					onError: (error) => {
						setUploadError(error.message);
					},
				},
			);
		} else {
			// Has local data - show confirmation modal
			setValidatedFile(result);
			setIsConfirmOpen(true);
		}
	};

	const handleConfirmUpload = () => {
		if (!validatedFile || !validatedFile.success) return;

		mergeUploadedData(
			{
				content: validatedFile.content,
				filename: validatedFile.filename,
			},
			{
				onSuccess: () => {
					// Show success modal
					setUploadedCount(validatedFile.dateCount);
					setIsSuccessOpen(true);
					// Close confirmation modal and clear state
					setIsConfirmOpen(false);
					setValidatedFile(null);
					// Trigger sync to push to remote if logged in
					triggerSync();
				},
				onError: (error) => {
					setUploadError(error.message);
					setIsConfirmOpen(false);
					setValidatedFile(null);
				},
			},
		);
	};

	const handleCancelUpload = () => {
		setIsConfirmOpen(false);
		setValidatedFile(null);
	};

	const isProcessing = isSelecting || isMerging;

	return (
		<>
			<View className="items-center gap-2">
				{uploadError && (
					<AText color="pink" size="xs" className="text-center px-4 mb-2">
						{uploadError}
					</AText>
				)}

				<AButton
					color="cyan"
					onPress={handleSelectFile}
					isDisabled={isProcessing}
				>
					{isProcessing ? '⏳' : '📤'} {t('_account.uploadData')}
				</AButton>
			</View>

			{validatedFile && validatedFile.success && (
				<AModal
					isOpen={isConfirmOpen}
					onClose={handleCancelUpload}
					onConfirm={handleConfirmUpload}
					showCancel={true}
				>
					<View className="p-6 gap-6">
						<AText color="yellow" size="2xl" className="font-bold text-center">
							⚠️ {t('_account.uploadConfirmTitle')}
						</AText>

						<View className="gap-4">
							<AText size="base" className="text-center leading-6">
								{t('_account.uploadConfirmMessage', {
									count: validatedFile.dateCount,
								})}
							</AText>

							<AText size="sm" shade={300} className="text-center leading-5">
								{t('_account.uploadConfirmWarning')}
							</AText>
						</View>
					</View>
				</AModal>
			)}

			<AModal
				isOpen={isSuccessOpen}
				onClose={() => setIsSuccessOpen(false)}
				onConfirm={() => {
					setIsSuccessOpen(false);
					router.push('/chart');
				}}
			>
				<View className="p-6 gap-6 items-center">
					<AText size="3xl" className="font-bold text-center">
						✓
					</AText>

					<AText size="xl" className="font-bold text-center">
						{t('_account.uploadSuccessTitle')}
					</AText>

					<AText size="base" className="text-center leading-6">
						{t('_account.uploadSuccessMessage', { count: uploadedCount })}
					</AText>
				</View>
			</AModal>
		</>
	);
}
