import _ from 'lodash';
import nconf from 'nconf';

export function prepareImage(src) {
  if (src && src.indexOf('/media') === 0) {
    if (nconf.get('MEDIA_URL')) {
      return nconf.get('MEDIA_URL') + src.replace('/media', '');
    } else {
      return nconf.get('DOMAIN_URL_DOCS') + src;
    }
  }

  return src;
}

export function prepareData(context, data) {
  var fixItem = function(item) {
    if (item.url) {
      item.url = nconf.get('DOMAIN_URL_DOCS') + item.url;
    }

    // Clean up the URL for the CDN
    item.image = prepareImage(item.image);

    if (item.content) {
      item.content = item.content(context);
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
}
