import { clone, take } from 'ramda';
import { SimpleIndexedDbAdapter } from '../state/storage/SimpleIndexedDbAdapter';
import { filterForPreviousDownloadedPhotos, highQualityImageUrlForPhoto } from './photos';
import resizePhotoBlob from './resizePhoto';
import shuffle from './shuffle';

const IMAGE_ENDPOINT_URL = 'https://vorfreude-elixir.herokuapp.com/api/images';

const indexStorage = new SimpleIndexedDbAdapter('VORFREUDE_PHOTO_STORAGE');

export function fetchPhotos(photos) {
  photos = clone(photos);

  return Promise.all(
    photos.map((photo) => {
      const url = highQualityImageUrlForPhoto(photo);
      return fetch(url)
        .then((response) => response.blob && response.blob())
        .then((blob) => ((photo.blob = blob), photo));
    })
  );
}

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

export async function resizePhoto(photo) {
  photo.blob = await resizePhotoBlob(photo.blob, 2600);
  return photo;
}

export async function query(searchTerms) {
  const url = new URL(IMAGE_ENDPOINT_URL);
  url.searchParams.append('search', searchTerms);

  const result = await window.fetch(url.toString());
  const photos = (await result.json()).photos.photo;

  return photos
    .filter(highQualityImageUrlForPhoto)
    .map((photo) => ((photo.searchTerms = searchTerms), photo));
}

export async function filterOutPreviouslyDownloadedPhotos(freshPhotos, sourcePhotos) {
  const previouslyDownloadedPhotos = filterForPreviousDownloadedPhotos(sourcePhotos).map(
    (photo) => photo.id
  );

  return freshPhotos.filter((photo) => !previouslyDownloadedPhotos.includes(photo.id));
}

export const replenish = ((outstandingBatches = 0) =>
  async function innerReplenish(searchTerms, downloadBatchSize = 3, maxDownloadBatches = 1) {
    const adjustOutstanding = (adjustment) => (_) => (
      (outstandingBatches = outstandingBatches + adjustment), _
    );

    const capBatchDownlods = (_) => {
      if (outstandingBatches > maxDownloadBatches) {
        throw new Error(`max batches of ${maxDownloadBatches} reached`);
      } else {
        return _;
      }
    };

    return query(searchTerms)
      .then(adjustOutstanding(1))
      .then(capBatchDownlods)
      .then(async (photos) =>
        filterOutPreviouslyDownloadedPhotos(photos, await retrieveAllPhotos())
      )
      .then(shuffle)
      .then(take(downloadBatchSize))
      .then(fetchPhotos)
      .then((photos) => Promise.all(photos.map(resizePhoto)))
      .then((photos) => (photos.forEach(storePhoto), photos))
      .then(adjustOutstanding(-1))
      .catch(() => adjustOutstanding(-1));
  })();

export async function fetchPopularPhotoUrl(searchTerms) {
  const photos = await query(searchTerms);
  const photoUrls = photos.map(highQualityImageUrlForPhoto);

  return take(50, shuffle(photoUrls)).pop();
}
