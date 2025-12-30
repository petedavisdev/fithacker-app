import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/supabase/client';
import { queryKeys } from '@/shared/queries/queryKeys';
import { useAuthSession } from './useAuthSession';
import { useUserProfile } from './useUserProfile';
import i18n from '@/shared/i18n';

type UpdateViewedUsersParams = { userId: string };

export function useUpdateViewedUsers() {
	const queryClient = useQueryClient();
	const { authSession } = useAuthSession();
	const { userProfile } = useUserProfile();
	const userId = authSession?.user?.id;

	const {
		mutate: updateViewedUsers,
		isPending: isUpdatingViewedUsers,
		error: errorUpdateViewedUsers,
	} = useMutation({
		mutationFn: async (params: UpdateViewedUsersParams) => {
			if (!userId) throw new Error('User not authenticated');
			if (!userProfile) throw new Error('Profile not found');

			const currentViewedIds = userProfile.viewed_user_ids ?? [];

			// Add to start, deduplicated
			const newViewedIds = [
				params.userId,
				...currentViewedIds.filter((id) => id !== params.userId),
			];

			const language = i18n.language || null;

			const { data, error } = await supabase
				.from('user_profiles')
				.update({ 
					viewed_user_ids: newViewedIds,
					language,
				})
				.eq('user_id', userId)
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: (data) => {
			queryClient.setQueryData(queryKeys.profiles.own, data);
			// Invalidate to ensure UI updates
			queryClient.invalidateQueries({
				queryKey: queryKeys.profiles.own,
			});
			// Invalidate batch queries (recently viewed) since viewed_user_ids changed
			queryClient.invalidateQueries({
				queryKey: ['profiles', 'batch'],
			});
		},
		networkMode: 'online',
	});

	return {
		updateViewedUsers,
		isUpdatingViewedUsers,
		errorUpdateViewedUsers,
	};
}
