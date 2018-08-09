import IStorageAdapter from './IStorageAdapter';

export default class ChromeStorageAdapter implements IStorageAdapter {
  public storeName = '';

  constructor(storeName: string) {
    this.storeName = storeName;
  }

  public get(key) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(this.storeName, (result) => {
          resolve((result && result[this.storeName] && result[this.storeName][key]) || undefined);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  public set(key, value) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(this.storeName, (store) => {
          store = store || {};
          chrome.storage.local.set({ [this.storeName]: { ...store, [key]: value } }, resolve);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}