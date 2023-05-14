import Adapter from './ChromeStorageAdapter';

describe('ChromeStorageAdapter', function () {
  const TEST_STORE_NAME = 'test-store';
  let mockStore;
  let adapter;

  beforeEach(() => {
    window.chrome = (window.chrome ?? {}) as any;

    mockStore = {};
    adapter = new Adapter(TEST_STORE_NAME);

    window.chrome.storage = {
      local: {
        get: jest.fn().mockImplementation(function (_key, cb) {
          cb(mockStore);
        }),

        set: jest.fn().mockImplementation(function (obj, cb) {
          mockStore = {
            ...mockStore,
            ...obj
          };

          cb();
        })
      }
    } as any;
  });

  afterEach(() => {
    // clean up any test storage implementations
    delete window.chrome.storage;
  });

  test('it sets storeName through the constructor', function () {
    expect(adapter.storeName).toEqual(TEST_STORE_NAME);
  });

  test('requesting an invalid key returns null', async function () {
    const result = await adapter.get('this-key-does-not-exist');

    // `get` returns null for non-existent key'
    expect(result).toEqual(null);
  });

  test('adapter get resolves with value', async function () {
    mockStore = { [TEST_STORE_NAME]: { meow: 'hello' } };
    const result = await adapter.get('meow');
    expect(result).toEqual('hello');
  });

  test('adapter set resolves with value', async function () {
    expect(mockStore).toEqual({});
    const result = await adapter.set('meow', 'hello');
    expect(result).toEqual('hello');
    expect(mockStore).toEqual({ [TEST_STORE_NAME]: { meow: 'hello' } });
  });

  test('subsequent set and get with nested object', async function () {
    expect(mockStore).toEqual({});

    const result = await adapter.set('meow', { hello: 'bonjour' });
    expect(result).toEqual({ hello: 'bonjour' });
    expect(mockStore).toEqual({ [TEST_STORE_NAME]: { meow: { hello: 'bonjour' } } });

    expect(await adapter.get('meow')).toEqual({ hello: 'bonjour' });
  });
});
