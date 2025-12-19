import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyEmailOtp } from './authHelpers';
import { queryKeys } from '@/shared/queries/queryKeys';

type VerifyPayload = {
	email: string;
	token: string;
};

export function useVerifyOtp() {
	const queryClient = useQueryClient();

	const {
		mutate: verifyOtp,
		isPending: isVerifyingOtp,
		error: errorVerifyOtp,
		reset: resetVerifyOtp,
	} = useMutation({
		networkMode: 'online', // Requires network to verify OTP
		mutationFn: async ({ email, token }: VerifyPayload) => {
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

	return { verifyOtp, isVerifyingOtp, errorVerifyOtp, resetVerifyOtp };
}


