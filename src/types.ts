import type { DurationObjectUnits, ToObjectOutput } from 'luxon';

export type CountdownDateObject = Pick<
  ToObjectOutput,
  'year' | 'month' | 'day' | 'hour' | 'minute'
>;

export type CountdownDuration = Pick<DurationObjectUnits, 'days' | 'hours' | 'minutes' | 'seconds'>;

export interface StorageAdapter {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<any>;
}
