import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';
import cs from './translation/cs.json';
import de from './translation/de.json';
import el from './translation/el.json';
import en from './translation/en.json';
import es from './translation/es.json';
import fr from './translation/fr.json';
import hi from './translation/hi.json';
import it from './translation/it.json';
import ja from './translation/ja.json';
import ko from './translation/ko.json';
import nl from './translation/nl.json';
import pl from './translation/pl.json';
import pt from './translation/pt.json';
import ru from './translation/ru.json';
import tr from './translation/tr.json';
import uk from './translation/uk.json';
import vi from './translation/vi.json';
import zh from './translation/zh.json';

const resources = {
	cs: { translation: cs },
	de: { translation: de },
	el: { translation: el },
	en: { translation: en },
	es: { translation: es },
	fr: { translation: fr },
	hi: { translation: hi },
	it: { translation: it },
	ja: { translation: ja },
	ko: { translation: ko },
	nl: { translation: nl },
	pl: { translation: pl },
	pt: { translation: pt },
	ru: { translation: ru },
	tr: { translation: tr },
	uk: { translation: uk },
	vi: { translation: vi },
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
