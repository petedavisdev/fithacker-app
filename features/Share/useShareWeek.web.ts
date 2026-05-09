import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { type ViewShotRef } from 'react-native-view-shot';

const WEB_SHAREABLE_TESTID = 'shareable-week-view';

export function useShareWeek() {
	const viewShotRef = useRef<ViewShotRef | null>(null);
	const {
		mutate: shareWeek,
		isPending: isSharingWeek,
		error: errorShareWeek,
	} = useMutation({
		mutationFn: async (firstDate: string) => {
			console.log('shareWeek mutation called (web)', firstDate);

			if (typeof document === 'undefined') {
				throw new Error('Document not available');
			}

			// Find the DOM element by testID (React Native Web converts testID to data-testid)
			const element = document.querySelector(
				`[data-testid="${WEB_SHAREABLE_TESTID}"]`,
			) as HTMLElement;
			if (!element) {
				throw new Error('Shareable week DOM element not found');
			}

			// Store original styles
			const originalStyles = {
				position: element.style.position,
				left: element.style.left,
				opacity: element.style.opacity,
				visibility: element.style.visibility,
				zIndex: element.style.zIndex,
			};

			// Temporarily make element visible and properly positioned for capture
			element.style.position = 'fixed';
			element.style.left = '0';
			element.style.top = '0';
			element.style.opacity = '1';
			element.style.visibility = 'visible';
			element.style.zIndex = '9999';

			// Wait for styles to apply and content to render
			await new Promise((resolve) => setTimeout(resolve, 200));

			try {
				// Dynamically import html2canvas
				const html2canvas = (await import('html2canvas')).default;
				console.log('Capturing view with html2canvas...');

				const canvas = await html2canvas(element, {
					width: 540,
					height: 720,
					backgroundColor: '#000000',
					scale: 1,
					useCORS: true,
					windowWidth: 540,
					windowHeight: 720,
				});

				const uri = canvas.toDataURL('image/png');
				console.log('Capture result:', uri.substring(0, 50) + '...');

				// Download the image
				const link = document.createElement('a');
				link.href = uri;
				link.download = `fithacker-${firstDate}.png`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				console.log('Downloaded image');
			} finally {
				// Restore original styles
				element.style.position = originalStyles.position;
				element.style.left = originalStyles.left;
				element.style.opacity = originalStyles.opacity;
				element.style.visibility = originalStyles.visibility;
				element.style.zIndex = originalStyles.zIndex;
			}
		},
		onError: (error) => {
			console.error('Share mutation error:', error);
		},
	});

	return {
		viewShotRef,
		shareWeek,
		isSharingWeek,
		errorShareWeek,
	};
}
