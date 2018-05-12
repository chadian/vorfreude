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
    const { formatInterval } = CountdownTimer;

    this._intervalId = setInterval(
      () => this.time = formatInterval(this.currentInterval())
      , UPDATE_INTERVAL_IN_MS
    );
  }

  currentInterval() {
    const end = DateTime.fromObject(this.args.end);
    return Interval.fromDateTimes(DateTime.local(), end);
  }

  willDestroy() {
    clearInterval(this._intervalId);
  }
}
