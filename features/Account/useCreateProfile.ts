import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/supabase/client';
import { queryKeys } from '@/shared/queries/queryKeys';
import { useAuthSession } from './useAuthSession';
import i18n from '@/shared/i18n';

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

			const language = i18n.language || null;

			const { data, error } = await supabase
				.from('user_profiles')
				.insert({
					user_id: userId,
					username: params.username,
					language,
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
			// Invalidate suggestions since a new user might appear
			queryClient.invalidateQueries({
				queryKey: queryKeys.profiles.suggested,
			});
		},
		networkMode: 'online',
	});

	return {
		createProfile,
		isCreatingProfile,
		errorCreateProfile,
	};
}
