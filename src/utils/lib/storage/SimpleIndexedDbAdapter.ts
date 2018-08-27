import IStorageAdapterInterface from './IStorageAdapterInterface';

export class SimpleIndexedDbAdapter implements IStorageAdapterInterface {
  public static DB_KEY = '__VORFREUDE';
  public db = null;
  public table = null;
  public tableName = '';

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
      this.table = request.result.createObjectStore(tableName, { keyPath: '__id' });
    };
  }

  public get(key) {
    let dbRead = (db) => new Promise((resolve, reject) => {
      let transaction = db.transaction(this.tableName, 'readwrite');

      transaction.onerror = reject;
      transaction.onabort = reject;
      transaction.oncomplete = () => {
        resolve(request.result);
      };

      let request = transaction.objectStore(this.tableName).get(key);
    });

    return this.db.then((db) => dbRead(db));
  }

  public set(key, value) {
    let savedFormat = { __id: key, ...value };

    let dbWrite = (db) => new Promise((resolve, reject) => {
      let transaction = db.transaction(this.tableName, 'readwrite');

      transaction.onerror = reject;
      transaction.onabort = reject;
      transaction.oncomplete = () => resolve(key);

      transaction.objectStore(this.tableName).put(savedFormat);
    });

    return this.db
      .then((db) => dbWrite(db))
      .then(() => savedFormat);
  }

  public remove(key) {
    let remove = (db) => new Promise((resolve, reject) => {
      let transaction = db.transaction(this.tableName, 'readwrite');

      transaction.onerror = reject;
      transaction.onabort = reject;
      transaction.oncomplete = () => {
        resolve(request.result);
      };

      let request = transaction.objectStore(this.tableName).delete(key);
    });

    return this.db.then(remove);
  }

  public getAll() {
    let dbGetAll = (db) => new Promise((resolve, reject) => {
      let transaction = db.transaction(this.tableName, 'readwrite');

      transaction.onerror = reject;
      transaction.onabort = reject;
      transaction.oncomplete = () => {
        resolve(request.result);
      };

      let request = transaction.objectStore(this.tableName).getAll();
    });

    return this.db.then(dbGetAll);
  }


}
