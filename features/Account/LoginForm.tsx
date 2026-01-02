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
	const [emailPlaceholder, setEmailPlaceholder] = useState(t('_@.email'));

	const isAppleReview = isAppleReviewEmail(email);

	const { login, isLoggingIn, errorLogin, resetLogin } = useLogin();
	const { verifyOtp, isVerifyingOtp, errorVerifyOtp, resetVerifyOtp } =
		useVerifyOtp();

	const error = (errorLogin?.message ?? errorVerifyOtp?.message) as AuthError;

	return (
		<View className="flex-1 items-center justify-center p-4">
			<AText size="2xl" className="font-bold text-center">
				{t('_@.login')}
			</AText>
			<AText className="mt-2 text-center">{t('_@.loginSubtitle')} 💻📲</AText>

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
						autoComplete="email"
						textContentType="emailAddress"
						autoCapitalize="none"
						editable={!isLoggingIn}
					/>
					{error && (
						<AText color="pink" className="mt-2">
							{t(`auth.${error}`)}
						</AText>
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
								className={`min-h-20 max-w-60 p-6 items-center justify-center border-2 border-yellow-500 rounded-full ${
									isLoggingIn ? 'opacity-35' : ''
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
									{isLoggingIn
										? '⏳'
										: isAppleReview
											? t('_@.enterPassword')
											: t('_@.sendCode')}
								</AText>
							</View>
						</Pressable>
					</View>
				</View>
			)}

			{step === 'token' && (
				<View className="mt-6">
					<AText className="mt-2">
						{isAppleReview
							? t('_@.enterPasswordFor', { email })
							: t('_@.enterMagicNumber', { email })}
					</AText>
					<TextInput
						className="text-yellow-400 border-y-2 border-b-yellow-500 border-t-transparent pt-4 pb-4 focus:text-pink-400 focus:border-b-pink-500 outline-none mt-4"
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
						<AText color="pink" className="mt-2">
							{t(`auth.${error}`)}
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
									{isVerifyingOtp
										? '⏳'
										: isAppleReview
											? t('_@.signIn')
											: t('_@.verify')}
								</AText>
							</View>
						</Pressable>

						{!isAppleReview && (
							<View className="items-center gap-3">
								<AText className="text-center">
									📨 {t('_@.checkInboxAndJunkMail')} 👀
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
									<AText className="underline">{t('_@.tryAgain')}</AText>
								</Pressable>
							</View>
						)}
					</View>
				</View>
			)}

			<View className="mt-8 items-center">
				<AText shade={300} size="xs" className="text-center mb-2">
					{t('_@.emailNeverShared')}
				</AText>
				<Link href={'/privacy' as Href}>
					<AText size="sm" className="underline text-center">
						{t('_@.privacyPolicy')}
					</AText>
				</Link>
			</View>
		</View>
	);
}
