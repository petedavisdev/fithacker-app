import { Chart } from '../features/Chart/Chart';
import { ExerciseFilter } from '../features/ExerciseFilter/ExerciseFilter';
import { TheHeader } from '../features/TheHeader/TheHeader';
import { View } from 'react-native';
// TODO: REMOVE AFTER MIGRATION - Delete this import and the useMigration hook call below
import { useMigration } from '../features/migration/useMigration';

export default function chart() {
	// TODO: REMOVE AFTER MIGRATION - Delete this line and the if (!isMigrated) guard below
	const { isMigrated } = useMigration();

	// TODO: REMOVE AFTER MIGRATION - Delete this entire if block
	if (!isMigrated) {
		return null;
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
