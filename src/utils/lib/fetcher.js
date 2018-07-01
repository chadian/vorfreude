import env from "../../../config/environment";
import { take, clone } from "ramda";
import shuffle from './shuffle';
import { SimpleIndexedDbAdapter } from "./storage";

// `typeof env === 'function'`
// this is an unfortunate hack of this file being used for two builds:
//
// 1. Glimmer App - it resolves the env for correct ember build environment
//
// 2. /chrome build via rollup - the build of background.js via roll up includes
// this file for background fetching. The import of 'env' is then unresolved and
// still a function that requires a string of the environment to retrieve the
// configuration. In this type of build the environment should be assumed to be
// production.
const { IMAGE_ENDPOINT_URL } = typeof env === 'function' ?  env('production') : env;

const highQualityImageUrlForPhoto = photo => photo.url_o;

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

export let replenish = ((outstandingBatches = 0) =>
  async function (searchTerms, downloadBatchSize = 3, maxDownloadBatches = 1) {
    let adjustOutstanding = (adjustment) => (_) => (outstandingBatches = outstandingBatches + adjustment, _);

    let capBatchDownlods = function(_) {
      if (outstandingBatches > maxDownloadBatches) throw 'max batches reached';
      else return _;
    };

    return query(searchTerms)
      .then(adjustOutstanding(1))
      .then(capBatchDownlods)
      .then(shuffle)
      .then(take(downloadBatchSize))
      .then(fetchPhotos)
      .then(photos => photos.forEach(storePhoto))
      .then(adjustOutstanding(-1))
      .catch(adjustOutstanding(-1))
      .then(console.error)
  }
)();

export async function fetchPopularPhotoUrl(searchTerms) {
  let photos = await query(searchTerms)
  let photoUrls = photos.map(highQualityImageUrlForPhoto);

  return take(50, shuffle(photoUrls)).pop();
}
