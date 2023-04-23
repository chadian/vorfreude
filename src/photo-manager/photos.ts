import { photoStorage } from "../state/storage/photo";
import type { Photo, WithBlob, WithSearchTerms, WithSeenCount } from "./types";

const STALE_SEEN_COUNT = 3;
const MINIMINUM_FRESH_PERCENTAGE = 25;
const MAX_TOTAL_DOWNLOADED = 20;

export function photoHasDownload<T>(photo: T): photo is T & WithBlob {
  if (typeof photo === 'object' && photo && 'blob' in photo && photo.blob instanceof Blob) {
    return true;
  }

  return false;
}

// export const photoHasDownload = (photo: T)<T>: photo is T & WithBlob  => Boolean(photo?.blob);
export const isPhotoStale = (photo: Photo & WithBlob & WithSeenCount) => photo.blob && photo.seenCount > STALE_SEEN_COUNT;

export const shouldDownloadPhotos = (photos) => {
  const downloadedPhotos = photos.filter(photoHasDownload);
  const stalePhotos = photos.filter(isPhotoStale);
  const blockedPhotos = filterBlockedPhotos(photos);

  const freshPercentage =
    100 * (downloadedPhotos.length - blockedPhotos.length - stalePhotos.length) / downloadedPhotos.length;

  const needsFreshPhotos = freshPercentage < MINIMINUM_FRESH_PERCENTAGE;
  const isUnderMaxTotalDownload = downloadedPhotos.length < MAX_TOTAL_DOWNLOADED;

  return needsFreshPhotos || isUnderMaxTotalDownload;
};

export const filterPhotosForSearchTerms = (photos: (Photo & WithSearchTerms)[], searchTerms: string) => {
  return photos.filter((photo) => photo.searchTerms === searchTerms);
}

export const markPhotoAsSeen = (photo: Photo & WithSeenCount) => {
  photo.seenCount = (photo.seenCount || 0) + 1;
  return photo;
};

export function filterBlockedPhotos<T extends Photo>(photos: T[]) {
  return photos.filter((photo) => !photo.isBlocked);
}

export const markPhotoAsBlocked = (photo: Photo) => {
  photo.isBlocked = true;
  return photo;
}

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
