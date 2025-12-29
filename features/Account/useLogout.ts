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
			// Clear ALL React Query cache to remove disabled query data
			queryClient.clear();
			// Navigate to account page to clear URL parameters
			router.replace('/account');
		},
	});

	return { logout, isLoggingOut, errorLogout };
}
