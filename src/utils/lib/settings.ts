import {
  LocalStorageAdapter,
  ChromeStorageAdapter,
  getEnvironmentStorage as storage
} from "./storage";

const SETTINGS_STORAGE_KEY = 'vorfreude-settings';

export function load() {
  const { get } = storage();
  return get(SETTINGS_STORAGE_KEY);
}


