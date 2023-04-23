import type { Photo, WithBlob } from 'src/photo-manager/types';
import { writable } from 'svelte/store';
import Manager from '../../photo-manager/manager';
import { getSettingsStore } from './settings';

const isBrowser = typeof window !== 'undefined';
let manager: Manager;

export const currentPhoto = writable<{ blur: boolean; photo?: Photo & WithBlob }>(
  { blur: false, photo: undefined }
);

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
    manager.setSearchTerms(searchTerms);
    await refreshCurrentPhoto();
  });

  return () => unsubscribeSettingsStore();
}

export async function performPhotoHouseKeeping() {
  if (!manager) {
    throw new Error('Store must be setup first, ensure `setup` has been called');
  }

  if (isBrowser) {
    await manager.startReplenishBacklog();
    await Promise.all([manager.removeStalePhotoBlobs(), manager.removeOldPhotos()]);
  }
}

function clearCurrentPhoto() {
  currentPhoto.update((cp) => {
    return {
      ...cp,
      photo: undefined,
    };
  });
}

export async function blockPhoto(photo: Photo) {
  clearCurrentPhoto();
  await manager.blockPhoto(photo);
  await refreshCurrentPhoto();
}

async function refreshCurrentPhoto() {
  const photo = await manager.getDisplayablePhoto();

  if (!photo) {
    const errorMessage = 'refreshCurrentPhoto: could not get photo from manager';
    console.error(errorMessage, photo)
    throw new Error(errorMessage);
  }

  manager.markPhotoAsSeen(photo);

  currentPhoto.update((cp) => {
    return {
      ...cp,
      photo,
    };
  });
}
