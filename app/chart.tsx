import { Chart } from '../features/Chart/Chart';
import { ExerciseFilter } from '../features/ExerciseFilter/ExerciseFilter';
import { TheHeader } from '../features/TheHeader/TheHeader';
import { View } from 'react-native';

export default function chart() {
	return (
		<>
			<TheHeader />

			<View className="flex-1 items-center justify-center gap-10">
				<ExerciseFilter componentToFilter={Chart} />
			</View>
		</>
	);
}
