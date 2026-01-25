import { useState, useEffect } from 'react';

type BeforeInstallPromptEvent = Event & {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function useInstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [isAndroid, setIsAndroid] = useState(false);
	const [isInstallable, setIsInstallable] = useState(false);

	useEffect(() => {
		// Check if Android
		if (typeof window !== 'undefined') {
			const ua = navigator.userAgent.toLowerCase();
			const androidDetected = ua.includes('android');
			setIsAndroid(androidDetected);
		}

		// Capture beforeinstallprompt event
		const handler = (e: Event) => {
			e.preventDefault();
			const promptEvent = e as BeforeInstallPromptEvent;
			setDeferredPrompt(promptEvent);
			setIsInstallable(true);
			console.log('[PWA] Install prompt available');
		};

		window.addEventListener('beforeinstallprompt', handler);

		// Check if already installed
		if (window.matchMedia('(display-mode: standalone)').matches) {
			setIsInstallable(false);
			console.log('[PWA] App already installed');
		}

		return () => {
			window.removeEventListener('beforeinstallprompt', handler);
		};
	}, []);

	const promptInstall = async (): Promise<boolean> => {
		if (!deferredPrompt) {
			console.warn('[PWA] No install prompt available');
			return false;
		}

		try {
			await deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			console.log('[PWA] Install prompt outcome:', outcome);

			if (outcome === 'accepted') {
				setIsInstallable(false);
			}

			// Event is consumed after prompt()
			setDeferredPrompt(null);

			return outcome === 'accepted';
		} catch (error) {
			console.error('[PWA] Install prompt error:', error);
			return false;
		}
	};

	return {
		isAndroid,
		isInstallable,
		canInstall: isAndroid && isInstallable,
		promptInstall,
	};
}
