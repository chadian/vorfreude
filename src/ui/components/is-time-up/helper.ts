import { DateTime } from "luxon";

export default function isTimeUp([ dateData ]) {
  if (!dateData) {
    return;
  }

  let date = DateTime.fromObject(dateData);
  return date.diffNow().milliseconds < 0;
}
