import { merge, clone } from "ramda";
import { getEnvironmentStorage as storage } from "./storage";

const VORFRUEDE_STORE_NAME = "vorfreude";
const SETTINGS_STORAGE_KEY = "vorfreude-settings";

export const actions = {
  'SAVE_SETTINGS': 'SAVE_SETTINGS',
  'SET_WALLPAPER_PHOTO_URL': 'SET_WALLPAPER_PHOTO_URL'
};

const INTERNAL_STORE = {
  settings: {},
  photoUrl: ''
};
let storeUpdateHandlers = [];

function refresh() {
  storeUpdateHandlers.forEach(
    handler => handler(clone(INTERNAL_STORE))
  );
}

export function addStoreUpdateHandler(handler) {
  storeUpdateHandlers.push(handler);
  refresh();
}

export function dispatch(actionObj) {
  let { action: actionKey } = actionObj;
  let action = actions[actionKey];

  if (action === actions.SAVE_SETTINGS) {
    let { settings } = actionObj;
    return storage(VORFRUEDE_STORE_NAME)
      .set(SETTINGS_STORAGE_KEY, settings)
      .then(freshSettings => {
        INTERNAL_STORE.settings = merge(
          clone(INTERNAL_STORE.settings),
          freshSettings
        );

        refresh();
      });
  }

  if (action === actions.SET_WALLPAPER_PHOTO_URL) {
    let { photoUrl } = actionObj;

    INTERNAL_STORE.photoUrl = photoUrl;
  }

  refresh();
}

function initStore() {
  storage(VORFRUEDE_STORE_NAME)
    .get(SETTINGS_STORAGE_KEY)
    .then(settings => {
      if (settings) {
        INTERNAL_STORE.settings = settings;
        refresh();
      }
    });
}

initStore();
