import { replenish } from '../src/utils/lib/fetcher';

chrome.runtime.onMessage.addListener(function(message) {
  if (message.operation === 'replenishBacklog') {
    let { searchTerms, downloadBatchSize } = message;

    return replenish(searchTerms, downloadBatchSize);
  }
});

function openVorfreudeTab() {
  let vorfreudeUrl = chrome.extension.getURL('window.html');
  chrome.tabs.create({ url: vorfreudeUrl });
}

chrome.browserAction.onClicked.addListener(() => openVorfreudeTab());
