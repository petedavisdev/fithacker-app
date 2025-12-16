import { useMutation } from '@tanstack/react-query';
import { isAppleReviewEmail, isValidEmail, requestEmailOtp } from './authHelpers';

export function useLogin() {
	const {
		mutate: login,
		isPending: isLoggingIn,
		error: errorLogin,
	} = useMutation({
		mutationFn: async (email: string) => {
			if (!isValidEmail(email)) {
				throw new Error('invalidEmail');
			}

			if (isAppleReviewEmail(email)) {
				return;
			}

			const { error } = await requestEmailOtp(email);
			if (error) {
				throw new Error(error);
			}
		},
	});

	return { login, isLoggingIn, errorLogin };
}
