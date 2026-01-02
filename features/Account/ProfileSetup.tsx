import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Link, type Href } from 'expo-router';
import { AText } from '@/shared/components/AText';
import { UsernameInput } from './UsernameInput';

export function ProfileSetup() {
	const { t } = useTranslation();

	return (
		<>
			<AText size="xl" className="font-bold text-center mt-4">
				{t('_@.shareProfile')}
			</AText>

			<View className="mt-6 w-full max-w-xs">
				<UsernameInput mode="create" />
			</View>

			<View className="mt-8">
				<Link href={'/privacy' as Href}>
					<AText size="sm" className="underline text-center">
						{t('_@.privacyPolicy')}
					</AText>
				</Link>
			</View>
		</>
	);
}
