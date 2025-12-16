import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';
import { AButton } from '@/shared/Atoms/AButton';
import { TheHeader } from '@/features/TheHeader/TheHeader';
import { isAppleReviewEmail, type AuthError } from './authHelpers';
import { useLogin } from './useLogin';
import { useVerifyOtp } from './useVerifyOtp';

export function LoginForm() {
	const { t } = useTranslation();
	const [email, setEmail] = useState('');
	const [token, setToken] = useState('');
	const [step, setStep] = useState<'email' | 'token'>('email');
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

	const loginMutation = useLogin();
	const verifyOtpMutation = useVerifyOtp();

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
								onPress={() => {
									loginMutation.mutate(email, {
										onSuccess: () => {
											setStep('token');
											setError(null);
										},
										onError: (mutationError) => {
											setError(
												(mutationError as Error).message as AuthError,
											);
										},
									});
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
								onPress={() => {
									verifyOtpMutation.mutate(
										{ email, token },
										{
											onSuccess: () => {
												setError(null);
											},
											onError: (mutationError) => {
												setError(
													(mutationError as Error).message as AuthError,
												);
											},
										},
									);
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

