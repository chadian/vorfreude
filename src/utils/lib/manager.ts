import { take } from 'ramda';
import isExtensionEnv from './isExtensionEnv';
import {
  filterForDownloadedPhotos,
  filterPhotosForSearchTerms,
  filterStalePhotos,
  markPhotoAsSeen,
  shouldDownloadPhotos,
} from './manager/photos';

import { cleanDownloadFromPhoto } from './manager/cleaner';

import shuffle from './shuffle';

import {
  fetchPopularPhotoUrl,
  replenish,
  retrieveAllPhotos,
  storePhoto
} from './manager/fetcher';

const BATCH_SIZE = 3;

export default class Manager {
  public static urlForBlob = (blob) => URL.createObjectURL(blob);

  public searchTerms = '';
  public photos = Promise.resolve([]);

  constructor(searchTerms) {
    this.searchTerms = searchTerms;

    this.photos = this.photos.then(async () => {
      let photos = await retrieveAllPhotos();
      return filterPhotosForSearchTerms(photos, this.searchTerms);
    });
  }

  public async getPhoto() {
    let downloadedPhotos = filterForDownloadedPhotos(await this.photos);

    if (downloadedPhotos.length > 0) {
      let photo = shuffle(downloadedPhotos).pop();
      this.markPhotoAsSeen(photo);
      return Manager.urlForBlob(photo.blob);
    }

    return fetchPopularPhotoUrl(this.searchTerms);
  }

  public async checkBacklog() {
    let photos = await this.photos;
    if (shouldDownloadPhotos(photos)) {
      this.replenishBacklog();
    }
  }

  public async cleanBacklog() {
    let photos = await this.photos;

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
        downloadBatchSize: BATCH_SIZE,
        operation: 'replenishBacklog',
        searchTerms: this.searchTerms
      });
    } else {
      replenish(this.searchTerms);
    }
  }
}
