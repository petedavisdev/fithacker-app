import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/supabase/client';
import { queryKeys } from '@/shared/queries/queryKeys';
import { useState, useEffect } from 'react';
import { TIMING, LIMITS } from '@/shared/utils/constants';
import { useAuthSession } from './useAuthSession';

export function useSearchUsers(searchQuery: string) {
	const { authSession } = useAuthSession();
	const currentUserId = authSession?.user?.id;
	const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, TIMING.SEARCH_DEBOUNCE_MS);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	const {
		data: searchResults,
		isLoading: isLoadingSearch,
		error: errorSearch,
	} = useQuery({
		queryKey: queryKeys.profiles.search(debouncedQuery),
		queryFn: async () => {
			if (!debouncedQuery || debouncedQuery.length < 1) {
				return [];
			}

			let query = supabase
				.from('user_profiles')
				.select('user_id, username')
				.ilike('username', `${debouncedQuery}%`);

			// Exclude current user from search results
			if (currentUserId) {
				query = query.neq('user_id', currentUserId);
			}

			const { data, error } = await query.limit(LIMITS.SEARCH_RESULTS_LIMIT);

			if (error) throw error;
			return data ?? [];
		},
		enabled: debouncedQuery.length >= 1,
		networkMode: 'online',
		staleTime: 0,
	});

	return {
		searchResults: searchResults ?? [],
		isLoadingSearch,
		errorSearch,
	};
}
