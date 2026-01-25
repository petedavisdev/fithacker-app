import * as Localization from 'expo-localization';
import i18n, { type InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
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

async function initI18n() {
	const lng = Localization.getLocales()?.[0]?.languageCode ?? undefined;

	i18n.use(initReactI18next);

	const config: InitOptions = {
		compatibilityJSON: 'v4',
		resources,
		lng,
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
	};

	return i18n.init(config);
}

export const i18nReady = initI18n();

export default i18n;
