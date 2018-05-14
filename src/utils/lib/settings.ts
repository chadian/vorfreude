import { LocalStorageAdapter } from "./storage";

const SETTINGS_STORAGE_KEY = 'vorfreude-settings';

export function save(settings) {
  return storage().set(SETTINGS_STORAGE_KEY, settings);
}

export function load() {
  const { get } = storage();
  return get(SETTINGS_STORAGE_KEY);
}
// TODO: Add Chrome Storage Adapter
const storage = () => new LocalStorageAdapter();
