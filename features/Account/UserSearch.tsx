import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useSearchUsers } from './useSearchUsers';
import { useRouter } from 'expo-router';
import { URL_PARAMS } from '@/shared/utils/constants';

export function UserSearch() {
	const { t } = useTranslation();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	const [placeholder, setPlaceholder] = useState(t('_@.searchUsers'));
	const [isFocused, setIsFocused] = useState(false);
	const { searchResults, isLoadingSearch } = useSearchUsers(searchQuery);

	function handleClear() {
		setSearchQuery('');
	}

	function handleFocus() {
		setIsFocused(true);
		setPlaceholder('');
	}

	function handleBlur() {
		setIsFocused(false);
		if (!searchQuery) {
			setPlaceholder(t('_@.searchUsers'));
		}
	}

	const isActive = isFocused || Boolean(searchQuery);
	const borderColor = isFocused ? 'border-b-pink-500' : 'border-b-yellow-500';
	const textColor = isActive ? 'text-pink-400' : 'text-yellow-400';

	return (
		<View className="w-full max-w-xs mt-6">
			<View className="relative w-full">
				<TextInput
					placeholder={placeholder}
					placeholderTextColor={'#f472b6'}
					className={`${textColor} font-mono border-y-2 ${borderColor} border-t-transparent w-full pt-4 pb-4 pr-8 outline-none`}
					value={searchQuery}
					onChangeText={setSearchQuery}
					onFocus={handleFocus}
					onBlur={handleBlur}
					autoCapitalize="none"
					autoCorrect={false}
				/>
				{searchQuery.length > 0 && (
					<Pressable
						onPress={handleClear}
						className="absolute right-0 top-0 bottom-0 justify-center items-center px-1"
					>
						<Text className="text-pink-500 text-xl">×</Text>
					</Pressable>
				)}
			</View>
			{searchQuery.length > 0 && (
				<View className="mt-4">
					{isLoadingSearch ? (
						<Text className="font-mono text-cyan-400 text-center">...</Text>
					) : searchResults.length === 0 ? (
						<Text className="font-mono text-cyan-400 text-center">
							{t('_@.noUsersFound', { searchTerm: searchQuery })}
						</Text>
					) : (
						searchResults.map((profile) => (
							<Pressable
								key={profile.user_id}
								onPress={() => {
									router.push(`/chart?${URL_PARAMS.USER}=${profile.user_id}`);
									setSearchQuery('');
								}}
							>
								<View className="py-2">
									<Text className="font-mono text-cyan-400">
										{profile.username}
									</Text>
								</View>
							</Pressable>
						))
					)}
				</View>
			)}
		</View>
	);
}
