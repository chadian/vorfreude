import { replenish } from '../src/photo-manager/fetcher';

chrome.runtime.onMessage.addListener(function(message) {
  if (message.operation === 'replenishBacklog') {
    const { searchTerms, downloadBatchSize } = message;

    return replenish(searchTerms, downloadBatchSize);
  }
});

function openVorfreudeTab() {
  const vorfreudeUrl = chrome.extension.getURL('window.html');
  chrome.tabs.create({ url: vorfreudeUrl });
}

chrome.browserAction.onClicked.addListener(() => openVorfreudeTab());
