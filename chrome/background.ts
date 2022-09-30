import { Replenisher } from '../src/photo-manager/replenisher'

chrome.runtime.onMessage.addListener(function(message) {
  if (message.operation === 'replenishBacklog') {
    const { searchTerms, downloadBatchSize } = message;

    const replenisher = new Replenisher(searchTerms);
    replenisher.downloadBatchSize = downloadBatchSize;
    replenisher.replenish();
  }
});

function openVorfreudeTab() {
  const vorfreudeUrl = chrome.extension.getURL('index.html');
  chrome.tabs.create({ url: vorfreudeUrl });
}

chrome.browserAction.onClicked.addListener(() => openVorfreudeTab());
