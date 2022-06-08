import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import Settings from './Settings.svelte';
import { resetSettingsStore, getDefaultSettings } from '../state/stores/settings';

beforeEach(() => {
	resetSettingsStore();
});

test('by default it shows the default Settings text', () => {
	const { getByLabelText } = render(Settings);
	const { countdownMessage , allDoneMessage, searchTerms, date } = getDefaultSettings();

	expect(getByLabelText('Countdown Message')).toHaveValue(countdownMessage);
	expect(getByLabelText('All Done! Message')).toHaveValue(allDoneMessage);
	expect(getByLabelText('Image Search Terms')).toHaveValue(searchTerms);
	expect(getByLabelText('Year (YYYY)')).toHaveValue(date.year);
	expect(getByLabelText('Month (MM)')).toHaveValue(date.month);
	expect(getByLabelText('Day (DD)')).toHaveValue(date.day);
	expect(getByLabelText('Hour (HH)')).toHaveValue(date.hour);
	expect(getByLabelText('Minute (MM)')).toHaveValue(date.minute);
});
