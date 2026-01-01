import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/supabase/client';
import { queryKeys } from '@/shared/queries/queryKeys';
import { useAuthSession } from './useAuthSession';
import { useUserProfile } from './useUserProfile';
import { LIMITS, STALE_TIME } from '@/shared/utils/constants';

export function useSuggestedProfiles() {
	const { authSession } = useAuthSession();
	const { userProfile } = useUserProfile();
	const currentUserId = authSession?.user?.id;
	const userLanguage = userProfile?.language
		? userProfile.language.slice(0, 2)
		: null;

	const {
		data: suggestedProfiles,
		isLoading: isLoadingSuggestedProfiles,
		error: errorSuggestedProfiles,
	} = useQuery({
		queryKey: queryKeys.profiles.suggested,
		queryFn: async () => {
			if (!currentUserId) return [];

			let query = supabase
				.from('user_profiles')
				.select('user_id, username')
				.order('updated_at', { ascending: false });

			// Exclude current user
			query = query.neq('user_id', currentUserId);

			// Filter by same language if available (match first 2 characters)
			if (userLanguage) {
				query = query.filter('language', 'ilike', `${userLanguage}%`);
			}

			const { data, error } = await query.limit(LIMITS.SUGGESTIONS_LIMIT);

			if (error) throw error;

			// Fallback: if no same-language results, fetch any recent users
			if ((data?.length ?? 0) === 0 && userLanguage) {
				const { data: fallbackData, error: fallbackError } = await supabase
					.from('user_profiles')
					.select('user_id, username')
					.neq('user_id', currentUserId)
					.order('updated_at', { ascending: false })
					.limit(LIMITS.SUGGESTIONS_LIMIT);

				if (fallbackError) throw fallbackError;
				return fallbackData ?? [];
			}

			return data ?? [];
		},
		enabled: !!currentUserId && !!userProfile,
		networkMode: 'online',
		staleTime: STALE_TIME.PROFILE_QUERIES,
	});

	return {
		suggestedProfiles: suggestedProfiles ?? [],
		isLoadingSuggestedProfiles,
		errorSuggestedProfiles,
	};
}
