import _ from 'lodash';
import nconf from 'nconf';
import winston from 'winston';

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
    }

    // Clean up the URL for the CDN
    item.image = prepareImage(item.image);

    if (item.content) {
      try {
        item.content = item.content(context);
      } catch (err) {
        console.log(item);
        winston.error(err);
        err.message = `Error loading document at ${hashPath}: ${err.message}`;
        throw err;
      }

    }
  };

  var prepareItems = function(itemOrItems, hashPath) {
    if (_.isArray(itemOrItems)) {
      for (var i = 0; i < itemOrItems.length; i++) {
        var item = itemOrItems[i];
        if (item.items) {
          prepareItems(item.items, hashPath + '/' + item.hash);
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
