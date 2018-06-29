declare const chrome: { runtime };
import { replenish } from "../src/utils/lib/fetcher";

chrome.runtime.onMessage.addListener(function (message, callback) {
  if (message.operation == "replenishBacklog") {
    let { searchTerms, downloadBatchSize } = message;

    return replenish(searchTerms, downloadBatchSize);
  }
});
