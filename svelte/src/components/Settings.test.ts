import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import svelte from 'svelte-inline-compile';
import { resetSettingsStore, getDefaultSettings } from '../state/stores/settings';

beforeEach(() => {
  resetSettingsStore();
});

test('by default it shows the default Settings text', () => {
  const settings = getDefaultSettings();

	const { getByLabelText } = render(svelte`
    <script>
      import Settings from './Settings.svelte';
    </script>

    <Settings settings={settings}/>
  `);

  expect(getByLabelText('Countdown Message')).toHaveValue(settings.countdownMessage);
  expect(getByLabelText('All Done! Message')).toHaveValue(settings.allDoneMessage);
  expect(getByLabelText('Image Search Terms')).toHaveValue(settings.searchTerms);
  expect(getByLabelText('Year (YYYY)')).toHaveValue(settings.date.year);
  expect(getByLabelText('Month (MM)')).toHaveValue(settings.date.month);
  expect(getByLabelText('Day (DD)')).toHaveValue(settings.date.day);
  expect(getByLabelText('Hour (HH)')).toHaveValue(settings.date.hour);
  expect(getByLabelText('Minute (MM)')).toHaveValue(settings.date.minute);
});
