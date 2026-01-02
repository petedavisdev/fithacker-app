import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { supabase } from '@/shared/supabase/client';
import { clearSyncState } from '@/shared/supabase/syncState';
import { signOut } from './authHelpers';

export function useDeleteAccount() {
	const queryClient = useQueryClient();
	const router = useRouter();

	const {
		mutate: deleteAccount,
		isPending: isDeletingAccount,
		error: errorDeleteAccount,
	} = useMutation({
		mutationFn: async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error('Not authenticated');

			const { error: logsError } = await supabase
				.from('exercise_logs')
				.delete()
				.eq('user_id', user.id);

			if (logsError) throw logsError;

			const { error: profileError } = await supabase
				.from('user_profiles')
				.delete()
				.eq('user_id', user.id);

			if (profileError) throw profileError;

			// Sign out from Supabase auth
			await signOut();

			// Clear sync state only (keeps local exercise log intact)
			await clearSyncState();
		},
		onSuccess: () => {
			queryClient.invalidateQueries();
			router.replace('/chart');
		},
	});

	return { deleteAccount, isDeletingAccount, errorDeleteAccount };
}
