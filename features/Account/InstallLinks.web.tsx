import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AButton } from '@/shared/components/AButton';
import { AText } from '@/shared/components/AText';
import { usePromptInstall } from './usePromptInstall.web';

export function InstallLinks() {
	const { t } = useTranslation();
	const { promptInstall, isPromptingInstall, isInstallable } =
		usePromptInstall();

	const userAgent = navigator.userAgent.toLowerCase();
	const isAndroid = userAgent.includes('android');
	const isIOS = /iphone|ipad|ipod/.test(userAgent);

	return (
		<View className="items-center gap-4 pb-8">
			{!isAndroid && (
				<View className="items-center">
					<a
						href="https://apps.apple.com/us/app/fithacker/id6737473687?platform=iphone"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
							alt="Download on the App Store"
							className="h-10"
						/>
					</a>
				</View>
			)}

			{isAndroid && isInstallable && (
				<View className="gap-2">
					<AButton
						onPress={() => promptInstall()}
						size="sm"
						color="cyan"
						isDisabled={isPromptingInstall}
					>
						📱
					</AButton>
					<AText color="cyan" shade={300} size="xs" className="text-center">
						Install App
					</AText>
				</View>
			)}

			{!isIOS && (!isInstallable || !isAndroid) && (
				<AText color="cyan" shade={300} size="xs" className="text-center px-4">
					{t('_@.androidInstallHint')}
				</AText>
			)}
		</View>
	);
}
