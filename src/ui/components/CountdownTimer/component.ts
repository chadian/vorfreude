import Component, { tracked } from "@glimmer/component";
import { DateTime, Interval } from 'luxon';

const UPDATE_INTERVAL_IN_MS = 500;
export default class CountdownTimer extends Component {
  @tracked
  time = ""

  _intervalId = null

  static formatInterval(interval) {
    const formatted = interval.toDuration(['days', 'hours', 'minutes', 'seconds']).toObject();
    formatted.seconds = Math.floor(formatted.seconds);

    return formatted;
  }

  didInsertElement() {
    this._intervalId = setInterval(() => this.updateTime(), UPDATE_INTERVAL_IN_MS);
    this.updateTime();
  }

  updateTime() {
    const { formatInterval } = CountdownTimer;
    let endValue = this.args.end;

    if (endValue) {
      const end = DateTime.fromObject(endValue);
      const interval = Interval.fromDateTimes(DateTime.local(), end);
      this.time = formatInterval(interval);
    }
  }

  willDestroy() {
    clearInterval(this._intervalId);
  }
}
