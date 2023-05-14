import { photoStorage } from '../state/storage/photo';
import type { Photo, WithOptionalBlob, WithSearchTerms, WithSeenCount } from './types';

const STALE_SEEN_COUNT = 3;
const MAX_TOTAL_DOWNLOADED = 20;
const MIN_FRESH_PERCENTAGE = 25;

export function photoHasDownload<T>(photo: T): photo is T & WithOptionalBlob {
  if (typeof photo === 'object' && 'blob' in photo) {
    return photo.blob instanceof Blob;
  }

  return false;
}

export const isPhotoStale = (photo: Photo & WithOptionalBlob & WithSeenCount) =>
  photo.blob && photo.seenCount > STALE_SEEN_COUNT;
export const photoIsBlocked = (photo: Photo) => Boolean(photo.isBlocked);

export const shouldDownloadPhotos = (photos) => {
  const downloadedPhotos = photos.filter(photoHasDownload);
  const stalePhotos = photos.filter(isPhotoStale);
  const blockedPhotos = photos.filter(photoIsBlocked);

  const freshPercentage =
    100 *
    ((downloadedPhotos.length - blockedPhotos.length - stalePhotos.length) /
      downloadedPhotos.length);

  const needsFreshPhotos = freshPercentage < MIN_FRESH_PERCENTAGE;
  const isUnderMaxTotalDownload = downloadedPhotos.length < MAX_TOTAL_DOWNLOADED;

  return needsFreshPhotos || isUnderMaxTotalDownload;
};

export const filterPhotosForSearchTerms = (
  photos: (Photo & WithSearchTerms)[],
  searchTerms: string
) => {
  return photos.filter((photo) => photo.searchTerms === searchTerms);
};

export const markPhotoAsSeen = (photo: Photo & WithSeenCount) => {
  photo.seenCount = (photo.seenCount || 0) + 1;
  return photo;
};

export const markPhotoAsBlocked = (photo: Photo) => {
  photo.isBlocked = true;
  return photo;
};

export const highQualityImageUrlForPhoto = (photo) => photo.url_o;

export function retrieveAllPhotos(): Promise<(Photo & WithSearchTerms)[]> {
  return photoStorage.getAll();
}

export function retrievePhoto(photoId) {
  return photoStorage.get(photoId);
}

export function storePhoto(photo) {
  return photoStorage.set(photo.id, photo);
}

export function removePhoto(photo) {
  photoStorage.remove(photo.id);
}
