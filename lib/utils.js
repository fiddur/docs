import crypto from 'crypto';
import nconf from 'nconf';
import url from 'url';
import path from 'path';
import fs from 'fs';


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

var assetsByChunkName;
const assetsFilePath = path.join(__dirname, '../public/js/assets.json');
if (fs.existsSync(assetsFilePath)) {
  assetsByChunkName = JSON.parse(fs.readFileSync(assetsFilePath));
}

export function getAssetBundleUrl(bundleName, fileExtension) {

  // Default value is js
  fileExtension = fileExtension || 'js';

  if (assetsByChunkName) {
    if (!assetsByChunkName[bundleName]) {
      throw new Error('Invalid chunk name');
    }

    var index = 0;
    if (fileExtension === 'css') {
      index = 1;
    }

    let fileName = assetsByChunkName[bundleName];
    if (Array.isArray(fileName)) {
      fileName = fileName[index];
    }
    if (nconf.get('ASSET_URL')) {
      return `${nconf.get('ASSET_URL')}/js/${fileName}`;
    } else {
      return `/docs/js/${fileName}`;
    }
  } else if (fileExtension === 'css') {
    // CSS files aren't extracted seperately in developement.
    return false;
  } else {
    return `/docs/js/${bundleName}.bundle.${fileExtension}`;
  }
}
