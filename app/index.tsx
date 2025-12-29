import { Text, View } from 'react-native';
import { useRef, useEffect } from 'react';

import { AButton } from '@/shared/components/AButton';
import { Checklist } from '@/features/Checklist/Checklist';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TheHeader } from '@/features/TheHeader/TheHeader';
import { getDateInfo } from '@/shared/utils/dateInfo';
import { getDateSteps } from '@/features/Checklist/getDateSteps';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useBackgroundSync } from '@/shared/queries/useBackgroundSync';
import { usePendingSync } from '@/shared/queries/usePendingSync';

export default function HomeScreen() {
	const { t } = useTranslation();
	const { triggerSync } = useBackgroundSync();
	const { pendingSync } = usePendingSync();
	const hasTriggeredSyncRef = useRef(false);
	const pendingSyncRef = useRef<Record<string, string>>({});

	// Keep ref updated with latest pendingSync value
	useEffect(() => {
		pendingSyncRef.current = pendingSync ?? {};
	}, [pendingSync]);

	// Trigger sync when leaving the checklist page, but only if there are pending changes
	useFocusEffect(() => {
		// Reset the ref when the screen comes into focus
		hasTriggeredSyncRef.current = false;

		return () => {
			// Check the latest pendingSync value from ref (avoids stale closure)
			const hasPendingChanges =
				Object.keys(pendingSyncRef.current ?? {}).length > 0;
			if (hasPendingChanges && !hasTriggeredSyncRef.current) {
				hasTriggeredSyncRef.current = true;
				triggerSync();
			}
		};
	});

	const { date } = useLocalSearchParams<{ date: string }>();
	const dateInfo = getDateInfo(date?.toString());
	const { prev, next } = getDateSteps(dateInfo.date);

	const DATE_CLASS_NAMES = {
		future: 'text-slate-500',
		today: 'text-pink-500',
		tomorrow: 'text-slate-400',
		weekend: 'text-yellow-500',
		weekday: 'text-cyan-500',
	};

	const dateClassName = DATE_CLASS_NAMES[dateInfo.category];

	return (
		<View className="flex-1 items-center gap-5">
			<TheHeader
				buttonLeft="account"
				buttonRight={
					dateInfo.category === 'today' || dateInfo.category === 'tomorrow'
						? 'help'
						: undefined
				}
			/>

			<KeyboardAwareScrollView
				keyboardOpeningTime={0}
				enableOnAndroid={true}
				enableAutomaticScroll={true}
				extraScrollHeight={20}
				contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
			>
				<View className="w-96 px-4 pb-5">
					<Text
						className={` text-cyan-300 text-2xl text-center text-balance font-mono first-letter:uppercase ${dateClassName}`}
					>
						{date ? t(dateInfo.text) : t('_.whatExerciseToday')}
					</Text>
				</View>
				<Checklist />
			</KeyboardAwareScrollView>

			<View className="flex-grow w-96 flex-row justify-between items-center px-4">
				<AButton href={`/?date=${prev}`} size="sm">
					👈
				</AButton>
				<AButton href="/chart">👍</AButton>
				<AButton href={`/?date=${next}`} size="sm" isDisabled={!next}>
					👉
				</AButton>
			</View>
		</View>
	);
}
