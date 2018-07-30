import pluralRules from './helper';

const { module, test } = QUnit;

module('Helper: plural-rules', function() {
  test('it computes plural rules for days', function(assert) {
    assert.equal(pluralRules([0, 'days']), 'days');
    assert.equal(pluralRules([1, 'days']), 'day');
    assert.equal(pluralRules([2, 'days']), 'days');
  });
  test('it computes plural rules for hours', function(assert) {
    assert.equal(pluralRules([0, 'hours']), 'hours');
    assert.equal(pluralRules([1, 'hours']), 'hour');
    assert.equal(pluralRules([2, 'hours']), 'hours');
  });
  test('it computes plural rules for minutes', function(assert) {
    assert.equal(pluralRules([0, 'minutes']), 'minutes');
    assert.equal(pluralRules([1, 'minutes']), 'minute');
    assert.equal(pluralRules([2, 'minutes']), 'minutes');
  });
  test('it computes plural rules for seconds', function(assert) {
    assert.equal(pluralRules([0, 'seconds']), 'seconds');
    assert.equal(pluralRules([1, 'seconds']), 'second');
    assert.equal(pluralRules([2, 'seconds']), 'seconds');
  });
});
