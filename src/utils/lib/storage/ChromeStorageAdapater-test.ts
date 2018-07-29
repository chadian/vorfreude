const { module, test } = QUnit;
import Adapter from './ChromeStorageAdapter';

module('ChromeStorageAdapter', function(hooks) {
  test('it sets storeName through the constructor', function(assert) {
    let adapter = new Adapter('test-store-name');
    assert.equal(
      adapter.storeName,
      'test-store-name',
      'store name set through constructor is accessible through public property'
    );
  });

  test('requesting an invalid key returns null', async function(assert) {
    chrome.storage = {
      local: {
        get(key, cb) {
          // requests for store
          assert.equal(key, 'test-store-name');

          // return empty store for 'test-store-name'
          cb({});
        }
      }
    };

    let adapter = new Adapter('test-store-name');
    let result = await adapter.get('this-key-does-not-exist');
    assert.deepEqual(result, undefined, '`get` returns null for non-existent key');

    // clean up
    delete chrome.storage;
  });
});
