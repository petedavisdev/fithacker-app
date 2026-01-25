import { isExerciseLogEmpty } from './isExerciseLogEmpty';
import type { ExerciseLog } from './constants';

describe('isExerciseLogEmpty', () => {
	it('returns true for null', () => {
		expect(isExerciseLogEmpty(null)).toBe(true);
	});

	it('returns true for undefined', () => {
		expect(isExerciseLogEmpty(undefined)).toBe(true);
	});

	it('returns true for empty object', () => {
		const log: ExerciseLog = {};
		expect(isExerciseLogEmpty(log)).toBe(true);
	});

	it('returns true when all days are undefined', () => {
		const log: ExerciseLog = {
			'2026-01-15': undefined,
			'2026-01-16': undefined,
		};
		expect(isExerciseLogEmpty(log)).toBe(true);
	});

	it('returns true when all days are empty arrays', () => {
		const log: ExerciseLog = {
			'2026-01-15': [],
			'2026-01-16': [],
		};
		expect(isExerciseLogEmpty(log)).toBe(true);
	});

	it('returns true when days are mix of empty arrays and undefined', () => {
		const log: ExerciseLog = {
			'2026-01-15': [],
			'2026-01-16': undefined,
			'2026-01-17': [],
		};
		expect(isExerciseLogEmpty(log)).toBe(true);
	});

	it('returns false when at least one day has exercises', () => {
		const log: ExerciseLog = {
			'2026-01-15': [],
			'2026-01-16': ['🚶'],
			'2026-01-17': [],
		};
		expect(isExerciseLogEmpty(log)).toBe(false);
	});

	it('returns false when day has exercise with note', () => {
		const log: ExerciseLog = {
			'2026-01-15': [['💪', 'morning workout']],
		};
		expect(isExerciseLogEmpty(log)).toBe(false);
	});

	it('returns false when multiple days have exercises', () => {
		const log: ExerciseLog = {
			'2026-01-15': ['🚶', '💪'],
			'2026-01-16': ['🏃‍♀️'],
		};
		expect(isExerciseLogEmpty(log)).toBe(false);
	});
});
