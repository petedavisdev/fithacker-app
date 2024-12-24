import { useState, useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export function useNewDay() {
	const [day, setDay] = useState<number>(new Date().getDate());

	function handleAppStateChange(newAppState: AppStateStatus) {
		const newDay = new Date().getDate();
		if (newAppState === 'active' && day !== newDay) {
			setDay(newDay);
		}
	}

	useEffect(() => {
		const eventListener = AppState.addEventListener(
			'change',
			handleAppStateChange
		);

		return () => {
			eventListener.remove();
		};
	}, []);

	return day;
}
