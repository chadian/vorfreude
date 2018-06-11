
import shuffle from "./shuffle";
import {
  storePhoto,
  retrieveAllPhotos,
  fetchPopularPhotoUrl
} from "./fetcher";

export default class Manager {
  async getPhoto(term) {
    let photos = await retrieveAllPhotos();

    let freshPhotos = shuffle(
      photos.filter(photo => photo.seen !== true)
    );

    if (freshPhotos.length > 0) {
      let photo = freshPhotos.pop();
      this.markPhotoAsSeen(photo);

      return URL.createObjectURL(photo.blob);
    } else {
      return fetchPopularPhotoUrl(term);
    }
  }

  markPhotoAsSeen(photo) {
    photo.seen = true;
    storePhoto(photo);
  }
}
