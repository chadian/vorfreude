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
  storePhoto
} from './photos';

import { cleanDownloadFromPhoto, cleanUnblockedPhotosWithoutGivenSearchTerms } from './cleaner';
import shuffle from './shuffle';
import isExtensionEnv from '../helpers/isExtensionEnv';
import { Replenisher } from './replenisher';
import type { Photo, WithOptionalBlob, WithSeenCount } from './types';
import { BackgroundOperation } from '../background-operation';
import Debug from 'debug';

const DOWNLOAD_BATCH_SIZE = 3;
const DELETE_STALE_BATCH_SIZE = 3;
const debug = Debug('manager');

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
      async (photos) => filterPhotosForSearchTerms(await photos, this.searchTerms)
    );

    return (await filteredPhotos()) ?? [];
  }

  async getDisplayablePhotoCandidates(): Promise<(Photo & WithSeenCount & WithOptionalBlob)[]> {
    const candidates = await pipe(
      async () => this.getSearchTermPhotos(),
      async (photos) => (await photos).filter(photoHasDownload),
      async (photos) => (await photos).filter((photo) => !photoIsBlocked(photo))
    )();

    return candidates;
  }

  async getDisplayablePhoto() {
    let displayablePhotos = await this.getDisplayablePhotoCandidates();
    debug(`getDisplayablePhoto: found ${displayablePhotos.length} photos to display`);

    // we rely on the backlog to be replenished but it's possible:
    // 1. The photo has just changed the search terms
    // 2. The user has blocked the remaining photos
    // 3. The manager has cleaned old photos and is in the process of getting new ones
    if (!displayablePhotos?.length && (await this.shouldReplenishBacklog())) {
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
    debug(`waitForBacklog: waiting for backlog, ${retries} retries remaining`);

    if (retries === 0) {
      throw new Error('Unable to replenish backlog');
    }

    const candidates = await this.getDisplayablePhotoCandidates();

    if (candidates.length > 0) {
      debug('waitForBacklog: found candidates, exiting', candidates);
      return;
    }

    const wait = new Promise((resolve) => setTimeout(resolve, retryTimeoutMs));
    await wait;

    await this.waitForBacklog(--retries);
  }

  async shouldReplenishBacklog() {
    const photos = await this.getSearchTermPhotos();
    return shouldDownloadPhotos(photos);
  }

  async startReplenishBacklog() {
    debug('replenishBacklog: kicking off backlog replenish');

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

    debug('replenishBacklog: finished backlog replenish');
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
