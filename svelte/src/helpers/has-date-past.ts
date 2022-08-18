import { DateTime } from "luxon";
import type { CountdownDateObject } from "src/types";

export function hasDatePast(date: CountdownDateObject) {
  return DateTime.fromObject(date).diffNow().seconds === 0;
}
