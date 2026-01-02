import { TextInput, View, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AText } from '@/shared/components/AText';
import { URL_PARAMS } from '@/shared/utils/constants';

export function SearchInput() {
	const { t } = useTranslation();
	const params = useLocalSearchParams<{ [URL_PARAMS.SEARCH]?: string }>();
	const router = useRouter();
	const searchParam = params[URL_PARAMS.SEARCH];
	const [searchQuery, setSearchQuery] = useState(searchParam || '');
	const [placeholder, setPlaceholder] = useState(t('_@.searchPlaceholder'));
	const [isFocused, setIsFocused] = useState(false);

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

	function handleFocus() {
		setIsFocused(true);
		setPlaceholder('');
	}

	function handleBlur() {
		setIsFocused(false);
		setPlaceholder(t('_@.searchPlaceholder'));
	}

	const isActive = isFocused || Boolean(searchQuery);
	const borderColor = isFocused ? 'border-b-pink-500' : 'border-b-slate-800';
	const textColor = isActive ? 'text-pink-400' : 'text-yellow-400';

	return (
		<View className="relative w-full">
			<View
				className="absolute left-0 top-0 bottom-0 justify-center items-center"
				pointerEvents="none"
			>
				<AText size="xl">🔎</AText>
			</View>
			<TextInput
				placeholder={placeholder}
				placeholderTextColor={'#64748b'}
				className={`font-sans ${textColor} border-y-2 ${borderColor} border-t-transparent w-full pt-4 pb-4 pl-8 pr-8 outline-none`}
				value={searchQuery}
				onChangeText={handleChangeText}
				onFocus={handleFocus}
				onBlur={handleBlur}
			/>
			{searchQuery.length > 0 && (
				<Pressable
					onPress={handleClear}
					className="absolute right-0 top-0 bottom-0 justify-center items-center px-1"
				>
					<AText color="pink" shade={500} size="xl">
						×
					</AText>
				</Pressable>
			)}
		</View>
	);
}
