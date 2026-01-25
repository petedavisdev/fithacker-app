import { validateUpload } from './validateUpload';
import type { ExerciseLog } from '@/shared/utils/constants';

describe('validateUpload', () => {
	describe('filename validation', () => {
		it('accepts valid filename with colons', () => {
			const result = validateUpload(
				'fithacker-data-2026-01-24T12:30:00.json',
				'{}',
			);
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.timestamp).toBe('2026-01-24T12:30:00.000Z');
			}
		});

		it('accepts valid filename with hyphens instead of colons', () => {
			const result = validateUpload(
				'fithacker-data-2026-01-24T12-30-00.json',
				'{}',
			);
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.timestamp).toBe('2026-01-24T12:30:00.000Z');
			}
		});

		it('rejects mixed colon and hyphen separators', () => {
			const result1 = validateUpload(
				'fithacker-data-2026-01-24T12:30-00.json',
				'{}',
			);
			expect(result1.valid).toBe(false);

			const result2 = validateUpload(
				'fithacker-data-2026-01-24T12-30:00.json',
				'{}',
			);
			expect(result2.valid).toBe(false);
		});

		it('rejects filename without timestamp', () => {
			const result = validateUpload('fithacker-data.json', '{}');
			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toContain('Invalid filename');
			}
		});

		it('rejects filename with invalid date', () => {
			const result = validateUpload(
				'fithacker-data-2026-13-45T12:30:00.json',
				'{}',
			);
			expect(result.valid).toBe(false);
		});

		it('rejects wrong prefix', () => {
			const result = validateUpload('my-data-2026-01-24T12:30:00.json', '{}');
			expect(result.valid).toBe(false);
		});
	});

	describe('JSON validation', () => {
		it('rejects invalid JSON', () => {
			const result = validateUpload(
				'fithacker-data-2026-01-24T12:30:00.json',
				'not json',
			);
			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toContain('Invalid JSON');
			}
		});

		it('accepts empty log', () => {
			const result = validateUpload(
				'fithacker-data-2026-01-24T12:30:00.json',
				'{}',
			);
			expect(result.valid).toBe(true);
		});

		it('accepts valid exercise log', () => {
			const log: ExerciseLog = {
				'2026-01-15': ['🚶', ['💪', 'morning']],
				'2026-01-16': ['🏃‍♀️'],
			};
			const result = validateUpload(
				'fithacker-data-2026-01-24T12:30:00.json',
				JSON.stringify(log),
			);
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.data).toEqual(log);
			}
		});

		it('rejects invalid exercise emoji', () => {
			const result = validateUpload(
				'fithacker-data-2026-01-24T12:30:00.json',
				'{"2026-01-15":["❌"]}',
			);
			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toContain('Invalid exercise log format');
			}
		});

		it('rejects invalid date format', () => {
			const result = validateUpload(
				'fithacker-data-2026-01-24T12:30:00.json',
				'{"01/15/2026":["🚶"]}',
			);
			expect(result.valid).toBe(false);
		});

		it('rejects non-array day log', () => {
			const result = validateUpload(
				'fithacker-data-2026-01-24T12:30:00.json',
				'{"2026-01-15":"🚶"}',
			);
			expect(result.valid).toBe(false);
		});

		it('rejects invalid note structure', () => {
			const result = validateUpload(
				'fithacker-data-2026-01-24T12:30:00.json',
				'{"2026-01-15":[["🚶"]]}',
			);
			expect(result.valid).toBe(false);
		});
	});
});
