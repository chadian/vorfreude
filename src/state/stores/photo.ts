import { writable } from 'svelte/store';
import Manager from '../../photo-manager/manager';
import { getSettingsStore } from './settings';

export const currentPhoto = writable({ blur: false, url: '' });
const isBrowser = typeof window !== 'undefined';

let manager;

export async function setup() {
  if (!isBrowser) {
    return;
  }

  if (!manager) {
    manager = new Manager();
  }

  const settingsStore = await getSettingsStore();

  const unsubscribeSettingsStore = settingsStore.subscribe(async (settings) => {
    const { searchTerms } = settings;
    await updateCurrentPhoto(searchTerms);
  });

  return () => unsubscribeSettingsStore();
}

export async function performPhotoHouseKeeping() {
  if (!manager) {
    throw new Error('Store must be setup first, ensure `setup` has been called');
  }

  if (isBrowser) {
    await manager.replenishBacklog();
    await Promise.all([manager.removeStalePhotoBlobs(), manager.removeOldPhotos()]);
  }
}

async function updateCurrentPhoto(searchTerms) {
  if (!searchTerms) {
    return;
  }

  manager.setSearchTerms(searchTerms);
  const photoUrl = await manager.getPhoto();

  currentPhoto.update((cp) => {
    return {
      ...cp,
      url: photoUrl
    };
  });
}
