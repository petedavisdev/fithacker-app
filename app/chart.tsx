import { Chart } from '../features/Chart/Chart';
import { ChartHelp } from '../features/Chart/ChartHelp';
import { ExerciseFilter } from '../features/ExerciseFilter/ExerciseFilter';
import { TheHeader } from '../features/TheHeader/TheHeader';
import { View } from 'react-native';

export default function chart() {
	return (
		<>
			<TheHeader
				buttonLeft="account"
				buttonRight="help"
				helpContent={<ChartHelp />}
			/>

			<View className="flex-1 items-center justify-center gap-10">
				<Chart />
				<ExerciseFilter />
			</View>
		</>
	);
}
