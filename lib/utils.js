import nconf from 'nconf';
import url from 'url';
import path from 'path';
import fs from 'fs';

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
