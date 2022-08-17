import type { StorageAdapter } from "src/types";

export default class LocalStorageAdapter implements StorageAdapter {
  public storeName = '';

  constructor(storeName: string) {
    this.storeName = storeName;
  }

  public get(key) {
    return new Promise((resolve, reject) => {
      try {
        const store = JSON.parse(globalThis?.localStorage?.getItem(this.storeName) ?? null);
        resolve((store && store[key]) || undefined);
      } catch (e) {
        reject(e);
      }
    });
  }

  public set(key, value) {
    return new Promise((resolve, reject) => {
      try {
        const store = JSON.parse(globalThis?.localStorage?.getItem(this.storeName) ?? null);
        globalThis?.localStorage?.setItem(this.storeName, JSON.stringify({ ...store, [key]: value }));
        resolve(value);
      } catch (e) {
        reject(e);
      }
    });
  }
}
