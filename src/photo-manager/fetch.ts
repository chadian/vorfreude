import { clone } from 'ramda';
import { highQualityImageUrlForPhoto } from './photos';
import resizePhotoBlob from './resizePhoto';
import type { Photo, WithSearchTerms } from './types';

export const IMAGE_ENDPOINT_API_URL = 'https://web-production-be97.up.railway.app/api/images';

export type ImageApiResponse = {
  photos: {
    photo: Photo[]
  }
};

export function fetchPhotosBlobs(photos: Photo[]) {
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
