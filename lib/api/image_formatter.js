import nconf from 'nconf';

function prepareImage(src) {
  if (src && src.indexOf('/media') === 0) {
    if (nconf.get('MEDIA_URL')) {
      return nconf.get('MEDIA_URL') + src.replace('/media', '');
    } else {
      return nconf.get('DOMAIN_URL_DOCS') + src;
    }
  }

  return src;
}

export default prepareImage;
