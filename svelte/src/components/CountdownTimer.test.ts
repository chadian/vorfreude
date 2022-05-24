import '@testing-library/jest-dom';

import { render } from '@testing-library/svelte';

import CountdownTimer from './CountdownTimer.svelte';

test('shows relevant time data', () => {
	const { getByText } = render(CountdownTimer, {
		time: { days: 1, hours: 2, minutes: 3, seconds: 4 }
	});

	expect(getByText('1 day')).toBeInTheDocument();
	expect(getByText('2 hours')).toBeInTheDocument();
	expect(getByText('3 minutes')).toBeInTheDocument();
	expect(getByText('4 seconds')).toBeInTheDocument();
});

test('handles plurals', () => {
	const { getByText } = render(CountdownTimer, {
		time: { days: 2, hours: 2, minutes: 2, seconds: 2 }
	});

	expect(getByText('2 days')).toBeInTheDocument();
	expect(getByText('2 hours')).toBeInTheDocument();
	expect(getByText('2 minutes')).toBeInTheDocument();
	expect(getByText('2 seconds')).toBeInTheDocument();
});

test('handles singulars', () => {
	const { getByText } = render(CountdownTimer, {
		time: { days: 1, hours: 1, minutes: 1, seconds: 1 }
	});

	expect(getByText('1 day')).toBeInTheDocument();
	expect(getByText('1 hour')).toBeInTheDocument();
	expect(getByText('1 minute')).toBeInTheDocument();
	expect(getByText('1 second')).toBeInTheDocument();
});

test('handles zero cases', () => {
	const { queryByText } = render(CountdownTimer, {
		time: { days: 0, hours: 0, minutes: 0, seconds: 1 }
	});

	expect(queryByText('day')).not.toBeInTheDocument();
	expect(queryByText('hour')).not.toBeInTheDocument();
	expect(queryByText('minute')).not.toBeInTheDocument();
	expect(queryByText('1 second')).toBeInTheDocument();
});
