import { take, pipe } from 'ramda';
import {
  filterPhotosForSearchTerms,
  isPhotoStale,
  markPhotoAsBlocked,
  markPhotoAsSeen,
  photoHasDownload,
  photoIsBlocked,
  retrieveAllPhotos,
  shouldDownloadPhotos,
  storePhoto,
} from './photos';

import { cleanDownloadFromPhoto, cleanUnblockedPhotosWithoutGivenSearchTerms } from './cleaner';
import shuffle from './shuffle';
import isExtensionEnv from '../helpers/isExtensionEnv';
import { Replenisher } from './replenisher';
import type { Photo, WithBlob, WithSeenCount } from './types';
import { BackgroundOperation } from '../chrome/background';

const DOWNLOAD_BATCH_SIZE = 3;
const DELETE_STALE_BATCH_SIZE = 3;

export default class Manager {
  private _searchTerms = '';

  get searchTerms() {
    return this._searchTerms;
  }

  setSearchTerms(newSearchTerms) {
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
      async (photos) => (await photos).filter(photo => !photoIsBlocked(photo))
    )();

    return candidates;
  }

  async getDisplayablePhoto() {
    let displayablePhotos = await this.getDisplayablePhotoCandidates();
    console.log({ displayablePhotos });

    // we rely on the backlog to be replenished in the future, but it's possible:
    // 1. The photo has just changed the search terms
    // 2. The user has just blocked all photos
    // 3. The manager has cleaned old photos and is in the process of getting new ones
    if (!displayablePhotos?.length) {
      // kick off at least one backlog replenish to wait for
      await this.startReplenishBacklog();

      // wait for a suitable photo to be downloaded
      await this.waitForBacklog();

      // use the new photos
      displayablePhotos = await this.getDisplayablePhotoCandidates();
    }

    const photo = shuffle(displayablePhotos).pop();
    return photo;
  }

  async waitForBacklog(retries = 40) {
    const retryTimeoutMs = 250;
    console.log(`waitForBacklog: waiting for backlog, ${retries} retries remaining`);

    if (retries === 0) {
      throw new Error('Unable to replenish backlog');
    }

    const candidates = await this.getDisplayablePhotoCandidates();

    if (candidates.length > 0) {
      console.log('found candidates, we are good to go', candidates);
      return;
    }

    const wait = new Promise((resolve) => setTimeout(resolve, retryTimeoutMs));
    await wait;

    await this.waitForBacklog(--retries);
  }

  async startReplenishBacklog() {
    console.log('replenishBacklog: kicking off backlog replenish');
    const photos = await this.getSearchTermPhotos();

    if (!shouldDownloadPhotos(photos)) {
      console.log('startReplenishBacklog: should not download photos');
      return;
    }

    if (isExtensionEnv()) {
      chrome.runtime.sendMessage({
        operation: BackgroundOperation.REPLENISH_BACKLOG,
        downloadBatchSize: DOWNLOAD_BATCH_SIZE,
        searchTerms: this.searchTerms
      });
    } else {
      const replenisher = new Replenisher(this.searchTerms);

      // kick off in background to have parity with the chrome extension
      // `sendMessage` implementation
      replenisher.replenish();
    }
  }

  async removeStalePhotoBlobs() {
    const photos = await this.getSearchTermPhotos();
    const stalePhotos = photos.filter(photoHasDownload).filter(isPhotoStale);
    take(DELETE_STALE_BATCH_SIZE, stalePhotos).forEach(cleanDownloadFromPhoto);
  }

  async blockPhoto(photo: Photo) {
    markPhotoAsBlocked(photo);
    storePhoto(photo);

    // not awaiting, letting this happen in the background
    this.removeBlockedPhotoBlobs();
  }

  async removeOldPhotos() {
    cleanUnblockedPhotosWithoutGivenSearchTerms(this.searchTerms);
  }

  private async removeBlockedPhotoBlobs() {
    const photos = await this.getSearchTermPhotos();
    const blockedPhotosWithBlobs = photos.filter(photoIsBlocked).filter(photoHasDownload);
    blockedPhotosWithBlobs.forEach(cleanDownloadFromPhoto);
  }

  public markPhotoAsSeen(photo) {
    storePhoto(markPhotoAsSeen(photo));
  }
}
