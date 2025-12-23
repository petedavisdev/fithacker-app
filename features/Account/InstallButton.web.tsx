import { View, Text } from 'react-native';
import { AButton } from '@/shared/components/AButton';
import { useInstallPrompt } from './useInstallPrompt.web';

export function InstallButton() {
	const { canInstall, promptInstall } = useInstallPrompt();

	if (!canInstall) {
		return null;
	}

	async function handleInstall() {
		const accepted = await promptInstall();
		if (accepted) {
			console.log('[PWA] User installed the app');
		}
	}

	return (
		<View className="gap-2">
			<AButton onPress={handleInstall} size="sm" color="cyan">
				📱
			</AButton>
			<Text className="text-slate-400 text-xs text-center">Install App</Text>
		</View>
	);
}
