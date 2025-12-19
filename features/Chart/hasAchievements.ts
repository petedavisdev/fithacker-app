import type { ChartData } from './getChartData';
import { BADGES } from '@/shared/utils/constants';

/**
 * Checks if user has any medals (🏅) in their chart data
 */
export function hasMedals(chartData: ChartData[]): boolean {
	return chartData.some((week) => week.badges.includes(BADGES[1]));
}

/**
 * Checks if user has any trophies (🏆) in their chart data
 */
export function hasTrophies(chartData: ChartData[]): boolean {
	return chartData.some((week) => week.badges.includes(BADGES[2]));
}

