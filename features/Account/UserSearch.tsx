import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput, View } from 'react-native';
import { AText } from '@/shared/components/AText';
import { useSearchUsers } from './useSearchUsers';
import { useSuggestedProfiles } from './useSuggestedProfiles';
import { useRouter } from 'expo-router';
import { URL_PARAMS } from '@/shared/utils/constants';

export function UserSearch() {
	const { t } = useTranslation();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	const [placeholder, setPlaceholder] = useState(t('_@.searchUsers'));
	const [isFocused, setIsFocused] = useState(false);
	const { searchResults, isLoadingSearch } = useSearchUsers(searchQuery);
	const { suggestedProfiles, isLoadingSuggestedProfiles } =
		useSuggestedProfiles();

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
					className={`font-sans ${textColor} border-y-2 ${borderColor} border-t-transparent w-full pt-4 pb-4 pr-8 outline-none`}
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
						<AText color="pink" shade={500} size="xl">
							×
						</AText>
					</Pressable>
				)}
			</View>
			{searchQuery.length > 0 ? (
				<View className="mt-4">
					{isLoadingSearch ? (
						<AText className="text-center">...</AText>
					) : searchResults.length === 0 ? (
						<AText className="text-center">
							{t('_@.noUsersFound', { searchTerm: searchQuery })}
						</AText>
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
									<AText color="pink">{profile.username}</AText>
								</View>
							</Pressable>
						))
					)}
				</View>
			) : (
				suggestedProfiles.length > 0 && (
					<View className="mt-4">
						{isLoadingSuggestedProfiles ? (
							<AText className="text-center">...</AText>
						) : (
							<>
								<AText size="lg" className="mb-2">
									{t('_@.suggestions')}
								</AText>
								{suggestedProfiles.map((profile) => (
									<Pressable
										key={profile.user_id}
										onPress={() => {
											router.push(
												`/chart?${URL_PARAMS.USER}=${profile.user_id}`,
											);
										}}
									>
										<View className="py-2">
											<AText color="pink">{profile.username}</AText>
										</View>
									</Pressable>
								))}
							</>
						)}
					</View>
				)
			)}
		</View>
	);
}
