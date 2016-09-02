import nconf from 'nconf';

/**
 * Media path processor
 *
 * @param {String} text
 * @return {String} Processed text
 * @api public
 */
function mediaPath(text) {
  if (nconf.get('MEDIA_URL')) {
    return text.replace(/src="\/media\//g, 'src="' + nconf.get('MEDIA_URL') + '/');
  } else {
    return text.replace(/src="\/media\//g, 'src="/docs/media/');
  }
}

export default function compiler(options) {
  return mediaPath;
}
