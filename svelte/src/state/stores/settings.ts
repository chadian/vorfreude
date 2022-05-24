import { writable } from 'svelte/store';
import { DateTime } from 'luxon';
import { getStorage } from '../storage/storage';

const storage = getStorage();
const SETTINGS_STORAGE_KEY = 'vorfreude-settings';

function createSettings() {
  const defaultSettings = getDefaultSettings();
	const storageSettings = storage.get(SETTINGS_STORAGE_KEY) ?? {};

  const settings = {
    ...defaultSettings,
    ...storageSettings
  };

  return writable(settings);
}

function getDefaultSettings() {
	const currentYear = new Date().getFullYear();

	const defaultDay = {
		day: 1,
		hour: 0,
		minute: 0,
		month: 1,
		year: currentYear
	};

	if (DateTime.fromObject(defaultDay).diffNow() < 0) {
		defaultDay.year = currentYear + 1;
	}

  return {
    countdownMessage: 'Vorfreude',
    date: defaultDay,
    searchTerms: 'New York City',
  };
}

export const settings = createSettings();

settings.subscribe((settings) => {
  storage.set(SETTINGS_STORAGE_KEY, settings);
});
