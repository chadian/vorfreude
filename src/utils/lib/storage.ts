interface StorageAdapter {
  get(key: String):Promise<any>;
  set(key:String, value:any):Promise<any>;
}

export class LocalStorageAdapter implements StorageAdapter {
  get(key) {
    return new Promise((resolve, reject) => {
      try {
        resolve(
          JSON.parse(window.localStorage.getItem(key))
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  set(key, value) {
    return new Promise((resolve, reject) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        resolve(value);
      } catch (e) {
        reject(e);
      }
    });
  }
}
