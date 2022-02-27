import { DateTime } from 'luxon';
import { clone, mergeAll } from 'ramda';
import { getEnvironmentStorage as storage } from './storage';

const VORFRUEDE_STORE_NAME = 'vorfreude';
const SETTINGS_STORAGE_KEY = 'vorfreude-settings';

export const actions = {
  SAVE_SETTINGS: 'SAVE_SETTINGS',
  SET_WALLPAPER_PHOTO_URL: 'SET_WALLPAPER_PHOTO_URL'
};

let INTERNAL_STORE = {
  photoUrl: '',
  settings: {}
};

let storeUpdateHandlers = [];

function refresh() {
  storeUpdateHandlers.forEach(
    (handler) => handler(clone(INTERNAL_STORE))
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
      .then((freshSettings) => {
        INTERNAL_STORE.settings = mergeAll(
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
  const initializers = [
    loadSettingsFromStorage,
    setDefaultSettings,
    setStore,
    () => refresh()
  ];

  initializers.reduce(
    (store, initializer) => store.then(initializer),
    Promise.resolve(INTERNAL_STORE)
  );
}

initStore();

function loadSettingsFromStorage(store) {
  return storage(VORFRUEDE_STORE_NAME)
    .get(SETTINGS_STORAGE_KEY)
    .then((settings) => {
      if (settings) {
        store.settings = settings;
      }

      return store;
    });
}

function setDefaultSettings(store) {
  let settings = store.settings || {};
  let currentYear = new Date().getFullYear();

  let defaultDay = {
    day: 1,
    hour: 0,
    minute: 0,
    month: 1,
    year: currentYear
  };

  if (DateTime.fromObject(defaultDay).diffNow() < 0) {
    defaultDay.year = currentYear + 1;
  }

  settings = {
    countdownMessage: 'Vorfreude',
    date: defaultDay,
    searchTerms: 'New York City',
    ...settings
  };

  return { ...store, settings };
}

function setStore(store) {
  INTERNAL_STORE = store;
}
