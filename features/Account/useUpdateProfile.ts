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
		},
		networkMode: 'online',
	});

	return {
		updateProfile,
		isUpdatingProfile,
		errorUpdateProfile,
	};
}
