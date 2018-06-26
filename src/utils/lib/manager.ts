
import shuffle from "./shuffle";
import { take } from "ramda";
import isExtensionEnv from "./isExtensionEnv";

import {
  query,
  fetchPhotos,
  fetchPopularPhotoUrl,
  storePhoto,
  replenish,
  retrieveAllPhotos
} from "./fetcher";

const FRESH_PHOTO_THRESHOLD = 5;
const FETCH_PHOTO_BATCH_SIZE = 3;

export default class Manager {
  constructor(searchTerms) {
    this.searchTerms = searchTerms;

    this.photos = this.photos.then(async () => {
      let photos = await retrieveAllPhotos();
      return Manager.filterForSearchTerms(photos, this.searchTerms);
    });
  }

  static filterFreshPhotos = photos => photos.filter(photo => photo.seen !== true)
  static filterForDownloadedPhotos = photos => photos.filter(photo => Boolean(photo.blob))
  static filterForSearchTerms = (photos, searchTerms) => photos.filter(
    photo => photo.searchTerms === searchTerms
  )
  static urlForBlob = blob => URL.createObjectURL(blob);

  searchTerms = ""
  photos = Promise.resolve([])

  async getPhoto() {
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

  markPhotoAsSeen(photo) {
    photo.seen = true;
    storePhoto(photo);
  }

  replenishBacklog() {
    if (isExtensionEnv()) {
      chrome.runtime.sendMessage({
        operation: "replenishBacklog",
        searchTerms: this.searchTerms,
        downloadBatchSize: FETCH_PHOTO_BATCH_SIZE
      });
    } else {
      replenish(this.searchTerms, FETCH_PHOTO_BATCH_SIZE);
    }
  }
}
