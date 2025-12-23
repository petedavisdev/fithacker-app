import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/supabase/client';
import { queryKeys } from './queryKeys';

export function usePublicProfile(userId: string | null) {
	const {
		data: publicProfile,
		isLoading: isLoadingPublicProfile,
		error: errorPublicProfile,
	} = useQuery({
		queryKey: queryKeys.profiles.public(userId ?? ''),
		queryFn: async () => {
			if (!userId) return null;

			const { data, error } = await supabase
				.from('user_profiles')
				.select('user_id, username')
				.eq('user_id', userId)
				.single();

			if (error) {
				// Profile doesn't exist
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
		publicProfile: publicProfile ?? null,
		isLoadingPublicProfile,
		errorPublicProfile,
	};
}
