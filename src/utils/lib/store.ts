import { mergeDeepRight } from "ramda";
import { getEnvironmentStorage as storage } from "./storage";

const SETTINGS_STORAGE_KEY = "vorfreude-settings";

export const actions = {
  'SAVE_SETTINGS': 'SAVE_SETTINGS'
};

const INTERNAL_STORE = { settings: {} };
let updateHandler;

storage().get(SETTINGS_STORAGE_KEY).then(settings => {
  INTERNAL_STORE.settings = settings;
  refresh();
});

function refresh() {
  if (typeof updateHandler === "function") {
    updateHandler(mergeDeepRight({}, INTERNAL_STORE));
  }
}

export function dispatch(actionObj) {
  let { action: actionKey } = actionObj;
  let action = actions[actionKey];

  if (action === actions.SAVE_SETTINGS) {
    let { settings } = actionObj;
      return storage()
        .set(SETTINGS_STORAGE_KEY, settings)
        .then(freshSettings => {
          INTERNAL_STORE.settings = mergeDeepRight(INTERNAL_STORE.settings, freshSettings);
          refresh();
        });
  }

  refresh();
}

export function setUpdateHandler(handler) {
  if (typeof handler === 'function') {
    updateHandler = handler;
    refresh();
  }
}
