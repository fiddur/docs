import _ from 'lodash';
import { parse } from 'url';
import { docsByUrl, docUrls } from '../../lib/docs/builder';
import { renderContent } from '../../lib/docs/renderer'

export default function(req, res) {

  let ContentService = {};

  ContentService.load = (id) => {
    return new Promise((resolve, reject) => {

      let url = parse(req.url).pathname.replace(/^\/docs/, '');
      let doc = docsByUrl[url];

      if (!doc) {
        var error = new Error('No content found at ' + req.url);
        error.status = 404;
        return reject(error);
      }

      let context = _.clone(res.locals);
      let content = renderContent(doc, context, true /* absolute links */);

      return resolve(content);

    });
  };

  return ContentService;
}
