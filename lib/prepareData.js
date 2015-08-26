import nconf from 'nconf';
import _ from 'lodash';
import * as docProcessors from './doc-processors';

export default function (context, data) {
  var fixItem = function(item) {
    if (item.url) {
      item.url = nconf.get('DOMAIN_URL_DOCS') + item.url;
    }
    if (item.image && item.image.indexOf('/media') === 0) {
      if (nconf.get('MEDIA_URL')) {
        item.image = nconf.get('MEDIA_URL') + item.image.replace('/media', '');
      } else {
        item.image = nconf.get('DOMAIN_URL_DOCS') + item.image;
      }
    }
    if (item.content && typeof item.content === 'string') {
      item.content = docProcessors.mdProcessor({}, item.content);
      item.content = docProcessors.jsProcessor(context, item.content);
    }
  };

  var prepareItems = function(itemOrItems) {
    if (_.isArray(itemOrItems)) {
      for (var i = 0; i < itemOrItems.length; i++) {
        var item = itemOrItems[i];
        if (item.items) {
          prepareItems(item.items);
        }
        fixItem(item);
      }
    } else {
      fixItem(itemOrItems);
    }
  };

  var clone = _.cloneDeep(data);

  prepareItems(clone.items || clone);
  return clone;
};
