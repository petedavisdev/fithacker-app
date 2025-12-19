import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clearSyncState } from '@/shared/supabase/syncState';
import { signOut } from './authHelpers';
import { queryKeys } from '@/shared/queries/queryKeys';

export function useLogout() {
	const queryClient = useQueryClient();

	const {
		mutate: logout,
		isPending: isLoggingOut,
		error: errorLogout,
	} = useMutation({
		mutationFn: async () => {
			await signOut();
			await clearSyncState();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
			queryClient.invalidateQueries({ queryKey: queryKeys.pendingSync });
		},
	});

	return { logout, isLoggingOut, errorLogout };
}
