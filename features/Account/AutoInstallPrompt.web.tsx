import { useEffect, useRef } from 'react';
import { useExerciseLog } from '@/shared/queries/useExerciseLog';
import { usePromptInstall } from './usePromptInstall.web';

export function AutoInstallPrompt() {
	const { exerciseLog, isLoadingExerciseLog } = useExerciseLog();
	const { isInstallable, promptInstall } = usePromptInstall();
	const hasPromptedRef = useRef(false);

	useEffect(() => {
		if (hasPromptedRef.current || isLoadingExerciseLog || !isInstallable) {
			return;
		}

		// Check if Android
		const userAgent = navigator.userAgent.toLowerCase();
		const isAndroid = userAgent.includes('android');
		if (!isAndroid) {
			return;
		}

		// Check if exercise log is empty
		const isExerciseLogEmpty =
			!exerciseLog ||
			Object.keys(exerciseLog).length === 0 ||
			Object.values(exerciseLog).every((day) => !day || day.length === 0);

		if (isExerciseLogEmpty) {
			hasPromptedRef.current = true;
			// Small delay so app loads first
			setTimeout(() => {
				promptInstall();
			}, 1000);
		}
	}, [exerciseLog, isLoadingExerciseLog, isInstallable, promptInstall]);

	return null;
}
