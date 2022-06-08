import { writable } from 'svelte/store';
import { DateTime } from 'luxon';
import { getStorage } from '../storage/storage';

const storage = getStorage();
const SETTINGS_STORAGE_KEY = 'vorfreude-settings';

function getStorageSettings() {
  return storage.get(SETTINGS_STORAGE_KEY) ?? {};
}

export function getDefaultSettings() {
	const currentYear = new Date().getFullYear();

	const defaultDay = {
		year: currentYear,
		month: 1,
		day: 1,
		minute: 0,
    hour: 0,
	};

  // bump default year forward a year if the defaultDay has already passed
	if (DateTime.fromObject(defaultDay).diffNow().seconds < 0) {
		defaultDay.year = currentYear + 1;
	}

  return {
    countdownMessage: 'Vorfreude',
    allDoneMessage: 'Countdown complete!',
    searchTerms: 'New York City',
    date: defaultDay,
  };
}

function getSettings() {
  const defaultSettings = getDefaultSettings();
	const storageSettings = getStorageSettings();

  const settings = {
    ...defaultSettings,
    ...storageSettings
  };

  return settings;
}

let settingsStore;

export function getSettingsStore() {
  if (!settingsStore) {
    settingsStore = writable(getSettings());

    settingsStore.subscribe((settings) => {
      storage.set(SETTINGS_STORAGE_KEY, settings);
    });
  }

  return settingsStore;
}

export function resetSettingsStore() {
  if (settingsStore) {
    settingsStore.set(getSettings());
  }
}
