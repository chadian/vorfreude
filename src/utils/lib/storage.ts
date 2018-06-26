import isExtensionEnv from './isExtensionEnv';

interface StorageAdapter {
  get(key: string):Promise<any>;
  set(key:String, value:any):Promise<any>;
}

export const getEnvironmentStorage = (storeName) => isExtensionEnv() ?
    new ChromeStorageAdapter(storeName)
  : new LocalStorageAdapter(storeName);

export class LocalStorageAdapter implements StorageAdapter {
  constructor(storeName: string) {
    this.storeName = storeName;
  }

  storeName = ""

  get(key) {
    return new Promise((resolve, reject) => {
      try {
        let store = JSON.parse(window.localStorage.getItem(this.storeName));
        resolve((store && store[key]) || null);
      } catch (e) {
        reject(e);
      }
    });
  }

  set(key, value) {
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

export class ChromeStorageAdapter implements StorageAdapter {
  constructor(storeName: string) {
    this.storeName = storeName;
  }

  storeName = ""

  get(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(this.storeName, result => {
        resolve((result && result[this.storeName][key]) || null);
      });
    });
  }

  set(key, value) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(this.storeName, (store) => {
        store = store || {};
        chrome.storage.local.set({ [this.storeName] : { ...store, [key]: value } }, resolve);
      });
    });
  }
}

export class SimpleIndexedDbAdapter implements StorageAdapter {
  constructor(tableName: string) {
    this.tableName = tableName;

    let request = indexedDB.open(SimpleIndexedDbAdapter.DB_KEY);

    this.db = new Promise((resolve, reject) => {
      request.onsuccess = () => {
        let db = request.result;
        resolve(db);
      };

      request.onerror = reject;
    });

    request.onupgradeneeded = () => {
      this.table = request.result.createObjectStore(tableName, { keyPath: "__id" });
    };
  }

  static DB_KEY = '__VORFREUDE'

  db = null
  table = null
  tableName = ""

  get(key) {
    let dbRead = db => new Promise((resolve, reject) => {
      let transaction = db.transaction(this.tableName, "readwrite");

      transaction.onerror = reject;
      transaction.onabort = reject;
      transaction.oncomplete = event => {
        resolve(request.result);
      };

      let request = transaction.objectStore(this.tableName).get(key);
    });

    return this.db.then(db => dbRead(db));
  }

  set(key, value) {
    let savedFormat = { __id: key, ...value };

    let dbWrite = db => new Promise((resolve, reject) => {
      let transaction = db.transaction(this.tableName, 'readwrite');

      transaction.onerror = reject;
      transaction.onabort = reject;
      transaction.oncomplete = event => resolve(key);

      transaction.objectStore(this.tableName).put(savedFormat);
    });

    return this.db
      .then(db => dbWrite(db))
      .then(() => savedFormat);
  }

  getAll() {
    let dbGetAll = db => new Promise((resolve, reject) => {
      let transaction = db.transaction(this.tableName, "readwrite");

      transaction.onerror = reject;
      transaction.onabort = reject;
      transaction.oncomplete = event => {
        resolve(request.result);
      };

      let request = transaction.objectStore(this.tableName).getAll();
    });

    return this.db
      .then(db => dbGetAll(db))
      .then();
  }
}
