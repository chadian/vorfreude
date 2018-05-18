import { mergeDeepRight } from "ramda";
import { getEnvironmentStorage as storage } from "./storage";

const SETTINGS_STORAGE_KEY = "vorfreude-settings";

export const actions = {
  'SAVE_SETTINGS': 'SAVE_SETTINGS'
};

const INTERNAL_STORE = {};
let updateHandler;

export function dispatch(actionObj, finished) {
  let { action: actionKey } = actionObj;
  let action = actions[actionKey];

  if (action === actions.SAVE_SETTINGS) {
    let { settings } = actionObj;
      return storage()
        .set(SETTINGS_STORAGE_KEY, settings)
        .then(finished);
  }

  if (typeof updateHandler === "function") {
    updateHandler(mergeDeepRight({}, INTERNAL_STORE));
  }
}

export function setUpdateHandler(handler) {
  if (typeof handler === 'function') {
    updateHandler = handler;
  }
}
