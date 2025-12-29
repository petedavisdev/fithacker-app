import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/supabase/client';
import { queryKeys } from '@/shared/queries/queryKeys';
import { useAuthSession } from './useAuthSession';

type CreateProfileParams = {
	username: string;
};

export function useCreateProfile() {
	const queryClient = useQueryClient();
	const { authSession } = useAuthSession();
	const userId = authSession?.user?.id;

	const {
		mutate: createProfile,
		isPending: isCreatingProfile,
		error: errorCreateProfile,
	} = useMutation({
		mutationFn: async (params: CreateProfileParams) => {
			if (!userId) throw new Error('User not authenticated');

			const { data, error } = await supabase
				.from('user_profiles')
				.insert({
					user_id: userId,
					username: params.username,
				})
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
		},
		networkMode: 'online',
	});

	return {
		createProfile,
		isCreatingProfile,
		errorCreateProfile,
	};
}
