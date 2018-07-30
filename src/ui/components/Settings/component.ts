import Component, { tracked } from '@glimmer/component';
import { DateTime } from 'luxon';
import {
  clone,
  lensPath,
  set
} from 'ramda';
import { actions, dispatch } from '../../../utils/lib/store';

const { SAVE_SETTINGS } = actions;

export default class Settings extends Component {
  @tracked('args', 'internalSettings')
  get settings() {
    return {
      date: {},
      ...this.args.settings,
      ...this.internalSettings
    };
  }
  set settings(value) {
    this.internalSettings = value;
  }

  @tracked
  public settingsNotification = '';

  @tracked('settings')
  get constructedDate() {
    return DateTime.fromObject(this.settings.date);
  }

  private internalSettings = {};

  public setSettingByChangeEvent(settingsKey, e) {
    let target = e.target;
    let { value } = target;
    const propPath = settingsKey.split('.');

    if (propPath[0] === 'date') {
      let minValue = target.getAttribute('min');
      let maxValue = target.getAttribute('max');
      value = Number(value);
      value = capAtMax(value, maxValue);
      value = capAtMin(value, minValue);
    }

    const settings = set(lensPath(propPath), value, clone(this.settings));
    this.settings = settings;
  }

  public saveSettings() {
    if (this.settingsNotification) {
      this.settingsNotification = '';
    }

    dispatch({
      action: SAVE_SETTINGS,
      settings: this.settings,
    }).then(() =>
      window.requestAnimationFrame(
        () => this.settingsNotification = 'Your settings have been saved.'
      )
    );
  }
}

function capAtMax(num, max) {
  num = Number(num);
  max = Number(max);
  return num > max ? max : num;
}

function capAtMin(num, min) {
  num = Number(num);
  min = Number(min);
  return num < min ? min : num;
}
