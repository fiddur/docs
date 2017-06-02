import { parse } from 'url';
import docs from '../../lib/pipeline';

const DocumentService = {};

DocumentService.load = (url, options = {}) => (
  new Promise((resolve, reject) => {
    const normalizedUrl = parse(url).pathname.replace(/^\/docs/, '');
    const doc = docs.tryGetByUrl(normalizedUrl);

    if (!doc) {
      const error = new Error(`No document found at ${normalizedUrl}`);
      error.statusCode = 404;
      return reject(error);
    }

    return resolve({
      html: doc.getContent(),
      meta: doc.toJSON()
    });
  })
);

export default DocumentService;