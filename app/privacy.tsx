import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { TheHeader } from '@/shared/components/TheHeader';
import { AButton } from '@/shared/components/AButton';
import { AText } from '@/shared/components/AText';

export default function PrivacyScreen() {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<View className="flex-1">
			<TheHeader buttonLeft="back" buttonRight="chart" />

			<KeyboardAwareScrollView keyboardOpeningTime={0} className="flex-1 p-6">
				<View className="max-w-2xl mx-auto">
					<AText size="3xl" className="font-bold mb-6">
						{t('_privacy.title')}
					</AText>

					<View className="mb-6">
						<AText color="yellow" size="xl" className="font-bold mb-2">
							{t('_privacy.noTrackingTitle')}
						</AText>
						<AText size="base" className="leading-6">
							{t('_privacy.noTrackingDescription')}
						</AText>
					</View>

					<View className="mb-6">
						<AText color="yellow" size="xl" className="font-bold mb-2">
							{t('_privacy.emailOptionalTitle')}
						</AText>
						<AText size="base" className="leading-6">
							{t('_privacy.emailOptionalDescription')}
						</AText>
					</View>

					<View className="mb-6">
						<AText color="yellow" size="xl" className="font-bold mb-2">
							{t('_privacy.dataStorageTitle')}
						</AText>
						<AText size="base" className="leading-6">
							{t('_privacy.dataStorageDescription')}
						</AText>
					</View>

					<View className="mb-6">
						<AText color="yellow" size="xl" className="font-bold mb-2">
							{t('_privacy.dataControlTitle')}
						</AText>
						<AText size="base" className="leading-6">
							{t('_privacy.dataControlDescription')}
						</AText>
					</View>

					<View className="mb-6">
						<AText color="yellow" size="xl" className="font-bold mb-2">
							{t('_privacy.thirdPartyTitle')}
						</AText>
						<AText size="base" className="leading-6">
							{t('_privacy.thirdPartyDescription')}
						</AText>
					</View>

					<View className="mt-8 mb-6">
						<AText shade={300} size="sm" className="leading-6">
							{t('_privacy.contactInfo')}
						</AText>
					</View>

					<View className="mt-8 mb-6 items-center">
						<AButton
							onPress={() => {
								router.back();
							}}
						>
							👍
						</AButton>
					</View>
				</View>
			</KeyboardAwareScrollView>
		</View>
	);
}
