import type { CountdownDuration } from '../types';

const durationKeys: Array<keyof CountdownDuration> = ['days', 'hours', 'minutes', 'seconds'];

export function skimDeadTime(interval, skimKeys = durationKeys) {
	if (skimKeys.length === 0) {
		return interval;
	}

	if (interval[skimKeys[0]] > 0) {
		return interval;
	}

	interval = {...interval };
	delete interval[skimKeys.shift()];
	return skimDeadTime(interval, skimKeys);
}
