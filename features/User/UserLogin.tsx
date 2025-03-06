import { Alert, AppState, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';

import { AButton } from '../Atoms/AButton';
import { supabase } from './supabase';
import { useTranslation } from 'react-i18next';

AppState.addEventListener('change', (state) => {
	if (state === 'active') {
		supabase.auth.startAutoRefresh();
	} else {
		supabase.auth.stopAutoRefresh();
	}
});

export function UserLogin() {
	const { t } = useTranslation();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	async function signInWithEmail() {
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (error) Alert.alert(error.message);
		setLoading(false);
	}

	async function signUpWithEmail() {
		setLoading(true);
		const {
			data: { session },
			error,
		} = await supabase.auth.signUp({
			email: email,
			password: password,
		});

		if (error) Alert.alert(error.message);
		if (!session)
			Alert.alert('Please check your inbox for email verification!');
		setLoading(false);
	}

	const [emailPlaceholder, setEmailPlaceholder] = useState(t('_@.email'));
	const [passwordPlaceholder, setPasswordPlaceholder] = useState(
		t('_@.password')
	);

	return (
		<>
			<Text className="font-mono text-cyan-400 text-2xl font-bold">
				{t('_@.login')}
			</Text>
			<Text className="font-mono text-cyan-400">
				{t('_@.loginDescription')}
			</Text>

			<TextInput
				placeholder={emailPlaceholder}
				placeholderTextColor={'hotpink'}
				className="text-lg text-yellow-400 font-mono border-y-2 border-b-yellow-500 border-t-transparent pb-3 pt-6 focus:border-yellow-200"
				value={email}
				onChangeText={(value) => setEmail(value)}
				onFocus={() => setEmailPlaceholder('')}
				onBlur={() => setEmailPlaceholder(t('_@.email'))}
				autoCapitalize={'none'}
				textContentType="emailAddress"
			/>

			<TextInput
				placeholder={passwordPlaceholder}
				className="text-lg text-yellow-400 font-mono border-y-2 border-b-yellow-500 border-t-transparent pb-3 pt-6 focus:border-yellow-200"
				onChangeText={(text) => setPassword(text)}
				value={password}
				placeholderTextColor={'hotpink'}
				secureTextEntry={true}
				autoCapitalize={'none'}
				onFocus={() => setPasswordPlaceholder('')}
				onBlur={() => setPasswordPlaceholder(t('_@.password'))}
				textContentType="password"
			/>

			<AButton isDisabled={loading} onPress={() => signInWithEmail()}>
				{t('_@.login')}
			</AButton>

			<AButton isDisabled={loading} onPress={() => signUpWithEmail()}>
				{t('_@.signup')}
			</AButton>
		</>
	);
}
