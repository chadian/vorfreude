import { Replenisher } from './replenisher';
import { IMAGE_ENDPOINT_API_URL, type ImageApiResponse } from './fetch';

function calcFetchCount(batchCount, batchSize) {
  const apiServerCalls = 1 * batchCount;
  const photoDownloads = batchCount * batchSize;
  return apiServerCalls + photoDownloads;
}

describe('Replenisher', () => {
  let replenisher: Replenisher;
  let storedPhotosSpy;
  let resizeBatchSpy;
  let storeBatchSpy;
  let fetchSpy;

  const TEST_DOWNLOAD_BATCH_SIZE = 2;
  const TEST_MAX_BATCHES = 2;

  const apiResponse: ImageApiResponse = {
    photos: {
      photo: [
        {
          id: 'abc',
          url_o: 'http://images/abc.jpg'
        },
        {
          id: 'def',
          url_o: 'http://images/def.jpg'
        },
        {
          id: 'ghi',
          url_o: 'http://images/ghi.jpg'
        },
        {
          id: 'jkl',
          url_o: 'http://images/jkl.jpg'
        },
        {
          id: 'mno',
          url_o: 'http://images/mno.jpg'
        },
        {
          id: 'qrs',
          url_o: 'http://images/qrs.jpg'
        }
      ]
    }
  };

  beforeEach(function mockGlobalFetch() {
    fetchSpy = globalThis.fetch = jest.fn((async (url) => {
      if (url.includes(IMAGE_ENDPOINT_API_URL)) {
        return {
          async json() {
            return apiResponse;
          }
        };
      }

      else if (url.includes('http://images/')) {
        return {
          async blob() {
            return new Blob();
          }
        }
      }

      throw new Error(`No matching url found for ${url} to mock`);
    }) as any);
  });

  beforeEach(async function setupReplenisher() {
    const searchTerms = 'super awesome photo search';
    replenisher = new Replenisher(searchTerms);
    replenisher.downloadBatchSize = TEST_DOWNLOAD_BATCH_SIZE;
    replenisher.maxBatches = TEST_MAX_BATCHES;
    storedPhotosSpy = jest.spyOn(replenisher, 'getStoredPhotos');
    storedPhotosSpy.mockReturnValue([]);

    // the blob is not a real image blob so nothing to resize,
    // skip this step
    resizeBatchSpy = jest.spyOn(replenisher, 'resizeBatch').mockImplementation(async (batch) => batch);

    // don't have an implementation of IndexedDB for this test,
    // skip this step
    storeBatchSpy = jest.spyOn(replenisher, 'storeBatch').mockImplementation(async (batch) => batch);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  })

  test('#fetchBatch', async () => {
    const batch = await replenisher.fetchBatch();

    expect(fetchSpy).toHaveBeenCalledTimes(calcFetchCount(1, TEST_DOWNLOAD_BATCH_SIZE));
    expect(fetchSpy).toBeCalledWith(expect.stringContaining(IMAGE_ENDPOINT_API_URL));

    batch.forEach(photo => {
      const matchingApiPhoto = apiResponse.photos.photo.find(p => p.id === photo.id);
      expect(photo.id).toEqual(matchingApiPhoto.id);
      expect(photo.url_o).toEqual(matchingApiPhoto.url_o);
      expect(photo.blob).toBeInstanceOf(Blob);
    });
  });

  test('#fetchBatch to ignore already downloaded images', async () => {
    const allPhotoIds = apiResponse.photos.photo.map(({id}) => id);
    const remainingPhotoId = allPhotoIds.pop();

    // due to shuffling downloads and picking random photos
    // this test marks all photos as downloaded except one
    // leaving this to be the only photo that could be chosen
    replenisher.downloadedPhotoIds = allPhotoIds;

    const batch = await replenisher.fetchBatch();
    expect(batch).toHaveLength(1);

    const [photo] = batch;
    expect(photo.id).toEqual(remainingPhotoId);
  });

  test('#replenish', async () => {
    const fetchBatchSpy = jest.spyOn(replenisher, 'fetchBatch');
    await replenisher.replenish();
    expect(fetchBatchSpy).toBeCalledTimes(TEST_MAX_BATCHES);
    expect(resizeBatchSpy).toBeCalled();
    expect(storeBatchSpy).toBeCalled();
  });
});
