import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExerciseLog } from '../constants/EXERCISES';

export async function getExerciseLog() {
	const exerciseLogJSON = await AsyncStorage.getItem('exerciseLog');
	return exerciseLogJSON ? JSON.parse(exerciseLogJSON) : ({} as ExerciseLog);
}

export async function storeExerciseLog(exerciseLog: ExerciseLog = {}) {
	await AsyncStorage.setItem('exerciseLog', JSON.stringify(exerciseLog));
	await AsyncStorage.setItem(
		'exerciseLogUpdatedAt',
		new Date().toISOString()
	);
}
