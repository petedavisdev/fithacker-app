import Constants from 'expo-constants';
import i18n from '@/shared/i18n';
import { supabase } from '@/shared/supabase/client';

export type AuthError =
	| 'invalidEmail'
	| 'otpExpired'
	| 'invalidOtp'
	| 'invalidPassword'
	| 'networkError'
	| null;

const appleReviewEmail =
	Constants.expoConfig?.extra?.appleReviewEmail ??
	process.env.EXPO_PUBLIC_APPLE_REVIEW_EMAIL;

export async function getCurrentUserId(): Promise<string | null> {
	const {
		data: { session },
	} = await supabase.auth.getSession();
	return session?.user?.id ?? null;
}

function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function isAppleReviewEmail(email: string): boolean {
	if (!appleReviewEmail) return false;
	return email.toLowerCase() === appleReviewEmail.toLowerCase();
}

export async function requestEmailOtp(
	email: string,
): Promise<{ error: AuthError }> {
	if (!isValidEmail(email)) {
		return { error: 'invalidEmail' };
	}

	// Apple review email uses password, not OTP
	if (isAppleReviewEmail(email)) {
		// For Apple review, we'll handle password in verifyEmailOtp
		// But we still need to return success here to show password field
		return { error: null };
	}

	const { error } = await supabase.auth.signInWithOtp({
		email,
		options: {
			shouldCreateUser: true,
			data: { language: i18n.language || 'en' },
		},
	});

	if (error) {
		console.error('Failed to request OTP:', error);
		return { error: 'networkError' };
	}

	return { error: null };
}

export async function verifyEmailOtp(
	email: string,
	token: string,
): Promise<{ error: AuthError }> {
	// Apple review email uses password authentication
	if (isAppleReviewEmail(email)) {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password: token, // token is actually password for Apple review
		});

		if (error) {
			console.error('Failed to sign in with password:', error);
			if (error.message?.includes('Invalid login credentials')) {
				return { error: 'invalidPassword' };
			}
			return { error: 'networkError' };
		}

		return { error: null };
	}

	// Normal OTP flow - try magiclink first, then signup
	let userId: string | undefined;

	// Try magiclink (login)
	const loginResponse = await supabase.auth.verifyOtp({
		email,
		token,
		type: 'email',
	});

	userId = loginResponse.data.user?.id;

	if (!userId) {
		// Try signup (registration)
		const signupResponse = await supabase.auth.verifyOtp({
			email,
			token,
			type: 'signup',
		});

		if (signupResponse.error) {
			console.error('Failed to verify OTP:', signupResponse.error);

			// Map Supabase errors to user-friendly messages
			if (signupResponse.error.message?.includes('expired')) {
				return { error: 'otpExpired' };
			} else if (signupResponse.error.message?.includes('invalid')) {
				return { error: 'invalidOtp' };
			} else {
				return { error: 'networkError' };
			}
		}

		userId = signupResponse.data.user?.id;
	}

	if (!userId) {
		return { error: 'networkError' };
	}

	return { error: null };
}

export async function signOut(): Promise<void> {
	const { error } = await supabase.auth.signOut();
	if (error) {
		console.error('Failed to sign out:', error);
	}
	// Note: Local data remains in AsyncStorage
}
