import { storePhoto } from './fetcher';

export let cleanDownloadFromPhoto = (photo) => {
  photo.blob = null;
  storePhoto(photo);
};
