import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';
import { AButton } from '@/shared/components/AButton';
import { isAppleReviewEmail, type AuthError } from './authHelpers';
import { useLogin } from './useLogin';
import { useVerifyOtp } from './useVerifyOtp';

export function LoginForm() {
	const { t } = useTranslation();
	const [email, setEmail] = useState('');
	const [token, setToken] = useState('');
	const [step, setStep] = useState<'email' | 'token'>('email');
	const [emailPlaceholder, setEmailPlaceholder] = useState(t('_@.email'));

	const isAppleReview = isAppleReviewEmail(email);

	const { login, isLoggingIn, errorLogin, resetLogin } = useLogin();
	const { verifyOtp, isVerifyingOtp, errorVerifyOtp, resetVerifyOtp } =
		useVerifyOtp();

	const error = (errorLogin?.message ?? errorVerifyOtp?.message) as AuthError;

	return (
		<View className="flex-1 items-center justify-center p-4">
			<Text className="font-mono text-cyan-400 text-2xl font-bold text-center">
				{t('_@.login')}
			</Text>
			<Text className="font-mono text-cyan-400 mt-2 text-center">
				{t('_@.loginSubtitle')}
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
							resetLogin();
						}}
						onFocus={() => {
							resetLogin();
							setEmailPlaceholder('');
						}}
						onBlur={() => {
							if (!email) {
								setEmailPlaceholder(t('_@.email'));
							}
						}}
						keyboardType="email-address"
						autoCapitalize="none"
						editable={!isLoggingIn}
					/>
					{error && (
						<Text className="font-mono text-pink-400 mt-2">
							{t(`auth.${error}`)}
						</Text>
					)}
					<View className="mt-10 items-center">
						<Pressable
							onPress={() => {
								login(email, {
									onSuccess: () => {
										setStep('token');
									},
								});
							}}
							disabled={isLoggingIn}
						>
							<View
								className={`min-h-20 max-w-60 p-6 items-center justify-center border-2 border-yellow-500 rounded-full shadow shadow-yellow-500 ${
									isLoggingIn ? 'opacity-35' : ''
								}`}
							>
								<Text className="text-lg text-yellow-400 font-mono text-balance text-center">
									{isLoggingIn
										? '⏳'
										: isAppleReview
											? t('_@.enterPassword')
											: t('_@.sendCode')}
								</Text>
							</View>
						</Pressable>
					</View>
				</View>
			)}

			{step === 'token' && (
				<View className="mt-6">
					<Text className="font-mono text-cyan-400 mt-2">
						{isAppleReview
							? t('_@.enterPasswordFor', { email })
							: t('_@.enterMagicNumber', { email })}
					</Text>
					<TextInput
						className="text-lg text-yellow-400 font-mono border-y-2 border-b-yellow-500 border-t-transparent pb-3 pt-6 focus:text-pink-400 focus:border-b-pink-500 outline-none mt-4"
						value={token}
						onChangeText={(text) => {
							setToken(text);
							resetVerifyOtp();
						}}
						onFocus={() => resetVerifyOtp()}
						keyboardType={isAppleReview ? 'default' : 'number-pad'}
						secureTextEntry={isAppleReview}
						maxLength={isAppleReview ? undefined : 6}
						editable={!isVerifyingOtp}
					/>
					{error && (
						<Text className="font-mono text-pink-400 mt-2">
							{t(`auth.${error}`)}
						</Text>
					)}
					<View className="mt-10 items-center">
						<Pressable
							onPress={() => {
								verifyOtp({ email, token });
							}}
							disabled={isVerifyingOtp}
						>
							<View
								className={`min-h-20 max-w-60 p-6 items-center justify-center border-2 border-yellow-500 rounded-full shadow shadow-yellow-500 ${
									isVerifyingOtp ? 'opacity-35' : ''
								}`}
							>
								<Text className="text-lg text-yellow-400 font-mono text-balance text-center">
									{isVerifyingOtp
										? '⏳'
										: isAppleReview
											? t('_@.signIn')
											: t('_@.verify')}
								</Text>
							</View>
						</Pressable>
					</View>
				</View>
			)}
		</View>
	);
}
