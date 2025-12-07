/// <reference types="expo/types" />

/**
 * Environment variable type declarations
 * These variables are loaded from .env file via dotenv/config in app.config.js
 * and exposed via Expo's extra config or process.env
 */
declare namespace NodeJS {
	interface ProcessEnv {
		// Expo public environment variables (exposed to client)
		EXPO_PUBLIC_SUPABASE_URL?: string;
		EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
		EXPO_PUBLIC_APPLE_REVIEW_EMAIL?: string;
		// App variant for build configuration
		APP_VARIANT?: 'development' | 'preview' | 'production';
	}
}

