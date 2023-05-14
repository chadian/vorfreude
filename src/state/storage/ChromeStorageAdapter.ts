import type { StorageAdapter } from 'src/types';

export default class ChromeStorageAdapter implements StorageAdapter {
  public storeName = '';

  constructor(storeName: string) {
    this.storeName = storeName;
  }

  public get(key) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(this.storeName, (storage) => {
          resolve(storage?.[this.storeName]?.[key] ?? null);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  public set(key, value) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(this.storeName, (storage) => {
          const updated = {
            ...storage,
            [this.storeName]: {
              ...(storage[this.storeName] ?? {}),
              ...{ [key]: value }
            }
          };

          chrome.storage.local.set(updated, () => resolve(value));
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
