import { merge, clone } from "ramda";
import { getEnvironmentStorage as storage } from "./storage";

const SETTINGS_STORAGE_KEY = "vorfreude-settings";

export const actions = {
  'SAVE_SETTINGS': 'SAVE_SETTINGS'
};

const INTERNAL_STORE = { settings: {} };
let updateHandler;

function refresh() {
  if (typeof updateHandler === "function") {
    updateHandler(clone(INTERNAL_STORE));
  }
}

export function initStore(handler) {
  if (typeof handler === 'function') {
    updateHandler = handler;
  }

  storage()
    .get(SETTINGS_STORAGE_KEY)
    .then(settings => {
      INTERNAL_STORE.settings = settings;
      refresh();
    });
}

export function dispatch(actionObj) {
  let { action: actionKey } = actionObj;
  let action = actions[actionKey];

  if (action === actions.SAVE_SETTINGS) {
    let { settings } = actionObj;
    return storage()
      .set(SETTINGS_STORAGE_KEY, settings)
      .then(freshSettings => {
        INTERNAL_STORE.settings = merge(
          clone(INTERNAL_STORE.settings),
          freshSettings
        );
        refresh();
      });
  }

  refresh();
}
