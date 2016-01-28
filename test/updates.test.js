var assert = require('assert');
import contentUpdates from '../lib/updates/updates';


describe('Updates', function() {
  it('are in a valid format.', function() {
    var testItems = function(items) {
      items = items || [];
      items.map(function (item) {
        assert.notEqual(item.title.length, 0, 'Invalid item name.');
        assert.notEqual(item.tags.length, 0, 'No tags present on item.');
        assert.notEqual(item.description.length, 0, 'No description present on item.');
      });
    };
    contentUpdates.map(function(update) {
      assert.notEqual(update.title.length, 0, 'Invalid update title.');
      assert.notEqual(update.date, undefined, 'Invalid update date.');
      testItems(update.added);
      testItems(update.fixed);
      testItems(update.changed);
    });
  });
});
