import isTimeUp from './helper';

const { module, test } = QUnit;

module('Helper: is-time-up', function(hooks) {
  test('it computes', function(assert) {
    assert.equal(isTimeUp([]), undefined);
  });
});
