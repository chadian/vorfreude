import Component, { tracked } from "@glimmer/component";
import { DateTime } from 'luxon';
import { dispatch, actions } from '../../../utils/lib/store';

const { SAVE_SETTINGS } = actions;

import {
  lensPath,
  set,
  clone
} from 'ramda';

export default class Settings extends Component {
  _settings = {}

  @tracked("args", "_settings")
  get settings() {
    return {
      date: {},
      ...this.args.settings,
      ...this._settings
    };
  }
  set settings(value) {
    this._settings = value;
  }

  @tracked
  settingsNotification = ""

  @tracked('settings')
  get constructedDate() {
    return DateTime.fromObject(this.settings.date);
  }

  setSettingByChangeEvent(settingsKey, e) {
    let target = e.target;
    let { value } = target;
    const propPath = settingsKey.split(".");

    if (propPath[0] === 'date') {
      let minValue = target.getAttribute("min");
      let maxValue = target.getAttribute("max");
      value = Number(value);
      value = capAtMax(value, maxValue);
      value = capAtMin(value, minValue);
    }

    const settings = set(lensPath(propPath), value, clone(this.settings));
    this.settings = settings;
  }

  saveSettings() {
    this.settingsNotification = "Your settings have been saved.";

    dispatch({
      action: SAVE_SETTINGS,
      settings: this.settings,
    }).then(() =>
      setTimeout(
        () =>
          document
            .querySelector("#Settings__notification")
            .addEventListener(
              "animationend",
              (e: AnimationEvent) => {
                if (e.animationName === "notification-out")
                  this.settingsNotification = "";
              },
              false
            ),
        10
      )
    );
  }
}

function capAtMax(number, max) {
  number = Number(number);
  max = Number(max);
  return number > max ? max : number;
}

function capAtMin(number, min) {
  number = Number(number);
  min = Number(min);
  return number < min ? min : number;
}
