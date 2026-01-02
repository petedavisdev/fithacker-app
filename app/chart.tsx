import { Chart as ChartComponent } from '../features/Chart/Chart';
import { BadgesHelp } from '../features/Chart/BadgesHelp';
import { TheFilter } from '@/shared/components/TheFilter';
import { TheHeader } from '@/shared/components/TheHeader';
import { View } from 'react-native';
import { AText } from '@/shared/components/AText';
import { useExerciseLog } from '@/shared/queries/useExerciseLog';
import { AModal } from '@/shared/components/AModal';
import { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { URL_PARAMS } from '@/shared/utils/constants';
import { usePublicExerciseLog } from '@/shared/queries/usePublicExerciseLog';
import { usePublicProfile } from '@/shared/queries/usePublicProfile';
import { useAuthSession } from '@/features/Account/useAuthSession';
import { useIsOnline } from '@/shared/queries/useNetworkStatus';
import { useUserProfile } from '@/features/Account/useUserProfile';
import { useUpdateViewedUsers } from '@/features/Account/useUpdateViewedUsers';
import { useGradient } from '@/shared/hooks/useGradient';
import { ChartNotFound } from '../features/Chart/ChartNotFound';

export default function Chart() {
	const router = useRouter();
	const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
	const params = useLocalSearchParams<{
		[URL_PARAMS.USER]?: string;
		[URL_PARAMS.FILTER]?: string;
	}>();
	const { authSession } = useAuthSession();
	const isOnline = useIsOnline();
	const { userProfile } = useUserProfile();
	const { setViewingOther } = useGradient();
	const currentUserId = authSession?.user?.id;
	const viewingUserId = params[URL_PARAMS.USER];
	const isViewingOtherUser = !!viewingUserId && viewingUserId !== currentUserId;
	const shouldAddUserParam = isOnline && userProfile && !viewingUserId;

	useEffect(() => {
		if (isViewingOtherUser && !isOnline) {
			router.replace('/account');
		}
	}, [isViewingOtherUser, isOnline, router]);

	useEffect(() => {
		if (shouldAddUserParam) {
			router.replace(`/chart?${URL_PARAMS.USER}=${currentUserId}`);
		}
	}, [shouldAddUserParam, currentUserId, router]);

	useEffect(() => {
		setViewingOther(isViewingOtherUser);
		return () => setViewingOther(false);
	}, [isViewingOtherUser, setViewingOther]);

	const { publicProfile, isLoadingPublicProfile, errorPublicProfile } =
		usePublicProfile(isViewingOtherUser ? viewingUserId : null);

	const { publicExerciseLog, errorPublicExerciseLog } = usePublicExerciseLog(
		isViewingOtherUser ? viewingUserId : null,
	);

	const { updateViewedUsers } = useUpdateViewedUsers();
	const hasUpdatedViewedRef = useRef<string | null>(null);

	const shouldUpdateViewedUsers =
		isViewingOtherUser &&
		publicProfile &&
		hasUpdatedViewedRef.current !== viewingUserId;

	useEffect(() => {
		if (shouldUpdateViewedUsers) {
			hasUpdatedViewedRef.current = viewingUserId;
			updateViewedUsers({ userId: viewingUserId });
		}

		if (!isViewingOtherUser) {
			hasUpdatedViewedRef.current = null;
		}
	}, [
		shouldUpdateViewedUsers,
		isViewingOtherUser,
		viewingUserId,
		updateViewedUsers,
	]);

	// Use own log or public log
	const { exerciseLog, errorExerciseLog } = useExerciseLog();
	const logToUse = isViewingOtherUser ? publicExerciseLog : exerciseLog;
	const errorLog = isViewingOtherUser
		? errorPublicExerciseLog
		: errorExerciseLog;

	// Error handling: 404 if user doesn't exist or has no profile
	if (
		isViewingOtherUser &&
		!isLoadingPublicProfile &&
		(!publicProfile || errorPublicProfile)
	) {
		return <ChartNotFound />;
	}

	// Don't render chart if there's an error - component depends on exerciseLog
	if (errorLog) {
		return (
			<>
				<TheHeader buttonLeft="account" />
				<View className="flex-1 items-center justify-center gap-10">
					<TheFilter />
				</View>
			</>
		);
	}

	return (
		<>
			<TheHeader
				buttonLeft="account"
				buttonRight={!isViewingOtherUser ? 'notes' : 'chart'}
			/>

			<AModal
				isOpen={isAchievementModalOpen}
				onClose={() => setIsAchievementModalOpen(false)}
			>
				<BadgesHelp />
			</AModal>

			<View className="flex-1 items-center justify-center gap-10">
				{isViewingOtherUser && publicProfile && (
					<AText color="pink" size="2xl" className="mb-4">
						{publicProfile.username}
					</AText>
				)}
				<ChartComponent
					readOnly={isViewingOtherUser}
					exerciseLog={logToUse}
					onBadgePress={() => setIsAchievementModalOpen(true)}
				/>
				<TheFilter />
			</View>
		</>
	);
}
