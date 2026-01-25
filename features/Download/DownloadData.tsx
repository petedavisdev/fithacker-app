import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AText } from '@/shared/components/AText';
import { AButton } from '@/shared/components/AButton';
import { useExerciseLog } from '@/shared/queries/useExerciseLog';
import { isExerciseLogEmpty } from '@/shared/utils/isExerciseLogEmpty';
import { useDownloadData } from './useDownloadData';

export function DownloadData() {
	const { t } = useTranslation();
	const { exerciseLog } = useExerciseLog();
	const { downloadData, isDownloading, error } = useDownloadData();

	const handleDownload = () => {
		downloadData(exerciseLog);
	};

	// Don't show download button if there's no data
	if (isExerciseLogEmpty(exerciseLog)) {
		return null;
	}

	return (
		<View className="items-center gap-2">
			{error && (
				<AText color="pink" size="xs" className="text-center px-4 mb-2">
					{t('_account.downloadError')}
				</AText>
			)}

			<AButton color="cyan" onPress={handleDownload} isDisabled={isDownloading}>
				{isDownloading ? '⏳' : '📥'} {t('_account.downloadData')}
			</AButton>
		</View>
	);
}
