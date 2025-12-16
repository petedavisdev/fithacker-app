import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { onAuthStateChange } from './authHelpers';
import { supabase } from '@/shared/supabase/client';
import { queryKeys } from '@/shared/queryKeys';

export function useAuthSession() {
	const queryClient = useQueryClient();

	// Bridge Supabase auth events into React Query cache
	useEffect(() => {
		const {
			data: { subscription },
		} = onAuthStateChange((loggedIn, session) => {
			queryClient.setQueryData(queryKeys.auth.session, session ?? null);
			if (loggedIn) {
				queryClient.invalidateQueries({ queryKey: queryKeys.exerciseLog });
			}
		});

		return () => subscription?.unsubscribe();
	}, [queryClient]);

	const {
		data: authSession,
		isLoading: isLoadingAuthSession,
		error: errorAuthSession,
	} = useQuery({
		queryKey: queryKeys.auth.session,
		queryFn: async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			return session;
		},
		staleTime: Infinity,
	});

	return {
		authSession: authSession ?? null,
		isLoadingAuthSession,
		errorAuthSession,
	};
}

export function useIsLoggedIn() {
	const { authSession } = useAuthSession();
	return !!authSession?.user;
}


