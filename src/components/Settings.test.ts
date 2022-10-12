import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import svelte from 'svelte-inline-compile';
import { getDefaultSettings } from '../state/stores/settings';

let user;
let getByLabelText;
let onClose;
const testSettings = getDefaultSettings();

beforeEach(() => {
  onClose = jest.fn();
  user = userEvent.setup();
  const rendered = render(svelte`
    <script>
      import Settings from './Settings.svelte';
    </script>

    <Settings settings={testSettings} onClose={onClose}/>
  `);

  getByLabelText = rendered.getByLabelText;
});

test('it renders the settings prop', () => {
  expect(getByLabelText('Countdown Message')).toHaveValue(testSettings.countdownMessage);
  expect(getByLabelText('All Done! Message')).toHaveValue(testSettings.allDoneMessage);
  expect(getByLabelText('Image Search Terms')).toHaveValue(testSettings.searchTerms);
  expect(getByLabelText('Year (YYYY)')).toHaveValue(testSettings.date.year);
  expect(getByLabelText('Month (MM)')).toHaveValue(testSettings.date.month);
  expect(getByLabelText('Day (DD)')).toHaveValue(testSettings.date.day);
  expect(getByLabelText('Hour (HH)')).toHaveValue(testSettings.date.hour);
  expect(getByLabelText('Minute (MM)')).toHaveValue(testSettings.date.minute);
});

describe('onClose', () => {
  test('called when the X button is pressed', async () => {
    const closeButton = getByLabelText('Close');
    expect(onClose).not.toHaveBeenCalled();
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('called when the escape key is pressed', async () => {
    expect(onClose).not.toHaveBeenCalled();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
