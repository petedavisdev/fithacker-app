import { ExerciseLog } from '@/shared/utils/constants';
import { filterExerciseLog } from './filterExerciseLog';

describe('filterExerciseLog', () => {
	it('should return the correct filtered exercise log', () => {
		const input1: ExerciseLog = {
			'2022-02-26': [
				['🚶', 'walk'],
				['🤸', 'yoga'],
			],
			'2022-02-25': ['💪', '🦵'],
			'2022-01-01': ['🚶', '🌴'],
		};

		const input2 = '🚶';

		const expected = {
			'2022-02-26': [['🚶', 'walk']],
			'2022-02-25': [],
			'2022-01-01': ['🚶'],
		};

		const result = filterExerciseLog(input1, input2);

		expect(result).toEqual(expected);
	});
});

