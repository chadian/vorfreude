import { take, clone } from "ramda";
import shuffle from './shuffle';
import { SimpleIndexedDbAdapter } from "./storage";

const IMAGE_ENDPOINT_URL = 'https://vorfreude.now.sh/';

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
