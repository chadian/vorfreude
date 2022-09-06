import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { getStorage } from '../storage/storage';
import { hasDatePast } from '../../helpers/has-date-past'
import type { CountdownDateObject } from 'src/types';

type Settings = {
  countdownMessage: string;
  allDoneMessage: string;
  searchTerms: string;
  date: CountdownDateObject,
};

const storage = getStorage();
const SETTINGS_STORAGE_KEY = 'vorfreude-settings';

async function getStorageSettings() {
  return (await storage.get(SETTINGS_STORAGE_KEY)) ?? {};
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

	if (hasDatePast(defaultDay)) {
    // bump default year forward a year if the defaultDay has already passed
		defaultDay.year = currentYear + 1;
	}

  return {
    countdownMessage: 'Vorfreude',
    allDoneMessage: 'Countdown complete!',
    searchTerms: 'New York City',
    date: defaultDay,
  };
}

async function getInitialSettings(): Promise<Settings> {
  const defaultSettings = getDefaultSettings();
	const storageSettings = await getStorageSettings();

  const settings = {
    ...defaultSettings,
    ...storageSettings
  };

  return settings;
}

let settingsStore: Writable<Settings>;

export async function getSettingsStore(): Promise<typeof settingsStore> {
  if (!settingsStore) {
    settingsStore = writable(await getInitialSettings());

    settingsStore.subscribe((settings) => {
      storage.set(SETTINGS_STORAGE_KEY, settings);
    });
  }

  return settingsStore;
}

export async function resetSettingsStore() {
  if (settingsStore) {
    settingsStore.set(await getInitialSettings());
  }
}
