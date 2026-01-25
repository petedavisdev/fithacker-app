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

	// Determine if there's any content to show
	const hasAppStoreBadge = !isAndroid;
	const hasInstallButton = isAndroid && isInstallable;
	const hasInstallHint = !isIOS && (!isInstallable || !isAndroid);
	const hasContent = hasAppStoreBadge || hasInstallButton || hasInstallHint;

	if (!hasContent) {
		return null;
	}

	return (
		<View className="w-96 self-center items-center gap-4 pb-8">
			{hasAppStoreBadge && (
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

			{hasInstallButton && (
				<AButton
					onPress={() => promptInstall()}
					size="sm"
					isDisabled={isPromptingInstall}
				>
					📱 {t('_account.installApp')}
				</AButton>
			)}

			{hasInstallHint && (
				<AText color="cyan" shade={300} size="xs" className="text-center px-4">
					{t('_account.androidInstallHint')}
				</AText>
			)}
		</View>
	);
}
