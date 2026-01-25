import { useEffect, useRef, useState } from 'react';
import { useAuthSession } from './useAuthSession';

/**
 * Detects when user transitions from logged in to logged out.
 * Returns a flag that can be used to show logout modal.
 * Flag resets when dismissed.
 */
export function useLogoutDetection() {
	const { authSession } = useAuthSession();
	const wasLoggedInRef = useRef<boolean>(false);
	const [wasLoggedOut, setWasLoggedOut] = useState(false);

	const isLoggedIn = !!authSession?.user;

	useEffect(() => {
		// On initial mount, set the ref to current state (don't trigger logout detection)
		// wasLoggedInRef.current starts as false, so if it's still false, this is initial mount
		if (wasLoggedInRef.current === false) {
			wasLoggedInRef.current = isLoggedIn;
			return;
		}

		// Detect transition from logged in → logged out
		if (wasLoggedInRef.current && !isLoggedIn) {
			setWasLoggedOut(true);
		}

		// Update ref to current state
		wasLoggedInRef.current = isLoggedIn;
	}, [isLoggedIn]);

	const dismissLogout = () => {
		setWasLoggedOut(false);
	};

	return { wasLoggedOut, dismissLogout };
}
