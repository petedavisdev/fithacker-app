import { ActivityIndicator, Text, View } from 'react-native';

import { Chart } from '../features/Chart/Chart';
import { ExerciseFilter } from '../features/ExerciseFilter/ExerciseFilter';
import { TheHeader } from '../features/TheHeader/TheHeader';
// TODO: REMOVE AFTER MIGRATION - Delete this import and the useMigration hook call below
import { useMigration } from '../features/migration/useMigration';
import { useTranslation } from 'react-i18next';

export default function chart() {
	const { t } = useTranslation();
	// TODO: REMOVE AFTER MIGRATION - Delete this line and the migration loading/error state below
	const { isMigrated, isLoading, error } = useMigration();

	// TODO: REMOVE AFTER MIGRATION - Delete this entire if block
	if (isLoading) {
		return (
			<>
				<TheHeader />
				<View className="flex-1 items-center justify-center gap-5">
					<ActivityIndicator size="large" color="#67e8f9" />
					<Text className="text-cyan-300 text-lg font-mono">
						{t('_.migrating') || 'Migrating your data...'}
					</Text>
				</View>
			</>
		);
	}

	if (!isMigrated) {
		return (
			<>
				<TheHeader />
				<View className="flex-1 items-center justify-center gap-5 px-4">
					<Text className="text-red-400 text-xl font-mono text-center">
						{t('_.migrationError') || 'Migration Error'}
					</Text>
					<Text className="text-slate-300 text-base font-mono text-center">
						{t('_.migrationErrorDescription') || 
							'Failed to migrate your exercise data. Please close and reopen the app to retry.'}
					</Text>
					{error && (
						<Text className="text-slate-500 text-sm font-mono text-center mt-2">
							{error.message}
						</Text>
					)}
				</View>
			</>
		);
	}

	return (
		<>
			<TheHeader />

			<View className="flex-1 items-center justify-center gap-10">
				<ExerciseFilter componentToFilter={Chart} />
			</View>
		</>
	);
}
