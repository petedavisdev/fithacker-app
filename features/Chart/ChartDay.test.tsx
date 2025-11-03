import * as React from 'react';
import renderer from 'react-test-renderer';

import { ChartDay } from './ChartDay';
jest.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (str: string) => str }),
}));

jest.mock('expo-router', () => ({
	useLocalSearchParams: () => ({}),
	Link: 'Link',
}));

it(`renders correctly`, () => {
	const tree = renderer
		.create(<ChartDay date="2022-01-01" exercises={{ a: '', b: '' }} />)
		.toJSON();

	expect(tree).toMatchSnapshot();
});