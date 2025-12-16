import { useState, useEffect, useCallback } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export function useNewDay() {
	const [day, setDay] = useState<number>(new Date().getDate());

	const handleAppStateChange = useCallback((newAppState: AppStateStatus) => {
		const newDay = new Date().getDate();
		if (newAppState === 'active' && day !== newDay) {
			setDay(newDay);
		}
	}, [day]);

	useEffect(() => {
		const eventListener = AppState.addEventListener(
			'change',
			handleAppStateChange,
		);

		return () => {
			eventListener.remove();
		};
	}, [handleAppStateChange]);

	return day;
}
