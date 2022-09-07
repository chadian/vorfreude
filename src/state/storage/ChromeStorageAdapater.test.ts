import Adapter from './ChromeStorageAdapter';

describe('ChromeStorageAdapter', function () {
  beforeEach(() => {
    window.chrome = (window.chrome ?? {}) as any;
  });

  test('it sets storeName through the constructor', function () {
    const adapter = new Adapter('test-store-name');
    expect(adapter.storeName).toEqual('test-store-name');
  });

  test('requesting an invalid key returns null', async function () {
    window.chrome.storage = {
      local: {
        get(key, cb) {
          // requests for store
          expect(key).toEqual('test-store-name');

          // return empty store for 'test-store-name'
          cb({});
        }
      }
    } as any;

    const adapter = new Adapter('test-store-name');
    const result = await adapter.get('this-key-does-not-exist');

    // `get` returns null for non-existent key'
    expect(result).toEqual(null);

    // clean up
    delete window.chrome.storage;
  });

  test('promise resolves with set value', async function () {
    window.chrome.storage = {
      local: {
        // mock `get` that is used to get the store
        // before set is called with new setted value
        get(_, cb) {
          const emptyStore = {};
          cb(emptyStore);
        },

        set(obj, cb) {
          // requests for store
          expect(obj).toEqual({ 'test-store-name': { meow: 'hello' } });

          // call callback that should trigger promise resolution
          cb();
        }
      }
    } as any;

    const adapter = new Adapter('test-store-name');
    const result = await adapter.set('meow', 'hello');
    expect(result).toEqual('hello');

    // clean up
    delete window.chrome.storage;
  });
});
