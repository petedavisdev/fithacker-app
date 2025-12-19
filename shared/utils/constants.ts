// Exercise constants
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

export const STORAGE_KEYS = {
	EXERCISE_LOG: 'exerciseLog',
	EXERCISE_LOG_PENDING_SYNC: 'exerciseLogPendingSync',
	LANGUAGE: 'language',
} as const;

export const TIMING = {
	DEBOUNCE_MS: 500,
	BACKGROUND_SYNC_STALE_TIME_MS: 5 * 60 * 1000, // 5 minutes
	DAY_MS: 24 * 60 * 60 * 1000,
	WEEK_MS: 7 * 24 * 60 * 60 * 1000,
} as const;

export const LIMITS = {
	CHART_WEEKS_SAFE_LIMIT: 5000,
	NOTE_MAX_LENGTH: 60,
} as const;

export const BADGES = {
	1: '🏅',
	2: '🏆',
} as const;

export type Badge = (typeof BADGES)[keyof typeof BADGES];

export const STALE_TIME = {
	IMMEDIATE: 0,
	BACKGROUND_SYNC: TIMING.BACKGROUND_SYNC_STALE_TIME_MS,
} as const;

export const DAYS = {
	WEEKEND: [0, 6] as const, // Sunday (0), Saturday (6)
	PER_WEEK: 7,
} as const;

