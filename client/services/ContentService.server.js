import _ from 'lodash';
import { parse } from 'url';
import docs from '../../lib/pipeline';

export default function createContentService(req, res) {
  const ContentService = {};

  ContentService.load = (id) => (
    new Promise((resolve, reject) => {
      const url = parse(req.url).pathname.replace(/^\/docs/, '');
      const doc = docs.getByUrl(url);

      if (!doc) {
        const error = new Error(`No content found at ${req.url}`);
        error.status = 404;
        return reject(error);
      }

      const result = {
        html: doc.render(),
        meta: doc.toJSON()
      };

      return resolve(result);
    })
  );

  return ContentService;
}
