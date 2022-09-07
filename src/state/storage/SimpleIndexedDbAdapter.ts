import type { StorageAdapter } from 'src/types';

export class SimpleIndexedDbAdapter implements StorageAdapter {
  public static DB_KEY = '__VORFREUDE';
  public db = null;
  public table = null;
  public tableName = '';

  constructor(tableName: string) {
    this.tableName = tableName;

    if (!globalThis.indexedDB) {
      return;
    }

    const request = indexedDB.open(SimpleIndexedDbAdapter.DB_KEY);

    this.db = new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const db = request.result;
        resolve(db);
      };

      request.onerror = reject;
    });

    request.onupgradeneeded = () => {
      this.table = request.result.createObjectStore(tableName, { keyPath: '__id' });
    };
  }

  public get(key) {
    const dbRead = (db) =>
      new Promise((resolve, reject) => {
        const transaction = db.transaction(this.tableName, 'readwrite');

        transaction.onerror = reject;
        transaction.onabort = reject;
        transaction.oncomplete = () => {
          resolve(request.result);
        };

        const request = transaction.objectStore(this.tableName).get(key);
      });

    return this.db.then((db) => dbRead(db));
  }

  public set(key, value) {
    const savedFormat = { __id: key, ...value };

    const dbWrite = (db) =>
      new Promise((resolve, reject) => {
        const transaction = db.transaction(this.tableName, 'readwrite');

        transaction.onerror = reject;
        transaction.onabort = reject;
        transaction.oncomplete = () => resolve(key);

        transaction.objectStore(this.tableName).put(savedFormat);
      });

    return this.db.then((db) => dbWrite(db)).then(() => savedFormat);
  }

  public remove(key) {
    const remove = (db) =>
      new Promise((resolve, reject) => {
        const transaction = db.transaction(this.tableName, 'readwrite');

        transaction.onerror = reject;
        transaction.onabort = reject;
        transaction.oncomplete = () => {
          resolve(request.result);
        };

        const request = transaction.objectStore(this.tableName).delete(key);
      });

    return this.db.then(remove);
  }

  public getAll() {
    const dbGetAll = (db) =>
      new Promise((resolve, reject) => {
        const transaction = db.transaction(this.tableName, 'readwrite');

        transaction.onerror = reject;
        transaction.onabort = reject;
        transaction.oncomplete = () => {
          resolve(request.result);
        };

        const request = transaction.objectStore(this.tableName).getAll();
      });

    return this.db.then(dbGetAll);
  }
}
