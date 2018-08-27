import { take, clone } from 'ramda';
import shuffle from './shuffle';
import { SimpleIndexedDbAdapter } from "./storage/SimpleIndexedDbAdapter";
import {
  filterForDownloadedPhotos,
  highQualityImageUrlForPhoto
} from "./photos";

const IMAGE_ENDPOINT_URL = 'https://vorfreude.now.sh/';

let indexStorage = new SimpleIndexedDbAdapter('VORFREUDE_PHOTO_STORAGE');

export function fetchPhotos(photos) {
  photos = clone(photos);

  return Promise.all(
    photos.map(photo => {
      let url = highQualityImageUrlForPhoto(photo);
      return fetch(url)
        .then(response => response.blob && response.blob())
        .then(blob => ((photo.blob = blob), photo));
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

export async function query(searchTerms) {
  var url = new URL(IMAGE_ENDPOINT_URL);
  url.searchParams.append('searchTerms', searchTerms);

  let result = await window.fetch(url);
  let photos = (await result.json()).photos.photo;

  return photos
    .filter(highQualityImageUrlForPhoto)
    .map(photo => (photo.searchTerms = searchTerms, photo));
};

export async function filterOutAlreadyDownloadedPhotos(freshPhotos, sourcePhotos) {
  let alreadyDownloadedPhotoIds = filterForDownloadedPhotos(sourcePhotos).map(photo => photo.id);

  return freshPhotos.filter(photo => !alreadyDownloadedPhotoIds.includes(photo.id));
}

export let replenish = ((outstandingBatches = 0) =>
  async function innerReplenish(searchTerms, downloadBatchSize = 3, maxDownloadBatches = 1) {
    let adjustOutstanding = (adjustment) => (_) => (outstandingBatches = outstandingBatches + adjustment, _);

    let capBatchDownlods = _ => {
      if (outstandingBatches > maxDownloadBatches) throw `max batches of ${maxDownloadBatches} reached`;
      else return _;
    };

    return query(searchTerms)
      .then(adjustOutstanding(1))
      .then(capBatchDownlods)
      .then(async photos =>
        filterOutAlreadyDownloadedPhotos(photos, await retrieveAllPhotos())
      )
      .then(shuffle)
      .then(take(downloadBatchSize))
      .then(fetchPhotos)
      .then(photos => photos.forEach(storePhoto) || photos)
      .then(adjustOutstanding(-1))
      .catch(e => adjustOutstanding(-1) || console.error(e));
  }
)();

export async function fetchPopularPhotoUrl(searchTerms) {
  let photos = await query(searchTerms)
  let photoUrls = photos.map(highQualityImageUrlForPhoto);

  return take(50, shuffle(photoUrls)).pop();
}
