import { clone, take } from 'ramda';
import { highQualityImageUrlForPhoto, type Photo, type WithSearchTerms } from './photos';
import resizePhotoBlob from './resizePhoto';
import shuffle from './shuffle';

export const IMAGE_ENDPOINT_API_URL = 'https://vorfreude-elixir.herokuapp.com/api/images';

export type ImageApiResponse = {
  photos: {
    photo: Photo[]
  }
};

export function fetchPhotos(photos: Photo[]) {
  photos = clone(photos);

  return Promise.all(
    photos.map(async (photo: Photo) => {
      const url = highQualityImageUrlForPhoto(photo);
      return fetch(url)
        .then((response) => response?.blob())
        .then((blob) => {
          return {
            ...photo,
            blob
          };
        });
    })
  );
}

export async function resizePhoto(photo) {
  const maxLength = 2600;
  photo.blob = await resizePhotoBlob(photo.blob, maxLength);
  return photo;
}

export async function query(searchTerms): Promise<(Photo & WithSearchTerms)[]> {
  const url = new URL(IMAGE_ENDPOINT_API_URL);
  url.searchParams.append('search', searchTerms);

  const response = await fetch(url.toString());
  const result: ImageApiResponse = await response.json();
  const photos = result.photos.photo;

  return photos
    .filter(highQualityImageUrlForPhoto)
    .map((photo) => {
      return {
        ...photo,
        searchTerms: searchTerms
      };
    });
}

export async function fetchPopularPhotoUrl(searchTerms) {
  const photos = await query(searchTerms);
  const photoUrls = photos.map(highQualityImageUrlForPhoto);

  return take(50, shuffle(photoUrls)).pop();
}
