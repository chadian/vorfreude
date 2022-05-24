import '@testing-library/jest-dom';

import { render } from '@testing-library/svelte';

import CountdownTimer from './CountdownTimer.svelte';

test('shows proper heading when rendered', () => {
	const { getByText } = render(CountdownTimer, {
		time: { days: 1, hours: 2, minutes: 3, seconds: 4 }
	});

	expect(getByText('1 day')).toBeInTheDocument();
	expect(getByText('2 hours')).toBeInTheDocument();
	expect(getByText('3 minutes')).toBeInTheDocument();
	expect(getByText('4 seconds')).toBeInTheDocument();
});
