import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput, View } from 'react-native';
import { AText } from '@/shared/components/AText';
import { AButton } from '@/shared/components/AButton';
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
						className="font-ubuntu text-yellow-400 border-y-2 border-b-yellow-500 border-t-transparent pt-4 pb-4 focus:text-pink-400 focus:border-b-pink-500 outline-none w-96"
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
						<AButton
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
							isDisabled={isSubmitting || (isAppleReview && !token)}
						>
							{isSubmitting
								? '⏳'
								: isAppleReview
									? t('_auth.signIn')
									: t('_auth.sendCode')}
						</AButton>
					</View>
				</View>
			)}

			{step === 'token' && (
				<View className="mt-6 items-center">
					<AText className="mt-2 text-center">
						{t('_auth.enterMagicNumber', { email })}
					</AText>
					<TextInput
						className="text-yellow-400 border-y-2 border-b-yellow-500 border-t-transparent pt-4 pb-4 focus:text-pink-400 focus:border-b-pink-500 outline-none mt-4 w-24 text-center"
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
						<AButton
							onPress={() => {
								verifyOtp({ email, token });
							}}
							isDisabled={isVerifyingOtp}
						>
							{isVerifyingOtp ? '⏳' : '👍'}
						</AButton>

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
		</View>
	);
}
