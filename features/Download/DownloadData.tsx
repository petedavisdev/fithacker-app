import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { AText } from '@/shared/components/AText';
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
		<View className="items-center gap-2 pb-4">
			{error && (
				<AText color="pink" size="xs" className="text-center px-4 mb-2">
					{t('_account.downloadError')}
				</AText>
			)}

			<Pressable onPress={handleDownload} disabled={isDownloading}>
				<View
					className={`px-4 py-2 items-center justify-center border-2 border-cyan-500 rounded-full ${
						isDownloading ? 'opacity-35' : ''
					}`}
					style={{
						shadowColor: '#0e7490',
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.25,
						shadowRadius: 3.84,
						elevation: 5,
					}}
				>
					<AText color="cyan" size="sm" className="text-balance text-center">
						{isDownloading ? '⏳' : '📥'} {t('_account.downloadData')}
					</AText>
				</View>
			</Pressable>
		</View>
	);
}
