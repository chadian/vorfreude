
import { take } from 'ramda';
import isExtensionEnv from './isExtensionEnv';
import shuffle from './shuffle';

import {
  fetchPhotos,
  fetchPopularPhotoUrl,
  query,
  replenish,
  retrieveAllPhotos,
  storePhoto
} from './fetcher';

const FRESH_PHOTO_THRESHOLD = 5;

export default class Manager {
  public static filterFreshPhotos = (photos) => photos.filter((photo) => photo.seen !== true);
  public static filterForDownloadedPhotos = (photos) => photos.filter((photo) => Boolean(photo.blob));
  public static filterForSearchTerms = (photos, searchTerms) => photos.filter(
    (photo) => photo.searchTerms === searchTerms
  )
  public static urlForBlob = (blob) => URL.createObjectURL(blob);

  public searchTerms = '';
  public photos = Promise.resolve([]);

  constructor(searchTerms) {
    this.searchTerms = searchTerms;

    this.photos = this.photos.then(async () => {
      let photos = await retrieveAllPhotos();
      return Manager.filterForSearchTerms(photos, this.searchTerms);
    });
  }

  public async getPhoto() {
    let photos = await this.photos;
    let freshPhotos = shuffle(Manager.filterFreshPhotos(photos));

    if (freshPhotos.length <= FRESH_PHOTO_THRESHOLD) {
      this.replenishBacklog();
    }

    if (freshPhotos.length > 0) {
      let photo = freshPhotos.pop();
      this.markPhotoAsSeen(photo);

      return Manager.urlForBlob(photo.blob);
    }

    if (photos.length > 0) {
      let blob = shuffle(
        Manager.filterForDownloadedPhotos(photos)
      ).pop().blob;

      return Manager.urlForBlob(blob);
    }

    return fetchPopularPhotoUrl(this.searchTerms);
  }

  public markPhotoAsSeen(photo) {
    photo.seen = true;
    storePhoto(photo);
  }

  public replenishBacklog() {
    if (isExtensionEnv()) {
      chrome.runtime.sendMessage({
        operation: 'replenishBacklog',
        searchTerms: this.searchTerms
      });
    } else {
      replenish(this.searchTerms);
    }
  }
}
