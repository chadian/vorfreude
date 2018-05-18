interface StorageAdapter {
  get(key: String):Promise<any>;
  set(key:String, value:any):Promise<any>;
}

export const getEnvironmentStorage = () => chrome.storage ?
    new ChromeStorageAdapter()
  : new LocalStorageAdapter();

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

export class ChromeStorageAdapter implements StorageAdapter {
  get(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, result => {
        resolve(result[key]);
      });
    });
  }

  set(key, value) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key] : value }, (result) => {
        result ? resolve(value) : undefined;
      });
    });
  }
}
