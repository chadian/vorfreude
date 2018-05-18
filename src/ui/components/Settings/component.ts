import Component, { tracked } from "@glimmer/component";
import { DateTime } from 'luxon';
import { load } from '../../../utils/lib/settings';
import { dispatch, actions } from '../../../utils/lib/store';

const { SAVE_SETTINGS } = actions;

import {
  lensPath,
  set,
  clone
} from 'ramda';

export default class Settings extends Component {
  didInsertElement() {
    load().then(settings => {
      this.settings = {
        ...this.settings,
        ...settings
      };
    });
  }

  @tracked
  settings = { date: {} }

  @tracked
  settingsNotification = ""

  @tracked('settings')
  get constructedDate() {
    return DateTime.fromObject(this.settings.date);
  }

  setSettingFromEvent(settingsKey, e) {
    let value = e.target.value;
    const propPath = settingsKey.split(".");

    // make sure all the date data values are numbers
    if (propPath[0] === 'date') {
      value = Number(value);
    }

    const settings = set(lensPath(propPath), value, clone(this.settings));
    this.settings = settings;
  }

  saveSettings() {
    this.settingsNotification = "Your settings have been saved.";

    dispatch({
      action: SAVE_SETTINGS,
      settings: this.settings
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
