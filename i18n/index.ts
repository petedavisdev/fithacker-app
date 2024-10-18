import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translationEn from './en.json';
import translationEs from './fr.json';
import translationFr from './fr.json';

const resources = {
	en: { translation: translationEn },
	es: { translation: translationEs },
	fr: { translation: translationFr },
};

const initI18n = async () => {
	let savedLanguage = await AsyncStorage.getItem('language');

	if (!savedLanguage) {
		savedLanguage = Localization.getLocales()[0].languageCode;
	}

	console.log('Saved language:', savedLanguage);

	i18n.use(initReactI18next).init({
		compatibilityJSON: 'v3',
		resources,
		lng: savedLanguage,
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
	});
};

initI18n();

export default i18n;
