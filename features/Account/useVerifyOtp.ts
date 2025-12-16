import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyEmailOtp } from './authHelpers';
import { queryKeys } from '@/shared/queryKeys';

export function useVerifyOtp() {
	const queryClient = useQueryClient();

	const {
		mutate: verifyOtp,
		isPending: isVerifyingOtp,
		error: errorVerifyOtp,
	} = useMutation({
		mutationFn: async ({ email, token }: { email: string; token: string }) => {
			const { error } = await verifyEmailOtp(email, token);
			if (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
			queryClient.invalidateQueries({ queryKey: queryKeys.exerciseLog });
		},
	});

	return { verifyOtp, isVerifyingOtp, errorVerifyOtp };
}
