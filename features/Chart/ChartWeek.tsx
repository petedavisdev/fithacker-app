import { Platform, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import { AText } from '@/shared/components/AText';
import { AEmoji } from '@/shared/components/AEmoji';
import { ChartDay } from './ChartDay';
import { type ChartData } from '@/shared/utils/constants';
import { checkThisWeek, checkLastWeek } from './getWeekText';
import { ShareableWeek } from '@/features/Share/ShareableWeek';
import { useShareWeek } from '@/features/Share/useShareWeek';
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
						<ShareableWeek weekData={props.weekData} />
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
						<ShareableWeek weekData={props.weekData} />
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

			<AText color="cyan" shade={500} size="xl" className="px-2 text-right">
				{t(props.weekData.text)}
			</AText>

			<AText
				color="yellow"
				shade={500}
				size="6xl"
				className="-mt-1 font-extralight px-1 text-right"
			>
				{props.weekData.total}
			</AText>

			<View className="h-16">
				{props.weekData.badges.length > 0 && (
					<TouchableOpacity onPress={props.onBadgePress}>
						<AEmoji size="5xl" className="font-extralight px-1 pt-2 text-right">
							{props.weekData.badges.join('')}
						</AEmoji>
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
