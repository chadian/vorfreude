import { take, pipe } from 'ramda';
import {
  filterBlockedPhotos,
  filterPhotosForSearchTerms,
  markPhotoAsBlocked,
  markPhotoAsSeen,
  photoHasDownload,
  retrieveAllPhotos,
  shouldDownloadPhotos,
  storePhoto,
} from './photos';

import { cleanDownloadFromPhoto, cleanUnblockedPhotosWithoutGivenSearchTerms } from './cleaner';
import shuffle from './shuffle';
import isExtensionEnv from '../helpers/isExtensionEnv';
import { Replenisher } from './replenisher';
import type { Photo, WithBlob, WithSeenCount } from './types';

const DOWNLOAD_BATCH_SIZE = 3;
const DELETE_STALE_BATCH_SIZE = 3;

export default class Manager {
  private _searchTerms = '';

  get searchTerms() {
    return this._searchTerms;
  }

  setSearchTerms(newSearchTerms) {
    // set new
    this._searchTerms = newSearchTerms;
    this.removeOldPhotos();
  }

  async getSearchTermPhotos() {
    const filteredPhotos = pipe(
      async () => retrieveAllPhotos(),
      async (photos) => filterPhotosForSearchTerms(await photos, this.searchTerms),
    );

    return (await filteredPhotos()) ?? [];
  }

  async getDisplayablePhotoCandidates(): Promise<(Photo & WithSeenCount & WithBlob)[]> {
    const candidates = await pipe(
      async () => this.getSearchTermPhotos(),
      async (photos) => (await photos).filter(photoHasDownload),
      async (photos) => filterBlockedPhotos(await photos)
    )();

    return candidates;
  }

  async getDisplayablePhoto() {
    // no photos available
    // we rely on the backlog to be replenished in the future, but it's possible:
    // 1. The photo has just changed the search terms
    // 2. The user has just blocked all photos
    // 3. The manager has cleaned old photos and is in the process of getting new ones
    await this.waitForBacklog();

    const displayablePhotos = await this.getDisplayablePhotoCandidates();
    const photo = shuffle(displayablePhotos).pop();
    this.markPhotoAsSeen(photo);

    return photo;
  }

  async waitForBacklog(retries = 10) {
    const retryTimeout = 500;
    console.log('waiting for backlog', retries);

    if (retries === 0) {
      throw new Error('Unable to replenish backlog');
    }

    await this.replenishBacklog();
    const candidates = await this.getDisplayablePhotoCandidates();

    if (candidates.length > 0) {
      return;
    }

    const wait = new Promise((resolve) => setTimeout(resolve, retryTimeout));
    await wait;

    await this.waitForBacklog(retries--);
  }

  async replenishBacklog() {
    const photos = await this.getSearchTermPhotos();

    if (!shouldDownloadPhotos(photos)) {
      return;
    }

    if (isExtensionEnv()) {
      chrome.runtime.sendMessage({
        operation: 'replenishBacklog',
        downloadBatchSize: DOWNLOAD_BATCH_SIZE,
        searchTerms: this.searchTerms
      });
    } else {
      const replenisher = new Replenisher(this.searchTerms);
      replenisher.replenish();
    }
  }

  async removeStalePhotoBlobs() {
    const photos = (await this.getSearchTermPhotos());
    const stalePhotos = photos.filter(photoHasDownload);
    take(DELETE_STALE_BATCH_SIZE, stalePhotos).forEach(cleanDownloadFromPhoto);
  }

  async blockPhoto(photo: Photo) {
    markPhotoAsBlocked(photo);
    storePhoto(photo);
    await this.removeBlockedPhotoBlobs();
  }

  async removeOldPhotos() {
    cleanUnblockedPhotosWithoutGivenSearchTerms(this.searchTerms);
  }

  private async removeBlockedPhotoBlobs() {
    const photos = await this.getSearchTermPhotos();
    const blockedPhotosWithBlobs = filterBlockedPhotos(photos).filter(photoHasDownload);
    blockedPhotosWithBlobs.forEach(cleanDownloadFromPhoto);
  }

  private markPhotoAsSeen(photo) {
    storePhoto(markPhotoAsSeen(photo));
  }
}
