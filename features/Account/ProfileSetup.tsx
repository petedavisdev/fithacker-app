import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { UsernameInput } from './UsernameInput';

export function ProfileSetup() {
	const { t } = useTranslation();

	return (
		<>
			<Text className="font-mono text-cyan-400 text-xl font-bold text-center mt-4">
				{t('_@.shareProfile')}
			</Text>

			<View className="mt-6 w-full max-w-xs">
				<UsernameInput mode="create" />
			</View>
		</>
	);
}
