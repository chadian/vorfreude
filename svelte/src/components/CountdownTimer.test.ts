import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import CountdownTimer from './CountdownTimer.svelte';
import { DateTime } from 'luxon';

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

test('shows countdown time data', () => {
	const { getByText } = render(CountdownTimer, {
		endDate: mockNow.plus({ days: 1, hours: 2, minutes: 3, seconds: 4 }).toObject()
	});

	expect(getByText('1 day')).toBeInTheDocument();
	expect(getByText('2 hours')).toBeInTheDocument();
	expect(getByText('3 minutes')).toBeInTheDocument();
	expect(getByText('4 seconds')).toBeInTheDocument();
});

test('handles plurals', () => {
	const { getByText } = render(CountdownTimer, {
		endDate: mockNow.plus({ days: 2, hours: 2, minutes: 2, seconds: 2 }).toObject()
	});

	expect(getByText('2 days')).toBeInTheDocument();
	expect(getByText('2 hours')).toBeInTheDocument();
	expect(getByText('2 minutes')).toBeInTheDocument();
	expect(getByText('2 seconds')).toBeInTheDocument();
});

test('handles singulars', () => {
	const { getByText } = render(CountdownTimer, {
		endDate: mockNow.plus({ days: 1, hours: 1, minutes: 1, seconds: 1 }).toObject()
	});

	expect(getByText('1 day')).toBeInTheDocument();
	expect(getByText('1 hour')).toBeInTheDocument();
	expect(getByText('1 minute')).toBeInTheDocument();
	expect(getByText('1 second')).toBeInTheDocument();
});

test('handles zero cases', () => {
	const { getByText } = render(CountdownTimer, {
		endDate: mockNow.plus({ days: 1 }).toObject()
	});

	expect(getByText('1 day')).toBeInTheDocument();
	expect(getByText('0 hours')).toBeInTheDocument();
	expect(getByText('0 minutes')).toBeInTheDocument();
	expect(getByText('0 seconds')).toBeInTheDocument();
});

test('handles empty cases', () => {
	const { queryByText } = render(CountdownTimer, {
		endDate: mockNow.plus({ seconds: 1 }).toObject()
	});

	expect(queryByText('day')).not.toBeInTheDocument();
	expect(queryByText('hour')).not.toBeInTheDocument();
	expect(queryByText('minute')).not.toBeInTheDocument();
	expect(queryByText('1 second')).toBeInTheDocument();
});

test('durations more than a year still show in days', () => {
	const { getByText } = render(CountdownTimer, {
		endDate: mockNow.plus({ years: 1 }).toObject()
	});

	expect(getByText('365 days')).toBeInTheDocument();
	expect(getByText('0 hours')).toBeInTheDocument();
	expect(getByText('0 minutes')).toBeInTheDocument();
	expect(getByText('0 seconds')).toBeInTheDocument();
});
