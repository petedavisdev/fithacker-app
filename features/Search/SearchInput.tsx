import { TextInput, View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { URL_PARAMS } from '@/shared/utils/constants';

export function SearchInput() {
	const { t } = useTranslation();
	const params = useLocalSearchParams<{ [URL_PARAMS.SEARCH]?: string }>();
	const router = useRouter();
	const searchParam = params[URL_PARAMS.SEARCH];
	const [searchQuery, setSearchQuery] = useState(searchParam || '');
	const [placeholder, setPlaceholder] = useState(
		`🔎 ${t('_@.searchYourNotes')}`,
	);

	useEffect(() => {
		setSearchQuery(searchParam || '');
	}, [searchParam]);

	function handleChangeText(text: string) {
		setSearchQuery(text);
		if (text) {
			router.setParams({ [URL_PARAMS.SEARCH]: text });
		} else {
			router.setParams({ [URL_PARAMS.SEARCH]: undefined });
		}
	}

	function handleClear() {
		setSearchQuery('');
		router.setParams({ [URL_PARAMS.SEARCH]: undefined });
	}

	return (
		<View className="relative w-full">
			<TextInput
				placeholder={placeholder}
				placeholderTextColor="#facc15"
				className="text-lg text-yellow-400 font-mono border-y-2 border-b-yellow-500 border-t-transparent w-full py-3 px-4 focus:text-pink-400 focus:border-b-pink-500 outline-none"
				value={searchQuery}
				onChangeText={handleChangeText}
				onFocus={() => setPlaceholder('')}
				onBlur={() => setPlaceholder(`${t('_@.searchYourNotes')} 🔎`)}
			/>
			{searchQuery.length > 0 && (
				<Pressable
					onPress={handleClear}
					className="absolute right-6 top-0 bottom-0 justify-center items-center px-2"
				>
					<Text className="text-pink-500 text-xl">×</Text>
				</Pressable>
			)}
		</View>
	);
}
