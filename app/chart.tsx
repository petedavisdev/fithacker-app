import { Chart } from '../features/Chart/Chart';
import { ExerciseFilter } from '../features/ExerciseFilter/ExerciseFilter';

export default function chart() {
	return <ExerciseFilter componentToFilter={Chart} />;
}
