import { calculateBadges } from './calculateBadges';
import type { ExerciseLog } from './constants';

jest.useFakeTimers({ now: new Date('2022-02-26T00:00:00') });

describe('calculateBadges', () => {
	it('should return empty badges when no exercises', () => {
		const days: ExerciseLog = {};
		const badges = calculateBadges(days);
		expect(badges).toEqual([]);
	});

	it('should return 1x badge when all exercises appear at least once', () => {
		const days: ExerciseLog = {
			'2022-02-21': ['🚶'],
			'2022-02-22': ['🏃‍♀️'],
			'2022-02-23': ['🤸'],
			'2022-02-24': ['💪'],
			'2022-02-25': ['🌴'],
			'2022-02-26': ['🦵'],
		};
		const badges = calculateBadges(days);
		expect(badges).toEqual(['🏅']);
	});

	it('should return 1x and 2x badges when all exercises appear at least twice', () => {
		const days: ExerciseLog = {
			'2022-02-21': ['🚶', '🏃‍♀️'],
			'2022-02-22': ['🤸', '💪'],
			'2022-02-23': ['🌴', '🦵'],
			'2022-02-24': ['🚶', '🏃‍♀️'],
			'2022-02-25': ['🤸', '💪'],
			'2022-02-26': ['🌴', '🦵'],
		};
		const badges = calculateBadges(days);
		expect(badges).toEqual(['🏅', '🏆']);
	});

	it('should not return badges when some exercises missing', () => {
		const days: ExerciseLog = {
			'2022-02-21': ['🚶', '🏃‍♀️', '🤸', '💪', '🌴'],
			// Missing 🦵
		};
		const badges = calculateBadges(days);
		expect(badges).toEqual([]);
	});

	it('should handle exercises with notes', () => {
		const days: ExerciseLog = {
			'2022-02-21': [['🚶', 'walk']],
			'2022-02-22': [['🏃‍♀️', 'run']],
			'2022-02-23': [['🤸', 'stretch']],
			'2022-02-24': [['💪', 'weights']],
			'2022-02-25': [['🌴', 'hike']],
			'2022-02-26': [['🦵', 'legs']],
		};
		const badges = calculateBadges(days);
		expect(badges).toEqual(['🏅']);
	});
});
