import { BackgroundOperation } from '../background-operation';
import isExtensionEnv from '../helpers/isExtensionEnv';
import { Replenisher } from '../photo-manager/replenisher'

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
