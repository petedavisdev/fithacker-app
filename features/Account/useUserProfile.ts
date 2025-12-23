import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/supabase/client';
import { queryKeys } from '@/shared/queries/queryKeys';
import { useAuthSession } from './useAuthSession';

export function useUserProfile() {
	const { authSession } = useAuthSession();
	const userId = authSession?.user?.id;

	const {
		data: userProfile,
		isLoading: isLoadingUserProfile,
		error: errorUserProfile,
	} = useQuery({
		queryKey: queryKeys.profiles.own,
		queryFn: async () => {
			if (!userId) return null;

			const { data, error } = await supabase
				.from('user_profiles')
				.select('*')
				.eq('user_id', userId)
				.single();

			if (error) {
				// Profile doesn't exist yet
				if (error.code === 'PGRST116') {
					return null;
				}
				throw error;
			}

			return data;
		},
		enabled: !!userId,
		networkMode: 'online',
		staleTime: 0,
	});

	return {
		userProfile: userProfile ?? null,
		isLoadingUserProfile,
		errorUserProfile,
	};
}
