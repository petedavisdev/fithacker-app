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
	SEARCH_DEBOUNCE_MS: 300,
	DAY_MS: 24 * 60 * 60 * 1000,
	WEEK_MS: 7 * 24 * 60 * 60 * 1000,
} as const;

export const LIMITS = {
	CHART_WEEKS_SAFE_LIMIT: 5000,
	NOTE_MAX_LENGTH: 60,
	USERNAME_MIN_LENGTH: 3,
	USERNAME_MAX_LENGTH: 15, // Client-side limit (DB allows up to 30)
	VIEWED_USERS_MAX: 100,
	SEARCH_RESULTS_LIMIT: 20,
} as const;

export const USERNAME = {
	REGEX: /^[a-zA-Z0-9_-]+$/,
	MIN_LENGTH: LIMITS.USERNAME_MIN_LENGTH,
	MAX_LENGTH: LIMITS.USERNAME_MAX_LENGTH,
} as const;

export const BADGES = {
	1: '🏅',
	2: '🏆',
} as const;

export type Badge = (typeof BADGES)[keyof typeof BADGES];

export const STALE_TIME = {
	IMMEDIATE: 0,
	BACKGROUND_SYNC: 30 * 1000,
} as const;

export const DAYS = {
	WEEKEND: [0, 6] as readonly number[], // Sunday (0), Saturday (6)
	PER_WEEK: 7,
} as const;

export const URL_PARAMS = {
	USER: 'u',
	FILTER: 'f',
	SEARCH: 's',
} as const;
