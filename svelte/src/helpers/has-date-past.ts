import { DateTime } from "luxon";
import type { CountdownDateObject } from "src/types";

export function hasDatePast(date: CountdownDateObject): boolean {
  return DateTime.fromObject(date).diffNow('seconds').seconds < 0;
}
