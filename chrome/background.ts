import { replenish } from '../src/utils/lib/fetcher';

chrome.runtime.onMessage.addListener(function (message, callback) {
  if (message.operation == 'replenishBacklog') {
    let { searchTerms, downloadBatchSize } = message;

    return replenish(searchTerms);
  }
});

function openVorfreudeTab() {
    let vorfreudeUrl = chrome.extension.getURL('window.html');
    chrome.tabs.create({ url: vorfreudeUrl });
}

chrome.browserAction.onClicked.addListener(() => openVorfreudeTab());
