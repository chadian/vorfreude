import { SimpleIndexedDbAdapter } from '../state/storage/SimpleIndexedDbAdapter';

export type Photo = {
  id: string;
  url_o: string;
};

export type WithSearchTerms = {
  searchTerms: string;
}

export type WithBlob = {
  blob: Blob;
}

export type WithSeenCount = {
  seenCount?: number;
};

const STALE_SEEN_COUNT = 3;
const ALLOWABLE_STALE_PERCENTAGE = 75;
const MAX_TOTAL_DOWNLOADED = 20;

const indexStorage = new SimpleIndexedDbAdapter('VORFREUDE_PHOTO_STORAGE');

export const photoHasDownload = (photo) => Boolean(photo.blob);
export const isPhotoStale = (photo) => photo.blob && photo.seenCount > STALE_SEEN_COUNT;

export const shouldDownloadPhotos = (photos) => {
  const downloadedPhotos = photos.filter(photoHasDownload);
  const stalePhotos = photos.filter(isPhotoStale);

  const stalePercentage =
    100 * (stalePhotos.length / downloadedPhotos.length);

  const pastStalePercentage = stalePercentage > ALLOWABLE_STALE_PERCENTAGE;
  const isUnderMaxTotalDownload = downloadedPhotos.length < MAX_TOTAL_DOWNLOADED;

  return isUnderMaxTotalDownload || pastStalePercentage;
};

export const filterPhotosForSearchTerms = (photos, searchTerms) =>
  photos.filter((photo) => photo.searchTerms === searchTerms);

export const markPhotoAsSeen = (photo: Photo & WithSeenCount) => {
  photo.seenCount = (photo.seenCount || 0) + 1;
  return photo;
};

export const highQualityImageUrlForPhoto = (photo) => photo.url_o;

export function retrieveAllPhotos() {
  return indexStorage.getAll();
}

export function retrievePhoto(photoId) {
  return indexStorage.get(photoId);
}

export function storePhoto(photo) {
  return indexStorage.set(photo.id, photo);
}

export function removePhoto(photo) {
  indexStorage.remove(photo.id);
}
