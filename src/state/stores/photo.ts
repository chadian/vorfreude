import { writable } from 'svelte/store';
import Manager from '../../photo-manager/manager';
import { getSettingsStore } from './settings';
export const currentPhoto = writable({ blur: false, url: '' });

const manager = new Manager();
const isBrowser = typeof window !== 'undefined';

export async function performPhotoHouseKeeping() {
  if (isBrowser) {
    await manager.checkAndReplenishBacklog();
    await Promise.all([manager.removeStalePhotoBlobs(), manager.removeOldPhotos()]);
  }
}

async function setPhoto(searchTerms) {
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

async function load() {
  if (!isBrowser) {
    return;
  }

  const settingsStore = await getSettingsStore();
  settingsStore.subscribe((settings) => {
    const { searchTerms } = settings;
    setPhoto(searchTerms);
  });
}

load();
