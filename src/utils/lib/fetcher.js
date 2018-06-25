import env from "../../../config/environment";
import { take, clone } from "ramda";
import shuffle from './shuffle';
import { SimpleIndexedDbAdapter } from "./storage";

const { IMAGE_ENDPOINT_URL } = env;
const highQualityImageUrlForPhoto = photo => photo.url_o || photo.url_l;
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

export async function fetchPopularPhotoUrl(searchTerm) {
  let photos = await query(searchTerm)
  let photoUrls = photos.map(highQualityImageUrlForPhoto);

  return take(50, shuffle(photoUrls)).pop();
}
