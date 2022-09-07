const STALE_SEEN_COUNT = 2;
const ALLOWABLE_STALE_PERCENTAGE = 85;
const TOTAL_DOWNLOADED = 20;

export let filterForDownloadedPhotos = (photos) => photos.filter((photo) => Boolean(photo.blob));

export let filterForPreviousDownloadedPhotos = (photos) =>
  photos.filter((photo) => 'blob' in photo);

export let filterStalePhotos = (photos) =>
  photos.filter((photo) => photo.blob && photo.seenCount > STALE_SEEN_COUNT);

export let shouldDownloadPhotos = (photos) => {
  let stalePercentage =
    100 * (filterStalePhotos(photos).length / filterForDownloadedPhotos(photos).length);
  let pastStalePercentage = stalePercentage > ALLOWABLE_STALE_PERCENTAGE;
  let isUnderTotalDownload = filterForDownloadedPhotos(photos).length <= TOTAL_DOWNLOADED;

  return isUnderTotalDownload || pastStalePercentage;
};

export let filterPhotosForSearchTerms = (photos, searchTerms) =>
  photos.filter((photo) => photo.searchTerms === searchTerms);

export let markPhotoAsSeen = (photo) => {
  photo.seenCount = photo.seenCount ? photo.seenCount + 1 : 1;
  return photo;
};

export let highQualityImageUrlForPhoto = (photo) => photo.url_o;
