import Manager from './manager';
import type { Photo, WithOptionalBlob, WithSearchTerms } from './types';

function createPhoto<T>(photoPartial: Partial<Photo> & T): Photo & T {
  const id = photoPartial.id ?? Math.round(Math.random() * 1_000_000).toString();

  return {
    id,
    isBlocked: false,
    url_o: `https://flickr-test-url/download/${id}`,

    ...photoPartial
  };
}

describe('Manager', () => {
  let manager;

  beforeEach(() => {
    manager = new Manager();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('#getDisplayablePhotoCandidates filters photos with blobs', async () => {
    const storedPhotos = [
      createPhoto<WithSearchTerms & WithOptionalBlob>({
        searchTerms: 'New York City',
        blob: new Blob()
      }),
      createPhoto<WithSearchTerms & WithOptionalBlob>({
        searchTerms: 'New York City',
        blob: undefined
      }),
      createPhoto<WithSearchTerms & WithOptionalBlob>({
        searchTerms: 'New York City',
        blob: new Blob()
      })
    ];

    jest.spyOn(manager, 'getSearchTermPhotos').mockResolvedValueOnce(storedPhotos);
    const result = await manager.getDisplayablePhotoCandidates();

    const expectedNumberOfPhotosWithBlobs = 2;
    expect(storedPhotos.filter((photo) => photo.blob).length).toEqual(
      expectedNumberOfPhotosWithBlobs
    );
    expect(result.length).toEqual(expectedNumberOfPhotosWithBlobs);
  });

  test('#getDisplayablePhotoCandidates filters out blocked photos', async () => {
    const storedPhotos = [
      createPhoto<WithSearchTerms & WithOptionalBlob>({
        searchTerms: 'New York City',
        isBlocked: true,
        blob: new Blob()
      }),
      createPhoto<WithSearchTerms & WithOptionalBlob>({
        searchTerms: 'New York City',
        isBlocked: true,
        blob: new Blob()
      }),
      createPhoto<WithSearchTerms & WithOptionalBlob>({
        searchTerms: 'New York City',
        blob: new Blob()
      })
    ];

    jest.spyOn(manager, 'getSearchTermPhotos').mockResolvedValueOnce(storedPhotos);
    const result = await manager.getDisplayablePhotoCandidates();

    const expectedNumberOfBlockedPhotos = 2;
    expect(storedPhotos.filter((photo) => photo.isBlocked).length).toEqual(
      expectedNumberOfBlockedPhotos
    );

    const expectedNumberOfUnblockedPhotos = storedPhotos.length - expectedNumberOfBlockedPhotos;
    expect(result.length).toEqual(expectedNumberOfUnblockedPhotos);
  });

  test('#getDisplayablePhoto fetches photos when no photos are available', async () => {
    jest.spyOn(manager, 'startReplenishBacklog').mockResolvedValue(undefined);

    const mockPhoto = createPhoto<WithSearchTerms & WithOptionalBlob>({
      searchTerms: 'New York City',
      blob: new Blob()
    });
    // mimic an empty photo store with multiple checks, forcing multiple retries,
    // finally resolving with photos
    jest
      .spyOn(manager, 'getSearchTermPhotos')
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValue([mockPhoto]);

    expect(await manager.getDisplayablePhoto()).toEqual(mockPhoto);
    expect(manager.startReplenishBacklog).toHaveBeenCalledTimes(1);

    // retries: +3 empty photo stores, +1 with photos
    // +1 get photos and pick one to display
    expect(manager.getSearchTermPhotos).toHaveBeenCalledTimes(5);
  });
});
