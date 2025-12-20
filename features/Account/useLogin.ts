import { useMutation } from '@tanstack/react-query';
import { requestEmailOtp } from './authHelpers';

export function useLogin() {
	const {
		mutate: login,
		isPending: isLoggingIn,
		error: errorLogin,
		reset: resetLogin,
	} = useMutation({
		networkMode: 'online', // Requires network to send OTP
		mutationFn: async (email: string) => {
			const { error } = await requestEmailOtp(email);
			if (error) {
				throw new Error(error);
			}
		},
	});

	return { login, isLoggingIn, errorLogin, resetLogin };
}
