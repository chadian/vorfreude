import { LocalStorageAdapter, ChromeStorageAdapter } from "./storage";

const SETTINGS_STORAGE_KEY = 'vorfreude-settings';

export function save(settings) {
  return storage().set(SETTINGS_STORAGE_KEY, settings);
}

export function load() {
  const { get } = storage();
  return get(SETTINGS_STORAGE_KEY);
}

const storage = () => chrome.storage ?
    new ChromeStorageAdapter()
  : new LocalStorageAdapter();
