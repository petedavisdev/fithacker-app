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
};
