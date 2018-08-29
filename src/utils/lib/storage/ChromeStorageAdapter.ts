import IStorageAdapterInterface from './IStorageAdapterInterface';

export default class ChromeStorageAdapter implements IStorageAdapterInterface {
  public storeName = '';

  constructor(storeName: string) {
    this.storeName = storeName;
  }

  public get(key) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(this.storeName, (result) => {
          resolve((result && result[this.storeName] && result[this.storeName][key]) || null);
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
