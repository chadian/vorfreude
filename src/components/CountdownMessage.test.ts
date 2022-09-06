import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import { DateTime } from 'luxon';
import svelte from 'svelte-inline-compile';

const mockNow = DateTime.fromObject({
  year: 2022,
  month: 3,
  day: 3,
  hour: 3,
  minute: 30,
  second: 3
});

beforeEach(() => {
  const mockNowJSDate = mockNow.toJSDate();
  jest.useFakeTimers().setSystemTime(mockNowJSDate);
});

afterEach(() => {
  jest.useRealTimers();
});

test('shows countdownMessage for a future endDate', () => {
  const futureEndDate = mockNow.plus({ minutes: 1 }).toObject();
  const allDoneMessage = 'All done!'
  const countdownMessage = 'Still counting down...'

  const { getByText, queryByText } = render(svelte`
    <script>
      import CountdownMessage from './CountdownMessage.svelte';
    </script>

    <CountdownMessage
      endDate={futureEndDate}
      allDoneMessage={allDoneMessage}
      countdownMessage={countdownMessage}
    />
  `);

  expect(getByText(countdownMessage)).toBeInTheDocument();
  expect(queryByText(allDoneMessage)).not.toBeInTheDocument();
});

test('shows countdownMessage for a past date', () => {
  const pastEndDate = mockNow.minus({ minutes: 1 }).toObject();
  const allDoneMessage = 'All done!'
  const countdownMessage = 'Still counting down...'

  const { getByText, queryByText } = render(svelte`
    <script>
      import CountdownMessage from './CountdownMessage.svelte';
    </script>

    <CountdownMessage
      endDate={pastEndDate}
      allDoneMessage={allDoneMessage}
      countdownMessage={countdownMessage}
    />
  `);

  expect(getByText(allDoneMessage)).toBeInTheDocument();
  expect(queryByText(countdownMessage)).not.toBeInTheDocument();
});
