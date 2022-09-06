import isExtensionEnv from '../../helpers/isExtensionEnv';
import ChromeStorageAdapter from './ChromeStorageAdapter';
import LocalStorageAdapter from './LocalStorageAdapter';

const VORFREUDE_STORAGE_NAME = 'vorfreude';

const getEnvironmentStorage = (storeName) => isExtensionEnv() ?
    new ChromeStorageAdapter(storeName)
  : new LocalStorageAdapter(storeName);

let vorfreudeStorage;

export const getStorage = () => {
  if (!vorfreudeStorage) {
    vorfreudeStorage = getEnvironmentStorage(VORFREUDE_STORAGE_NAME);
  }

  return vorfreudeStorage;
}
