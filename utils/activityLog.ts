import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityLog } from '../constants/ACTIVITIES';

export async function getActivityLog() {
	const activityLogJSON = await AsyncStorage.getItem('activityLog');
	return activityLogJSON ? JSON.parse(activityLogJSON) : ({} as ActivityLog);
}

export async function storeActivityLog(activityLog: ActivityLog) {
	await AsyncStorage.setItem('activityLog', JSON.stringify(activityLog));
	await AsyncStorage.setItem(
		'activityLogUpdatedAt',
		new Date().toISOString()
	);
}
