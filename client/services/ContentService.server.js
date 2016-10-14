import _ from 'lodash';
import { parse } from 'url';
import { docsByUrl, docUrls } from '../../lib/docs/builder';
import { renderContent } from '../../lib/docs/renderer'

export default function(req, res) {

  let ContentService = {};

  ContentService.load = (id) => {
    return new Promise((resolve, reject) => {

      const url = parse(req.url).pathname.replace(/^\/docs/, '');
      const doc = docsByUrl[url];

      if (!doc) {
        const error = new Error('No content found at ' + req.url);
        error.status = 404;
        return reject(error);
      }

      const context = _.clone(res.locals);
      const html = renderContent(doc, context, true /* absolute links */);
      const result = {
        html,
        meta: _.clone(doc.meta)
      };

      return resolve(result);
    });
  };

  return ContentService;
}
