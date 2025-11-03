/**
 * TODO: REMOVE AFTER MIGRATION PERIOD
 * 
 * This file can be deleted once all users have migrated.
 * 
 * Deletion Steps:
 * 1. Confirm 100% migration via analytics
 * 2. Delete this file: features/EXERCISES.old.ts
 * 3. Delete features/migration/ folder
 * 4. Remove useMigration() calls from app routes
 * 
 * See features/migration/CLEANUP.md for complete cleanup instructions.
 * 
 * This file preserves the old exercise types and constants for migration logic.
 * It defines the old emoji-based array format that was migrated to code-based object format.
 * 
 * Reference: See .cursor/rules/exercises.mdc for exercise system conventions
 */

export const EXERCISES = ['🚶', '🏃‍♀️', '🤸', '💪', '🌴', '🦵'] as const;

export type Exercise = (typeof EXERCISES)[number];
export type ExerciseItem = Exercise | [Exercise, string];
export type ExerciseDay = ExerciseItem[];
export type ExerciseLog = Record<string, ExerciseDay | undefined>;

export const EXERCISE_PRIORITIES: Record<Exercise, number> = {
	'🚶': 2,
	'🦵': 0.9,
	'🤸': 0.7,
	'🏃‍♀️': 0.5,
	'🌴': 0.3,
	'💪': 0.1,
};
