import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import type { Database } from './database.types'

const supabaseUrl =
	Constants.expoConfig?.extra?.supabaseUrl ?? process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey =
	Constants.expoConfig?.extra?.supabaseAnonKey ??
	process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

// Lazy-load AsyncStorage to avoid window access during module initialization
// AsyncStorage uses window.localStorage on web, so we need to ensure it's only loaded client-side
let AsyncStorage: any
if (Platform.OS !== 'web') {
	// Native platforms - safe to import immediately
	AsyncStorage = require('@react-native-async-storage/async-storage').default
} else {
	// Web platform - create a localStorage adapter that checks for window
	AsyncStorage = {
		getItem: (key: string) => {
			if (typeof window !== 'undefined') {
				return Promise.resolve(window.localStorage.getItem(key))
			}
			return Promise.resolve(null)
		},
		setItem: (key: string, value: string) => {
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(key, value)
			}
			return Promise.resolve()
		},
		removeItem: (key: string) => {
			if (typeof window !== 'undefined') {
				window.localStorage.removeItem(key)
			}
			return Promise.resolve()
		},
	}
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: AsyncStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: Platform.OS === 'web', // Enable for web, disable for React Native
	},
})

