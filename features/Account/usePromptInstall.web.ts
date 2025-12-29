import { useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

type BeforeInstallPromptEvent = Event & {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function usePromptInstall() {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [isInstallable, setIsInstallable] = useState(false);

	useEffect(() => {
		const captureBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			const promptEvent = e as BeforeInstallPromptEvent;
			setDeferredPrompt(promptEvent);
			setIsInstallable(true);
		};

		window.addEventListener('beforeinstallprompt', captureBeforeInstallPrompt);

		if (window.matchMedia('(display-mode: standalone)').matches) {
			setIsInstallable(false);
			console.log('[PWA] App already installed');
		}

		return () => {
			window.removeEventListener('beforeinstallprompt', captureBeforeInstallPrompt);
		};
	}, []);

	const {
		mutate: promptInstall,
		isPending: isPromptingInstall,
		error: errorPromptInstall,
	} = useMutation({
		mutationFn: async () => {
			if (!deferredPrompt) {
				throw new Error('No install prompt available');
			}

			await deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			console.log('[PWA] Install prompt outcome:', outcome);

			if (outcome === 'accepted') {
				setIsInstallable(false);
			}

			setDeferredPrompt(null);
			return outcome;
		},
	});

	return {
		promptInstall,
		isPromptingInstall,
		errorPromptInstall,
		isInstallable,
	};
}

