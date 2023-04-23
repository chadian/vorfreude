import isExtensionEnv from '../helpers/isExtensionEnv';
import { Replenisher } from '../photo-manager/replenisher'

export const BackgroundOperation = {
  REPLENISH_BACKLOG: 'replenishBacklog',
};

function openVorfreudeTab() {
  const vorfreudeUrl = chrome.extension.getURL('index.html');
  chrome.tabs.create({ url: vorfreudeUrl });
}

if (isExtensionEnv()) {
  chrome.runtime.onMessage.addListener(function(message) {
    if (message.operation === BackgroundOperation.REPLENISH_BACKLOG) {
      const { searchTerms, downloadBatchSize } = message;
      const replenisher = new Replenisher(searchTerms);
      replenisher.downloadBatchSize = downloadBatchSize;
      replenisher.replenish();
    }
  });
  
  chrome.browserAction.onClicked.addListener(() => openVorfreudeTab());
}
