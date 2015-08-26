import crypto from 'crypto';
import nconf from 'nconf';
import url from 'url';
import _ from 'lodash';
import * as docProcessors from './doc-processors';

var constant_time_compare = function(val1, val2) {
  if (val1.length !== val2.length) {
    return false;
  }
  var sentinel;
  for (var i = 0; i <= (val1.length - 1); i++) {
    sentinel |= val1.charCodeAt(i) ^ val2.charCodeAt(i);
  }
  return sentinel === 0;
};

var decryptAesSha256V2 = function(key, cipher_text) {
  var cipher_blob = cipher_text.split('$'); // version $ cipher_text $ iv $ hmac
  if (cipher_blob.length !== 4) {
    throw new Error('Malformed encrypted blob');
  }

  var ct = cipher_blob[1];
  var iv = new Buffer(cipher_blob[2], 'hex');
  var hmac = cipher_blob[3];

  var chmac = crypto.createHmac('sha256', nconf.get('HMAC_ENCRYPTION_KEY'));
  chmac.update(ct);
  chmac.update(iv.toString('hex'));

  if (!constant_time_compare(chmac.digest('hex'), hmac)) {
    throw new Error('Encrypted Blob has been tampered');
  }

  var key_hash = crypto.createHash('md5').update(key).digest('hex'); // we need a 32-byte key

  try {
    var decryptor = crypto.createDecipheriv('aes-256-cbc', key_hash, iv);
    var decrypted = decryptor.update(ct, 'hex', 'utf8');
    decrypted += decryptor.final('utf8');
    return decrypted;
  } catch (e) {
    throw e;
  }
};

var decryptAesSha256V1 = function(key, cipher_text, ignoreErrorIfTextIsNotEncrypted) {
  try {
    var decryptor = crypto.createDecipher('aes-256-cbc', key);
    var decrypted = decryptor.update(cipher_text, 'hex', 'utf8');
    decrypted += decryptor.final('utf8');
    return decrypted;
  } catch (e) {
    // decryptor will throws TypeError when specified text is not encrypted
    if (e.name !== 'TypeError' || !ignoreErrorIfTextIsNotEncrypted) {
      throw e;
    }
  }

  return cipher_text;
};

export function decryptAesSha256(key, cipher_text, ignoreErrorIfTextIsNotEncrypted) {
  var cipher_blob = cipher_text.split('$'); // version $ cipher_text $ iv $ hmac
  var version = cipher_blob[0];

  switch (version) {
    case '2.0':
      return decryptAesSha256V2(key, cipher_text);
    default:
      return decryptAesSha256V1(key, cipher_text, ignoreErrorIfTextIsNotEncrypted);
  }
}

function getSubdomain(wildcard) {
  if (wildcard.split('.').length < 3) {
    return wildcard;
  }
  var matches = wildcard.match(/^(https?:\/\/)[\w|\*\-]+\.?(.*)/);
  if (matches === null) {
    return wildcard;
  }
  return matches[1] + matches[2];
}

export function equalBaseUrls(url1, url2) {
  if (!url1 || !url2)
    return false;

  if (url1.indexOf('*') > -1 || url2.indexOf('*') > -1) {
    url1 = getSubdomain(url1);
    url2 = getSubdomain(url2);
  }

  var u1 = url.parse(url1);
  var u2 = url.parse(url2);

  return u1.host === u2.host &&
    u1.protocol === u2.protocol;
}

/**
 * Matches an alternative
 * title require(the content
 *
 * @param {String} content
 * @return {String} title
 * @api private
 */

export function alternative_title(content) {
  var regex = /\#{1}[^\n\#]+/g;
  var match = content.match(regex);

  if (match && match.length) match = match[0].slice(1).trim();

  return match || 'Document';
}

/**
 * Prepare resource to be used externally
 *
 * @param {Object} Context
 * @return {Object} data
 * @api private
 */

export function prepareExternalData (context, data) {
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
