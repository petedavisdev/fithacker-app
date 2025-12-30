import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useBatchProfiles } from '@/shared/queries/useBatchProfiles';
import { useUserProfile } from './useUserProfile';
import { useRouter } from 'expo-router';
import { URL_PARAMS } from '@/shared/utils/constants';

export function RecentlyViewed() {
	const { t } = useTranslation();
	const router = useRouter();
	const { userProfile } = useUserProfile();
	const viewedUserIds = userProfile?.viewed_user_ids ?? [];
	const { batchProfiles } = useBatchProfiles(viewedUserIds);

	if (viewedUserIds.length === 0) {
		return null;
	}

	// Create a map for quick lookup
	const profileMap = new Map(batchProfiles.map((p) => [p.user_id, p.username]));

	return (
		<View className="w-full max-w-xs mt-4">
			<Text className="font-mono text-cyan-400 text-lg mb-2">
				{t('_@.recentlyViewed')}
			</Text>
			{viewedUserIds.length > 0 && batchProfiles.length === 0 ? (
				<Text className="font-mono text-cyan-400 text-center">...</Text>
			) : (
				viewedUserIds
					.filter((userId) => profileMap.has(userId))
					.map((userId) => {
						const username = profileMap.get(userId);
						if (!username) return null;

						return (
							<Pressable
								key={userId}
								onPress={() => {
									router.push(`/chart?${URL_PARAMS.USER}=${userId}`);
								}}
								className="py-2"
							>
								<Text className="font-mono text-pink-400">{username}</Text>
							</Pressable>
						);
					})
			)}
		</View>
	);
}
