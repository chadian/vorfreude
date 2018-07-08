import IStorageAdapter from './IStorageAdapter';

export default class LocalStorageAdapter implements IStorageAdapter {
  public storeName = '';

  constructor(storeName: string) {
    this.storeName = storeName;
  }

  public get(key) {
    return new Promise((resolve, reject) => {
      try {
        let store = JSON.parse(window.localStorage.getItem(this.storeName));
        resolve((store && store[key]) || null);
      } catch (e) {
        reject(e);
      }
    });
  }

  public set(key, value) {
    return new Promise((resolve, reject) => {
      try {
        let store = JSON.parse(window.localStorage.getItem(this.storeName));
        window.localStorage.setItem(this.storeName, JSON.stringify({ ...store, [key]: value }));
        resolve(value);
      } catch (e) {
        reject(e);
      }
    });
  }
}
