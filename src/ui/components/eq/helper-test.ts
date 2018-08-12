import eq from './helper';

const { module, test } = QUnit;

module('Helper: eq', function(hooks) {
  test('it works with undefined', function(assert) {
    assert.equal(eq([undefined, undefined]), true);
  });

  test('it strict equals falsy values, null against undefined', function(assert) {
    assert.equal(eq([undefined, null]), false);
  });
});
