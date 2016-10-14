import _ from 'lodash';
import nconf from 'nconf';
import { logger } from '../logs';

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

export function prepareData(context, data, hashPath) {
  var fixItem = function(item, hashPath) {
    if (item.url) {
      item.url = nconf.get('DOMAIN_URL_DOCS') + item.url;
      // HACK: The collections and the navigation items are inconsistent
      // in how they format urls. SOme start with /docs others dont.
      // Eventually should be unified to always include /docs/
      item.url = item.url.replace('/docs/docs/', '/docs/');
    }

    // Clean up the URL for the CDN
    if (item.image) {
      item.image = prepareImage(item.image);
    }

    if (item.content) {
      try {
        item.content = item.content(context);
      } catch (err) {
        console.log(item);
        logger.error(err);
        err.message = `Error loading document at ${hashPath}: ${err.message}`;
        throw err;
      }

    }
  };

  var prepareItems = function(itemOrItems, hashPath) {
    if (_.isArray(itemOrItems)) {
      for (var i = 0; i < itemOrItems.length; i++) {
        var item = itemOrItems[i];
        // HACK: Different collections have differnt names for children
        var items = item.items || item.articles;
        if (items) {
          prepareItems(items, hashPath + '/' + item.hash);
        }
        fixItem(item, hashPath + '/' + item.hash);
      }
    } else {
      fixItem(itemOrItems, hashPath);
    }
  };

  var clone = _.cloneDeep(data);
  prepareItems(clone.items || clone, '/' + hashPath);
  return clone;
}
