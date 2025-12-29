import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/supabase/client';
import { queryKeys } from '@/shared/queries/queryKeys';
import { useAuthSession } from './useAuthSession';

type UpdateProfileParams = {
	username: string;
};

export function useUpdateProfile() {
	const queryClient = useQueryClient();
	const { authSession } = useAuthSession();
	const userId = authSession?.user?.id;

	const {
		mutate: updateProfile,
		isPending: isUpdatingProfile,
		error: errorUpdateProfile,
	} = useMutation({
		mutationFn: async (params: UpdateProfileParams) => {
			if (!userId) throw new Error('User not authenticated');

			const { data, error } = await supabase
				.from('user_profiles')
				.update({
					username: params.username,
				})
				.eq('user_id', userId)
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: (data) => {
			queryClient.setQueryData(queryKeys.profiles.own, data);
			// Invalidate related queries to ensure UI updates
			queryClient.invalidateQueries({
				queryKey: queryKeys.profiles.own,
			});
			// Invalidate public profile queries that might be cached
			if (data?.user_id) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.profiles.public(data.user_id),
				});
			}
			// Invalidate search queries since username changed
			queryClient.invalidateQueries({
				queryKey: ['profiles', 'search'],
			});
			// Invalidate batch queries that might include this user
			queryClient.invalidateQueries({
				queryKey: ['profiles', 'batch'],
			});
		},
		networkMode: 'online',
	});

	return {
		updateProfile,
		isUpdatingProfile,
		errorUpdateProfile,
	};
}
