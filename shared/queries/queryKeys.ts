export const queryKeys = {
	exerciseLog: ['exerciseLog'] as const,
	exerciseLogDay: (date: string) => ['exerciseLog', 'day', date] as const,
	auth: {
		session: ['auth', 'session'] as const,
	},
	network: ['network', 'status'] as const,
	pendingSync: ['pendingSync'] as const,
	supabase: {
		allRemoteData: (userId: string) => ['supabase', 'all', userId] as const,
	},
	backgroundSync: (userId?: string) => ['backgroundSync', userId] as const,
	profiles: {
		own: ['profiles', 'own'] as const,
		public: (userId: string) => ['profiles', 'public', userId] as const,
		batch: (userIds: string[]) =>
			['profiles', 'batch', ...userIds.sort()] as const,
		search: (query: string) => ['profiles', 'search', query] as const,
		suggested: ['profiles', 'suggested'] as const,
	},
	publicExerciseLog: (userId: string) => ['publicExerciseLog', userId] as const,
};
