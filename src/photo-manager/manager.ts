import { take } from 'ramda';
import {
  filterPhotosForSearchTerms,
  isPhotoStale,
  markPhotoAsSeen,
  photoHasDownload,
  retrieveAllPhotos,
  shouldDownloadPhotos,
  storePhoto
} from './photos';

import { cleanDownloadFromPhoto, cleanPhotosWithoutGivenSearchTerms } from './cleaner';
import shuffle from './shuffle';
import { fetchPopularPhotoUrl } from './fetch';
import isExtensionEnv from '../helpers/isExtensionEnv';
import { Replenisher } from './replenisher';

const BATCH_SIZE = 3;

export default class Manager {
  public static urlForBlob = (blob) => URL.createObjectURL(blob);

  private searchTerms = '';
  private replenisher: Replenisher;

  setSearchTerms(newSearchTerms) {
    // set new
    this.searchTerms = newSearchTerms;
    this.replenisher = new Replenisher(newSearchTerms);

    this.removeOldPhotos();
  }

  async getPhotos() {
    const allPhotos = await retrieveAllPhotos();
    const filteredPhotos = filterPhotosForSearchTerms(allPhotos, this.searchTerms);
    return filteredPhotos;
  }

  async getPhoto() {
    const downloadedPhotos = (await this.getPhotos()).filter(photoHasDownload);

    // no photos downloaded, go get one directly
    if (downloadedPhotos.length === 0) {
      const photoUrl = await fetchPopularPhotoUrl(this.searchTerms);
      return photoUrl;
    }

    const photo = shuffle(downloadedPhotos).pop();
    this.markPhotoAsSeen(photo);
    return Manager.urlForBlob(photo.blob);
  }

  async checkAndReplenishBacklog() {
    const photos = await this.getPhotos();
    if (shouldDownloadPhotos(photos)) {
      this.replenishBacklog();
    }
  }

  async removeStalePhotoBlobs() {
    const photos = await this.getPhotos();
    const stalePhotos = photos.filter(isPhotoStale);
    take(BATCH_SIZE, stalePhotos).forEach(cleanDownloadFromPhoto);
  }

  async removeOldPhotos() {
    cleanPhotosWithoutGivenSearchTerms(this.searchTerms);
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
      this.replenisher?.replenish();
    }
  }
}
