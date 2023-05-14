import { storePhoto, retrieveAllPhotos, removePhoto, photoIsBlocked } from './photos';

export const cleanDownloadFromPhoto = (photo) => {
  photo.blob = null;
  storePhoto(photo);
};

export const cleanUnblockedPhotosWithoutGivenSearchTerms = async (searchTerms) => {
  const photos = await retrieveAllPhotos();
  const photosToKeep = photos.filter(photoIsBlocked);
  const photosToRemove = photos.filter(
    (photo) => photo.searchTerms !== searchTerms && !photosToKeep.includes(photo)
  );

  photosToRemove.forEach((photo) => removePhoto(photo));
};
