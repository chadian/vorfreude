import { DateTime } from 'luxon';
import { hasDatePast } from './has-date-past';

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

test('it returns false for future dates', () => {
  const futureDate = mockNow.plus({ minutes: 1 }).toObject();
  expect(hasDatePast(futureDate)).toStrictEqual(false);
});

test('it returns true for past dates', () => {
  const pastDate = mockNow.minus({ minutes: 1 }).toObject();
  expect(hasDatePast(pastDate)).toStrictEqual(true);
});
