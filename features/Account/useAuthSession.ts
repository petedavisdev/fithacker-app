import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/supabase/client';
import { queryKeys } from '@/shared/queries/queryKeys';
import i18n from '@/shared/i18n';

export function useAuthSession() {
	const queryClient = useQueryClient();

	// Bridge Supabase auth events into React Query cache
	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			// Handle SIGNED_OUT events (e.g., when refresh token is invalid)
			if (event === 'SIGNED_OUT' || !session) {
				queryClient.setQueryData(queryKeys.auth.session, null);
				return;
			}

			// Update user metadata with current language if missing or different
			if (event === 'SIGNED_IN' && session?.user) {
				const currentLanguage = (i18n.language || 'en').substring(0, 2);
				const userLanguage = session.user.user_metadata?.language;

				if (userLanguage !== currentLanguage) {
					await supabase.auth.updateUser({
						data: { language: currentLanguage },
					});
				}
			}

			queryClient.setQueryData(queryKeys.auth.session, session);
			if (session?.user) {
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
