import { ExerciseLog } from '../EXERCISES';
import { filterExerciseLog } from './filterExerciseLog';

describe('filterExerciseLog', () => {
	it('should return the correct filtered exercise log', () => {
		const input1: ExerciseLog = {
			'2022-02-26': {
				a: 'walk',
				c: 'yoga',
			},
			'2022-02-25': {
				d: '',
				f: '',
			},
			'2022-01-01': {
				a: '',
				e: '',
			},
		};

		const input2 = 'a';

		const expected = {
			'2022-02-26': { a: 'walk' },
			'2022-02-25': {},
			'2022-01-01': { a: '' },
		};

		const result = filterExerciseLog(input1, input2);

		expect(result).toEqual(expected);
	});
});