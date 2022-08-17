import type { CountdownDuration } from '../types';

export function skimDeadTime(
  duration: CountdownDuration,
  skimKeys: Array<keyof CountdownDuration> = ['days', 'hours', 'minutes', 'seconds']
) {
  duration = { ...duration };
  // console.log({ duration, skimKeys });

  if (skimKeys.length === 0) {
    return duration;
  }

  const currentKey = skimKeys.shift();
  if (duration[currentKey] > 0) {
    return duration;
  }

  delete duration[currentKey];
  return skimDeadTime(duration, skimKeys);
}
