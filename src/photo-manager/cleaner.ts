import { storePhoto, retrieveAllPhotos, removePhoto } from "./photos";

export const cleanDownloadFromPhoto = (photo) => {
  photo.blob = null;
  storePhoto(photo);
};

export const cleanPhotosWithoutGivenSearchTerms = async (searchTerms) => {
  const photos = await retrieveAllPhotos();
  const photosToRemove = photos.filter((photo) => photo.searchTerms !== searchTerms);
  photosToRemove.forEach((photo) => removePhoto(photo));
};
