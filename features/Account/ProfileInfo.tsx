import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useAuthSession } from './useAuthSession';
import { useUserProfile } from './useUserProfile';
import { UserSearch } from './UserSearch';
import { RecentlyViewed } from './RecentlyViewed';
import { UsernameInput } from './UsernameInput';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { useIsOnline } from '@/shared/queries/useNetworkStatus';
import { URL_PARAMS } from '@/shared/utils/constants';

export function ProfileInfo() {
	const { t } = useTranslation();
	const { authSession } = useAuthSession();
	const { userProfile } = useUserProfile();
	const isOnline = useIsOnline();
	const [copied, setCopied] = useState<'username' | 'link' | null>(null);
	const [isEditingUsername, setIsEditingUsername] = useState(false);

	const username = userProfile?.username;
	const userId = authSession?.user?.id;

	const shareLink = userId
		? `https://fithacker.app/chart?${URL_PARAMS.USER}=${userId}`
		: '';

	async function copyUsername() {
		if (username) {
			await Clipboard.setStringAsync(username);
			setCopied('username');
			setTimeout(() => setCopied(null), 2000);
		}
	}

	async function copyLink() {
		if (shareLink) {
			await Clipboard.setStringAsync(shareLink);
			setCopied('link');
			setTimeout(() => setCopied(null), 2000);
		}
	}

	return (
		<>
			{username && isOnline && (
				<View className="w-full items-center">
					{isEditingUsername ? (
						<View className="w-full max-w-xs mb-4">
							<UsernameInput
								mode="update"
								initialUsername={username}
								onSuccess={() => {
									setIsEditingUsername(false);
								}}
							/>
						</View>
					) : (
						<View className="flex-row items-center justify-center gap-2 mb-4">
							<Text className="font-mono text-pink-400 text-lg">
								{username}
							</Text>
							<Pressable
								onPress={() => {
									setIsEditingUsername(true);
								}}
							>
								<Text className="font-mono text-cyan-400 text-lg">✏️</Text>
							</Pressable>
						</View>
					)}

					<View className="flex-row gap-4 mb-6">
						<Pressable onPress={copyUsername}>
							<View className="px-4 py-2 items-center justify-center border-2 border-yellow-500 rounded-full shadow shadow-yellow-500">
								<Text className="text-sm text-yellow-400 font-mono text-balance text-center">
									{copied === 'username'
										? t('_@.copied')
										: t('_@.copyUsername')}
								</Text>
							</View>
						</Pressable>

						<Pressable onPress={copyLink}>
							<View className="px-4 py-2 items-center justify-center border-2 border-yellow-500 rounded-full shadow shadow-yellow-500">
								<Text className="text-sm text-yellow-400 font-mono text-balance text-center">
									{copied === 'link' ? t('_@.copied') : t('_@.copyLink')}
								</Text>
							</View>
						</Pressable>
					</View>

					<UserSearch />
					<RecentlyViewed />
				</View>
			)}
		</>
	);
}
