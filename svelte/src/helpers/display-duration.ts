import { DateTime, Interval } from 'luxon';
import type { CountdownDateObject, CountdownDuration } from 'src/types';
import { skimDeadTime } from './skim-dead-time';

export function displayDuration(endDate: CountdownDateObject) {
  const end = DateTime.fromObject(endDate);
  const interval = Interval.fromDateTimes(DateTime.local(), end);

  let updatedDuration: CountdownDuration = interval
    .toDuration(['days', 'hours', 'minutes', 'seconds'])
    .toObject();

  if (updatedDuration.seconds) {
    updatedDuration.seconds = Math.floor(updatedDuration.seconds);
  }

  updatedDuration = skimDeadTime(updatedDuration);
  return updatedDuration;
}
