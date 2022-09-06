import { removePhoto, retrieveAllPhotos, storePhoto } from './fetcher';

export let cleanDownloadFromPhoto = (photo) => {
  photo.blob = null;
  storePhoto(photo);
};

export let cleanPhotosWithoutGivenSearchTerms = async (searchTerms) => {
  let photos = await retrieveAllPhotos();
  let photosToRemove = photos.filter((photo) => photo.searchTerms !== searchTerms);
  photosToRemove.forEach((photo) => removePhoto(photo));
};
