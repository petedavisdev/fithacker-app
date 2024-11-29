import * as Localization from 'expo-localization';

export function getLanguage() {
	return Localization.getLocales()?.[0]?.languageTag;
}
