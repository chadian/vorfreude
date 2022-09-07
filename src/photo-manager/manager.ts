import { take } from 'ramda';
import {
  filterForDownloadedPhotos,
  filterPhotosForSearchTerms,
  filterStalePhotos,
  markPhotoAsSeen,
  shouldDownloadPhotos
} from './photos';

import { cleanDownloadFromPhoto, cleanPhotosWithoutGivenSearchTerms } from './cleaner';

import shuffle from './shuffle';

import { fetchPopularPhotoUrl, replenish, retrieveAllPhotos, storePhoto } from './fetcher';

import isExtensionEnv from '../helpers/isExtensionEnv';

const BATCH_SIZE = 3;

export default class Manager {
  public static urlForBlob = (blob) => URL.createObjectURL(blob);

  private searchTerms = '';

  setSearchTerms(searchTerms) {
    this.searchTerms = searchTerms;
  }

  async getPhotos() {
    const allPhotos = await retrieveAllPhotos();
    const filteredPhotos = filterPhotosForSearchTerms(allPhotos, this.searchTerms);
    return filteredPhotos;
  }

  async getPhoto() {
    const downloadedPhotos = filterForDownloadedPhotos(await this.getPhotos());

    if (downloadedPhotos.length === 0) {
      const photoUrl = await fetchPopularPhotoUrl(this.searchTerms);
      return photoUrl;
    }

    const photo = shuffle(downloadedPhotos).pop();
    this.markPhotoAsSeen(photo);
    return Manager.urlForBlob(photo.blob);
  }

  async checkBacklog() {
    const photos = await this.getPhotos();
    if (shouldDownloadPhotos(photos)) {
      this.replenishBacklog();
    }
  }

  cleanPhotosFromPreviousSearchTerms() {
    cleanPhotosWithoutGivenSearchTerms(this.searchTerms);
  }

  async cleanBacklog() {
    const photos = await this.getPhotos();

    // only clean when we shouldn't be getting more photos
    if (shouldDownloadPhotos(photos)) {
      return;
    }

    take(BATCH_SIZE, filterStalePhotos(photos)).forEach(cleanDownloadFromPhoto);
  }

  private markPhotoAsSeen(photo) {
    storePhoto(markPhotoAsSeen(photo));
  }

  private replenishBacklog() {
    if (isExtensionEnv()) {
      chrome.runtime.sendMessage({
        operation: 'replenishBacklog',
        downloadBatchSize: BATCH_SIZE,
        searchTerms: this.searchTerms
      });
    } else {
      replenish(this.searchTerms);
    }
  }
}
