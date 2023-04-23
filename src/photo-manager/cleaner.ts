import { storePhoto, retrieveAllPhotos, removePhoto, filterBlockedPhotos } from "./photos";

export const cleanDownloadFromPhoto = (photo) => {
  photo.blob = null;
  storePhoto(photo);
};

export const cleanUnblockedPhotosWithoutGivenSearchTerms = async (searchTerms) => {
  const photos = await retrieveAllPhotos();
  const photosToKeep = filterBlockedPhotos(photos);
  const photosToRemove = photos.filter((photo) => photo.searchTerms !== searchTerms && !photosToKeep.includes(photo));
  
  photosToRemove.forEach((photo) => removePhoto(photo));
};
