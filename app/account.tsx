import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';

export default function account() {
	const { t } = useTranslation();
	const [email, setEmail] = useState('');
	const [placeholder, setPlaceholder] = useState(t('_@.email'));

	return (
		<View className="p-4">
			<Text className="font-mono text-cyan-400 text-2xl font-bold">
				{t('_@.login')}
			</Text>
			<Text className="font-mono text-cyan-400">
				{t('_@.loginDescription')}
			</Text>

			<TextInput
				placeholder={placeholder}
				placeholderTextColor={'hotpink'}
				className="text-lg text-yellow-400 font-mono border-y-2 border-b-yellow-500 border-t-transparent pb-3 pt-6 focus:border-yellow-200"
				value={email}
				onChangeText={(value) => setEmail(value)}
				onFocus={() => setPlaceholder('')}
				onBlur={() => setPlaceholder(t('_@.email'))}
			/>

			<View className="mt-10 items-center">
				<Pressable>
					<View className="min-h-20 max-w-60 p-6 items-center justify-center border-2 border-yellow-500 rounded-full shadow shadow-yellow-500">
						<Text className="text-lg text-yellow-400 font-mono text-balance text-center">
							{t('_@.sendCode')}
						</Text>
					</View>
				</Pressable>
			</View>
		</View>
	);
}
