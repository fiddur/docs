import { parse } from 'url';
import docs from '../../lib/pipeline';

const DocumentService = {};

DocumentService.load = (url, options = {}) => (
  new Promise((resolve, reject) => {
    const normalizedUrl = parse(url).pathname.replace(/^\/docs/, '');
    const doc = docs.getByUrl(normalizedUrl);

    if (!doc) {
      const error = new Error(`No content found at ${normalizedUrl}`);
      error.status = 404;
      return reject(error);
    }

    return resolve({
      html: doc.getContent(),
      meta: doc.toJSON()
    });
  })
);

export default DocumentService;
