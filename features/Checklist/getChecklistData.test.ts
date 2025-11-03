import { ExerciseDay, ExerciseLog } from '../EXERCISES';
import { DateInfo } from '../dateInfo';
import { getChecklistData } from './getChecklistData';

describe('getChecklistData', () => {
	it('should return the correct exercise checklist data', () => {
		const input1: DateInfo = {
			category: 'today',
			date: '2022-02-26',
			dayIndex: 6,
			text: '_.today',
		};

		const input2: ExerciseLog = {
			'2022-02-26': { a: '', c: 'yoga' },
			'2022-02-25': { d: '', f: '' },
			'2022-01-01': { a: '', e: '' },
		};

		const input3: ExerciseDay = { a: '', c: 'yoga' };

		const expected = [
			{
				exercise: 'a',
				isChecked: true,
				note: undefined,
				dayCount: 56,
				isPriority: false,
			},
			{
				exercise: 'b',
				isChecked: false,
				note: undefined,
				dayCount: undefined,
				isPriority: true,
			},
			{
				exercise: 'c',
				isChecked: true,
				note: 'yoga',
				dayCount: undefined,
				isPriority: true,
			},
			{
				exercise: 'd',
				isChecked: false,
				note: undefined,
				dayCount: 1,
				isPriority: false,
			},
			{
				exercise: 'e',
				isChecked: false,
				note: undefined,
				dayCount: 56,
				isPriority: false,
			},
			{
				exercise: 'f',
				isChecked: false,
				note: undefined,
				dayCount: 1,
				isPriority: false,
			},
		];

		const result = getChecklistData(input1, input2, input3);

		expect(result).toEqual(expected);
	});
});