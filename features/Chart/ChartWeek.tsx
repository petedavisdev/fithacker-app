import { Platform, Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import { ChartDay } from './ChartDay';
import { type ChartData } from './getChartData';
import { checkThisWeek, checkLastWeek } from './getWeekText';
import { ShareableWeek } from './Share/ShareableWeek';
import { useShareWeek } from './Share/useShareWeek';
import { useUserProfile } from '@/features/Account/useUserProfile';
import { AButton } from '@/shared/components/AButton';
import { URL_PARAMS, type Exercise } from '@/shared/utils/constants';

type ChartWeekProps = {
	weekData: ChartData;
	readOnly: boolean;
	onBadgePress: () => void;
	indicatorDate?: string;
};

export function ChartWeek(props: ChartWeekProps) {
	const { t } = useTranslation();
	const { viewShotRef, shareWeek, isSharingWeek } = useShareWeek();
	const { userProfile } = useUserProfile();
	const params = useLocalSearchParams<{ [URL_PARAMS.FILTER]?: string }>();
	const filter = params[URL_PARAMS.FILTER] as Exercise | undefined;
	const isFiltered = Boolean(filter);
	const dates = Object.keys(props.weekData.days);
	const isThisWeek = checkThisWeek(dates);
	const isLastWeek = checkLastWeek(dates);
	const today = new Date();
	const isSunday = today.getDay() === 0;

	const canShare =
		!props.readOnly && !isFiltered && (isLastWeek || (isThisWeek && isSunday));

	return (
		<View className="justify-center items-end gap-2 ml-2">
			{canShare &&
				(Platform.OS === 'web' ? (
					<View
						testID="shareable-week-view"
						style={{
							position: 'absolute',
							left: -9999,
							opacity: 0,
							pointerEvents: 'none',
						}}
					>
						<ShareableWeek
							weekData={props.weekData}
							username={userProfile?.username}
						/>
					</View>
				) : (
					<ViewShot
						ref={viewShotRef}
						options={{ format: 'png', quality: 1.0 }}
						style={{
							position: 'absolute',
							top: -10000,
							left: 0,
							width: 540,
							height: 720,
							opacity: 1,
							pointerEvents: 'none',
						}}
					>
						<ShareableWeek
							weekData={props.weekData}
							username={userProfile?.username}
						/>
					</ViewShot>
				))}
			<View className="flex-row">
				{Object.entries(props.weekData.days).map(([date, exercises]) => (
					<ChartDay
						date={date}
						exercises={exercises}
						key={date}
						readOnly={props.readOnly}
						indicatorDate={props.indicatorDate}
					/>
				))}
			</View>

			<Text className="text-cyan-500 text-xl px-2 font-mono text-right">
				{t(props.weekData.text)}
			</Text>

			<Text className="text-yellow-500 text-6xl -mt-1 font-extralight px-1 font-mono text-right">
				{props.weekData.total}
			</Text>

			<View className="h-16">
				{props.weekData.badges.length > 0 && (
					<TouchableOpacity onPress={props.onBadgePress}>
						<Text className="text-yellow-500 text-5xl font-extralight px-1 font-mono text-right">
							{props.weekData.badges.join('')}
						</Text>
					</TouchableOpacity>
				)}
			</View>

			<View className="mt-2 h-10 px-1 mb-4">
				{canShare && (
					<AButton
						onPress={() => shareWeek(dates[0])}
						isDisabled={isSharingWeek}
						size="sm"
						color="cyan"
					>
						{isSharingWeek ? '⏳' : '📸'}
					</AButton>
				)}
			</View>
		</View>
	);
}
