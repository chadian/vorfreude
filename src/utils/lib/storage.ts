import isExtensionEnv from './isExtensionEnv';
import ChromeStorageAdapter from './storage/ChromeStorageAdapter';
import LocalStorageAdapter from './storage/LocalStorageAdapter';

export const getEnvironmentStorage = (storeName) => isExtensionEnv() ?
    new ChromeStorageAdapter(storeName)
  : new LocalStorageAdapter(storeName);
