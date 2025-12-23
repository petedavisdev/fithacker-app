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
	const { searchResults, isLoadingSearch } = useSearchUsers(searchQuery);

	return (
		<View className="w-full max-w-xs mt-6">
			<TextInput
				placeholder={placeholder}
				placeholderTextColor={'#f472b6'}
				className="text-yellow-400 font-mono border-y-2 border-b-yellow-500 border-t-transparent pb-3 pt-6 focus:text-pink-400 focus:border-b-pink-500 outline-none"
				value={searchQuery}
				onChangeText={(text) => {
					setSearchQuery(text);
				}}
				onFocus={() => {
					setPlaceholder('');
				}}
				onBlur={() => {
					if (!searchQuery) {
						setPlaceholder(t('_@.searchUsers'));
					}
				}}
				autoCapitalize="none"
				autoCorrect={false}
			/>
			{searchQuery.length > 0 && (
				<View className="mt-4">
					{isLoadingSearch ? (
						<Text className="font-mono text-cyan-400 text-center">...</Text>
					) : searchResults.length === 0 ? (
						<Text className="font-mono text-cyan-400 text-center">
							{t('_@.noResults')}
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
