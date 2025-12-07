import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';
import { AButton } from '@/features/Atoms/AButton';
import { TheHeader } from '@/features/TheHeader/TheHeader';
import { useNetworkStatus } from '@/features/supabase/useNetworkStatus';
import {
	isLoggedIn,
	requestEmailOtp,
	verifyEmailOtp,
	signOut,
	getUserEmail,
	onAuthStateChange,
	isAppleReviewEmail,
	type AuthError,
} from '@/features/supabase/auth';
import { getPendingSync, clearSyncState } from '@/features/supabase/syncState';
import { useBackgroundSync } from '@/features/supabase/useBackgroundSync';

export default function AccountScreen() {
	const { t } = useTranslation();
	const { isOnline } = useNetworkStatus();
	useBackgroundSync(); // Activates automatic background sync
	const [loggedIn, setLoggedIn] = useState(false);
	const [email, setEmail] = useState('');
	const [token, setToken] = useState('');
	const [step, setStep] = useState<'email' | 'token'>('email');
	const [userEmail, setUserEmail] = useState<string | null>(null);
	const [pendingCount, setPendingCount] = useState(0);
	const [error, setError] = useState<AuthError>(null);
	const [emailPlaceholder, setEmailPlaceholder] = useState(t('_@.email'));
	const [tokenPlaceholder, setTokenPlaceholder] = useState('000000');

	const isAppleReview = isAppleReviewEmail(email);

	// Update token placeholder when step changes to token
	useEffect(() => {
		if (step === 'token') {
			setTokenPlaceholder(isAppleReview ? 'Password' : '000000');
		}
	}, [isAppleReview, step]);

	useEffect(() => {
		async function loadAuthState() {
			const authenticated = await isLoggedIn();
			setLoggedIn(authenticated);

			if (authenticated) {
				const email = await getUserEmail();
				setUserEmail(email);
			}

			// Show pending sync count
			const pending = await getPendingSync();
			setPendingCount(Object.keys(pending).length);
		}

		loadAuthState();

		// Listen for auth state changes
		const {
			data: { subscription },
		} = onAuthStateChange((loggedIn) => {
			setLoggedIn(loggedIn);
			if (loggedIn) {
				getUserEmail().then(setUserEmail);
				getPendingSync().then((pending) => {
					setPendingCount(Object.keys(pending).length);
				});
			} else {
				setUserEmail(null);
				setStep('email');
				setError(null);
				setPendingCount(0);
			}
		});

		return () => subscription?.unsubscribe();
	}, []);

	// Offline state trumps everything
	if (!isOnline) {
		return (
			<>
				<TheHeader buttonLeft="account" />
				<View className="flex-1 items-center justify-center p-4">
					<Text className="font-mono text-cyan-400 text-2xl font-bold text-center">
						You are offline
					</Text>
					<Text className="font-mono text-cyan-400 mt-4 text-center">
						{loggedIn
							? 'No problem! Your data will sync automatically when you are online again.'
							: 'No problem! When you are online, login to backup and sync your data.'}
					</Text>
				</View>
			</>
		);
	}

	// Not logged in: Show login form
	if (!loggedIn) {
		return (
			<>
				<TheHeader buttonLeft="account" />
				<View className="flex-1 items-center justify-center p-4">
					<Text className="font-mono text-cyan-400 text-2xl font-bold text-center">
						{t('_@.login')}
					</Text>
					<Text className="font-mono text-cyan-400 mt-2 text-center">
						Login to backup your exercise log and use fithacker on your other
						devices
					</Text>

				{step === 'email' && (
					<View className="mt-6">
						<TextInput
							placeholder={emailPlaceholder}
							placeholderTextColor={'#f472b6'}
							className="text-yellow-400 font-mono border-y-2 border-b-yellow-500 border-t-transparent pb-3 pt-6 focus:text-pink-400 focus:border-b-pink-500 outline-none"
							value={email}
							onChangeText={(text) => {
								setEmail(text);
								setError(null); // Clear error on input
							}}
							onFocus={() => {
								setError(null);
								setEmailPlaceholder('');
							}}
							onBlur={() => {
								if (!email) {
									setEmailPlaceholder(t('_@.email'));
								}
							}}
							keyboardType="email-address"
							autoCapitalize="none"
						/>
						{error === 'invalidEmail' && (
							<Text className="font-mono text-pink-400 mt-2">
								{t('auth.invalidEmail')}
							</Text>
						)}
						{error === 'networkError' && (
							<Text className="font-mono text-pink-400 mt-2">
								{t('auth.networkError')}
							</Text>
						)}
						<View className="mt-10 items-center">
							<Pressable
								onPress={async () => {
									const { error } = await requestEmailOtp(email);
									if (error) {
										setError(error);
									} else {
										setStep('token');
										setError(null);
									}
								}}
							>
								<View className="min-h-20 max-w-60 p-6 items-center justify-center border-2 border-yellow-500 rounded-full shadow shadow-yellow-500">
									<Text className="text-lg text-yellow-400 font-mono text-balance text-center">
										{isAppleReview
											? 'Enter Password'
											: t('_@.sendCode')}
									</Text>
								</View>
							</Pressable>
							<View className="mt-6">
								<AButton href="/" color="pink" size="sm">
									👈
								</AButton>
							</View>
						</View>
					</View>
				)}

				{step === 'token' && (
					<View className="mt-6">
						<Text className="font-mono text-cyan-400 mt-2">
							{isAppleReview
								? `Enter password for ${email}`
								: `Enter the 6-digit code sent to ${email}`}
						</Text>
						<TextInput
							placeholder={tokenPlaceholder}
							placeholderTextColor={'#f472b6'}
							className="text-lg text-yellow-400 font-mono border-y-2 border-b-yellow-500 border-t-transparent pb-3 pt-6 focus:text-pink-400 focus:border-b-pink-500 outline-none mt-4"
							value={token}
							onChangeText={(text) => {
								setToken(text);
								setError(null); // Clear error on input
							}}
							onFocus={() => {
								setError(null);
								setTokenPlaceholder('');
							}}
							onBlur={() => {
								if (!token) {
									setTokenPlaceholder(isAppleReview ? 'Password' : '000000');
								}
							}}
							keyboardType={isAppleReview ? 'default' : 'number-pad'}
							secureTextEntry={isAppleReview}
							maxLength={isAppleReview ? undefined : 6}
						/>
						{error === 'otpExpired' && (
							<Text className="font-mono text-pink-400 mt-2">
								{t('auth.otpExpired')}
							</Text>
						)}
						{error === 'invalidOtp' && (
							<Text className="font-mono text-pink-400 mt-2">
								{t('auth.invalidOtp')}
							</Text>
						)}
						{error === 'invalidPassword' && (
							<Text className="font-mono text-pink-400 mt-2">
								{t('auth.invalidPassword')}
							</Text>
						)}
						{error === 'networkError' && (
							<Text className="font-mono text-pink-400 mt-2">
								{t('auth.networkError')}
							</Text>
						)}
						<View className="mt-10 items-center">
							<Pressable
								onPress={async () => {
									const { error } = await verifyEmailOtp(email, token);
									if (error) {
										setError(error);
									} else {
										// Success handled by auth state change listener
										setError(null);
									}
								}}
							>
								<View className="min-h-20 max-w-60 p-6 items-center justify-center border-2 border-yellow-500 rounded-full shadow shadow-yellow-500">
									<Text className="text-lg text-yellow-400 font-mono text-balance text-center">
										{isAppleReview ? 'Sign In' : 'Verify'}
									</Text>
								</View>
							</Pressable>
							<View className="mt-6">
								<AButton href="/" color="pink" size="sm">
									👈
								</AButton>
							</View>
						</View>
					</View>
				)}
			</View>
			</>
		);
	}

	// Logged in: Show account info
	return (
		<>
			<TheHeader buttonLeft="account" />
			<View className="flex-1 items-center justify-center p-4">
				<Text className="font-mono text-cyan-400 text-2xl font-bold text-center">
					Logged in as {userEmail}
				</Text>
				<Text className="font-mono text-cyan-400 mt-2 text-center">
					Your exercise log is safely backed-up and synced across all your
					devices
				</Text>
				{pendingCount > 0 && (
					<Text className="font-mono text-yellow-400 mt-2 text-center">
						{pendingCount} days waiting to sync
					</Text>
				)}

				{!isOnline && (
					<Text className="font-mono text-cyan-400 mt-4 text-center">
						You are offline. Sync will resume when you're back online.
					</Text>
				)}

				<View className="flex-row justify-center items-center px-4 mt-10">
					<AButton href="/chart">👍</AButton>
				</View>

				<View className="mt-10 items-center">
					<Pressable
						onPress={async () => {
							await signOut();
							await clearSyncState(); // Clear sync state on sign out (sets to {})
							// Auth state change listener will handle UI updates
							setPendingCount(0);
						}}
					>
						<View className="min-h-20 max-w-60 p-6 items-center justify-center border-2 border-pink-500 rounded-full shadow shadow-pink-500">
							<Text className="text-lg text-pink-400 font-mono text-balance text-center">
								Sign Out
							</Text>
						</View>
					</Pressable>
				</View>
			</View>
		</>
	);
}
