import Flickr from "flickr-sdk/flickr-sdk";
import env from "../../../config/environment";
import { take, clone } from "ramda";
import shuffle from './shuffle';
import { SimpleIndexedDbAdapter } from "./storage";

const flickr = new Flickr(env.FLICKR_API_KEY);

const highQualityImageUrlForPhoto = photo => photo.url_o || photo.url_l;
let indexStorage = new SimpleIndexedDbAdapter('VORFREUDE_PHOTO_STORAGE');

export function fetchPhotos(photos) {
  photos = clone(photos);

  return Promise.all(
    photos.map(photo => {
      let url = highQualityImageUrlForPhoto(photo);
      return fetch(url)
        .then(response => response.blob())
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
  let result = await flickr.photos.search({
    safe_search: "1",
    text: searchTerms,
    privacy_filter: "1",
    sort: "interestingness-desc",
    per_page: "500",
    extras: "url_o"
  });

  let photos = result.body.photos.photo || [];
  return photos
    .filter(highQualityImageUrlForPhoto)
    .map(photo => (photo.searchTerms = searchTerms, photo));
};

export async function fetchPopularPhotoUrl(searchTerm) {
  let photos = await query(searchTerm)
  let photoUrls = photos.map(highQualityImageUrlForPhoto);

  return take(50, shuffle(photoUrls)).pop();
}
