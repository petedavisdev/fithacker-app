import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { clearSyncState, clearExerciseLog } from '@/shared/supabase/syncState';
import { signOut } from './authHelpers';

export function useLogout() {
	const queryClient = useQueryClient();
	const router = useRouter();

	const {
		mutate: logout,
		isPending: isLoggingOut,
		error: errorLogout,
	} = useMutation({
		mutationFn: async () => {
			await signOut();
			await clearSyncState();
			await clearExerciseLog();
		},
		onSuccess: () => {
			// Clear React Query cache, but preserve network status
			queryClient.removeQueries({
				predicate: (query) => query.queryKey[0] !== 'network',
			});
			// Navigate to account page to clear URL parameters
			router.replace('/account');
		},
	});

	return { logout, isLoggingOut, errorLogout };
}
