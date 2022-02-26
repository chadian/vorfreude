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
      value = Math.max(value, maxValue);
      value = Math.min(value, minValue);
    }

    const settings = set(lensPath(propPath), value, clone(this.settings));
    this.settings = settings;
  }

  async public saveSettings() {
    if (this.settingsNotification) {
      this.settingsNotification = '';
    }

    await dispatch({
      action: SAVE_SETTINGS,
      settings: this.settings,
    });

    history.pushState({}, document.title, '/');
  }

  public handleKeyDown(event) {
    // on escape go back to main route
    if (event.keyCode === 27) {
      document.location.href = '#';
    }
  }

  private didInsertElement() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  private willDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}
