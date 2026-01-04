import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput, View } from 'react-native';
import { Link, type Href } from 'expo-router';
import { AText } from '@/shared/components/AText';
import { isAppleReviewEmail, type AuthError } from './authHelpers';
import { useLogin } from './useLogin';
import { useVerifyOtp } from './useVerifyOtp';

export function LoginForm() {
	const { t } = useTranslation();
	const [email, setEmail] = useState('');
	const [token, setToken] = useState('');
	const [step, setStep] = useState<'email' | 'token'>('email');
	const [emailPlaceholder, setEmailPlaceholder] = useState(t('_auth.email'));

	const isAppleReview = isAppleReviewEmail(email);

	const { login, isLoggingIn, errorLogin, resetLogin } = useLogin();
	const { verifyOtp, isVerifyingOtp, errorVerifyOtp, resetVerifyOtp } =
		useVerifyOtp();

	const error = (errorLogin?.message ?? errorVerifyOtp?.message) as AuthError;

	const showPasswordField = isAppleReview && email && step === 'email';
	const isSubmitting = isLoggingIn || isVerifyingOtp;

	return (
		<View className="flex-1 items-center justify-center p-4">
			<AText size="2xl" className="font-bold text-center">
				{t('_auth.login')}
			</AText>
			<AText className="mt-2 text-center">
				{t('_auth.loginSubtitle')} 💻📲
			</AText>

			{step === 'email' && (
				<View className="mt-6">
					<TextInput
						placeholder={emailPlaceholder}
						placeholderTextColor={'#f472b6'}
						className="font-sans text-yellow-400 border-y-2 border-b-yellow-500 border-t-transparent pt-4 pb-4 focus:text-pink-400 focus:border-b-pink-500 outline-none"
						value={email}
						onChangeText={(text) => {
							setEmail(text);
							resetLogin();
							resetVerifyOtp();
						}}
						onFocus={() => {
							resetLogin();
							setEmailPlaceholder('');
						}}
						onBlur={() => {
							if (!email) {
								setEmailPlaceholder(t('_auth.email'));
							}
						}}
						keyboardType="email-address"
						autoComplete="email"
						textContentType="emailAddress"
						autoCapitalize="none"
						editable={!isSubmitting}
					/>
					{showPasswordField && (
						<>
							<AText className="mt-4">{t('_auth.password')}</AText>
							<TextInput
								className="text-yellow-400 border-y-2 border-b-yellow-500 border-t-transparent pt-4 pb-4 focus:text-pink-400 focus:border-b-pink-500 outline-none mt-4"
								value={token}
								onChangeText={(text) => {
									setToken(text);
									resetVerifyOtp();
								}}
								onFocus={() => resetVerifyOtp()}
								keyboardType="default"
								secureTextEntry={true}
								editable={!isSubmitting}
								autoCapitalize="none"
								autoComplete="password"
								textContentType="password"
							/>
						</>
					)}
					{error && (
						<AText color="pink" className="mt-2">
							{t(`_errors.${error}`)}
						</AText>
					)}
					<View className="mt-10 items-center">
						<Pressable
							onPress={() => {
								if (isAppleReview && token) {
									// For Apple review, verify password directly
									verifyOtp({ email, token });
								} else if (!isAppleReview) {
									// For normal emails, send OTP
									login(email, {
										onSuccess: () => {
											setStep('token');
										},
									});
								}
							}}
							disabled={isSubmitting || (isAppleReview && !token)}
						>
							<View
								className={`min-h-20 max-w-60 p-6 items-center justify-center border-2 border-yellow-500 rounded-full ${
									isSubmitting || (isAppleReview && !token) ? 'opacity-35' : ''
								}`}
								style={{
									shadowColor: '#eab308',
									shadowOffset: { width: 0, height: 2 },
									shadowOpacity: 0.25,
									shadowRadius: 3.84,
									elevation: 5,
								}}
							>
								<AText
									color="yellow"
									size="lg"
									className="text-balance text-center"
								>
									{isSubmitting
										? '⏳'
										: isAppleReview
											? t('_auth.signIn')
											: t('_auth.sendCode')}
								</AText>
							</View>
						</Pressable>
					</View>
				</View>
			)}

			{step === 'token' && (
				<View className="mt-6">
					<AText className="mt-2">
						{t('_auth.enterMagicNumber', { email })}
					</AText>
					<TextInput
						className="text-yellow-400 border-y-2 border-b-yellow-500 border-t-transparent pt-4 pb-4 focus:text-pink-400 focus:border-b-pink-500 outline-none mt-4"
						value={token}
						onChangeText={(text) => {
							setToken(text);
							resetVerifyOtp();
						}}
						onFocus={() => resetVerifyOtp()}
						keyboardType="number-pad"
						maxLength={6}
						editable={!isVerifyingOtp}
					/>
					{error && (
						<AText color="pink" className="mt-2">
							{t(`_errors.${error}`)}
						</AText>
					)}
					<View className="mt-10 items-center gap-6">
						<Pressable
							onPress={() => {
								verifyOtp({ email, token });
							}}
							disabled={isVerifyingOtp}
						>
							<View
								className={`min-h-20 max-w-60 p-6 items-center justify-center border-2 border-yellow-500 rounded-full ${
									isVerifyingOtp ? 'opacity-35' : ''
								}`}
								style={{
									shadowColor: '#eab308',
									shadowOffset: { width: 0, height: 2 },
									shadowOpacity: 0.25,
									shadowRadius: 3.84,
									elevation: 5,
								}}
							>
								<AText
									color="yellow"
									size="lg"
									className="text-balance text-center"
								>
									{isVerifyingOtp ? '⏳' : t('_auth.verify')}
								</AText>
							</View>
						</Pressable>

						<View className="items-center gap-3">
							<AText className="text-center">
								📨 {t('_auth.checkInboxAndJunkMail')} 👀
							</AText>
							<Pressable
								onPress={() => {
									setToken('');
									setStep('email');
									resetVerifyOtp();
									resetLogin();
								}}
								disabled={isVerifyingOtp}
							>
								<AText className="underline">{t('_auth.tryAgain')}</AText>
							</Pressable>
						</View>
					</View>
				</View>
			)}

			<View className="mt-8 items-center">
				<AText shade={300} size="xs" className="text-center mb-2">
					{t('_auth.emailNeverShared')}
				</AText>
				<Link href={'/privacy' as Href}>
					<AText size="sm" className="underline text-center">
						{t('_account.privacyPolicy')}
					</AText>
				</Link>
			</View>
		</View>
	);
}
