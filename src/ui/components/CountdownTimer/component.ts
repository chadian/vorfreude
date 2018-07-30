import Component, { tracked } from '@glimmer/component';
import { DateTime, Interval } from 'luxon';

const UPDATE_INTERVAL_IN_MS = 500;
export default class CountdownTimer extends Component {

  public static formatInterval(interval) {
    let { skimDeadTime } = CountdownTimer;
    let formatted = interval.toDuration(['days', 'hours', 'minutes', 'seconds']).toObject();
    formatted.seconds = Math.floor(formatted.seconds);

    return skimDeadTime({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      ...formatted
    });
  }

  public static skimDeadTime(interval, skimWith=['days', 'hours', 'minutes', 'seconds']) {
    let { skimDeadTime } = CountdownTimer;

    if (skimWith.length === 0) {
      return interval;
    }

    if (interval[skimWith[0]] > 0) {
      return interval;
    }

    interval = { ...interval };
    delete interval[skimWith.shift()];
    return skimDeadTime(interval, skimWith);
  }

  @tracked
  public time = '';

  private intervalId = null;

  public didInsertElement() {
    this.intervalId = setInterval(() => this.updateTime(), UPDATE_INTERVAL_IN_MS);
    this.updateTime();
  }

  public updateTime() {
    const { formatInterval } = CountdownTimer;
    let endValue = this.args.end;

    if (endValue) {
      const end = DateTime.fromObject(endValue);
      const interval = Interval.fromDateTimes(DateTime.local(), end);
      this.time = formatInterval(interval);
    }
  }

  public willDestroy() {
    clearInterval(this.intervalId);
  }
}
