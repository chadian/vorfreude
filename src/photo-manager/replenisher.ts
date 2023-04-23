import { fetchPhotosBlobs, query, resizePhoto } from "./fetch";
import { retrieveAllPhotos as retrieveStoredPhotos, storePhoto } from "./photos";
import shuffle from "./shuffle";
import { take } from 'ramda';

export class Replenisher {
  batchesFetched = 0;
  downloadBatchSize = 2;
  maxBatches = 4;

  searchTerms: string;

  downloadedPhotoIds = [];

  constructor(searchTerms: string) {
    this.searchTerms = searchTerms;
  }

  // made available as a method for easier mocking
  async getStoredPhotos() {
    return retrieveStoredPhotos();
  }

  async fetchBatch() {
    const photoResults = await query(this.searchTerms);
    const storedPhotos = await this.getStoredPhotos();
    const ineligiblePhotoIds = [...storedPhotos.map(photo => photo.id), ...this.downloadedPhotoIds];
    const eligiblePhotos = photoResults.filter(photo => !ineligiblePhotoIds.includes(photo.id));
    const downloadBatch = take(this.downloadBatchSize)(shuffle(eligiblePhotos));
    return fetchPhotosBlobs(downloadBatch);
  }

  async resizeBatch(batch) {
    return Promise.all(batch.map(resizePhoto));
  }

  async storeBatch(batch) {
    batch.forEach(photo => storePhoto(photo));
  }

  async trackBatchPhotos(batch) {
    const photoIds = batch.map(photo => photo.id);
    this.downloadedPhotoIds.push(...photoIds);
  }

  async replenish() {
    try {
      const batch = await this.fetchBatch();
      await this.resizeBatch(batch);
      await this.storeBatch(batch);
    } catch (e) {
      console.error(`Error occurred fetching batch\n: ${e?.message}`);
      console.error(e);
    } finally {
      this.batchesFetched++;
    }

    if (this.batchesFetched < this.maxBatches) {
      await this.replenish();
    }
  }
}
