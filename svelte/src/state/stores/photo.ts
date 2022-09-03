import { get, writable } from 'svelte/store';
import Manager from '../../photo-manager/manager';
import { getSettingsStore } from './settings';
export const currentPhoto = writable({ blur: false, url: '' });

const manager = new Manager();

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
    }
  });
}

async function load() {
  const isBrowser = typeof window !== 'undefined';
  if (!isBrowser) {
    return;
  }

  const settingsStore = await getSettingsStore();
  const initialSearchTerms = get(settingsStore).searchTerms;
  await setPhoto(initialSearchTerms);

  settingsStore.subscribe((settings) => {
    const { searchTerms } = settings;
    setPhoto(searchTerms);
  });
}

load();
