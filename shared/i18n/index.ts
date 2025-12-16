import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';
import de from './translation/de.json';
import en from './translation/en.json';
import es from './translation/es.json';
import fr from './translation/fr.json';
import it from './translation/it.json';
import ja from './translation/ja.json';
import ko from './translation/ko.json';
import pt from './translation/pt.json';
import zh from './translation/zh.json';

const resources = {
	de: { translation: de },
	en: { translation: en },
	es: { translation: es },
	fr: { translation: fr },
	it: { translation: it },
	ja: { translation: ja },
	ko: { translation: ko },
	pt: { translation: pt },
	zh: { translation: zh },
};

const initI18n = async () => {
	let lng: string | null = null;

	// workaround for web - window not be available
	if (Platform.OS !== 'web') {
		lng = await AsyncStorage.getItem('language');
	}

	if (!lng) {
		lng = Localization.getLocales()?.[0]?.languageCode;
	}

	i18n.use(initReactI18next).init({
		compatibilityJSON: 'v3',
		resources,
		lng,
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
	});
};

initI18n();

export default i18n;
