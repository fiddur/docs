import url from 'url';
import { find } from 'lodash';
import pathToRegexp from 'path-to-regexp';
import docs from '../pipeline';
import appTypes from '../data/app-types';

// This middleware ensures that we don't render quickstarts at the non /quickstarts
// path, except for embedded or other API type calls. It also handles redirects from
// old formats of the quickstart article URLs.

// DONT MESS WITH THIS UNLESS YOU KNOW WHAT YOU ARE DOING. YOU WILL BREAK THINGS.

const appTypesMap = {};
appTypes.forEach(appType => {
  appTypesMap[appType.slug] = appType;
});

export default function redirectQuickstarts(req, res, next) {
  const keys = [];
  const re = pathToRegexp('/docs/:appType/:platform/:article?', keys);
  const parsedUrl = url.parse(req.url);
  const tokens = re.exec(parsedUrl.pathname);

  // If the URL doesn't match, ignore the request.
  if (!tokens) return next();

  // If this is an embedded mode request, ignore the request.
  if (res.locals.embedded) return next();

  const appTypeSlug = tokens[1];
  const platformName = tokens[2];
  const articleName = tokens[3];

  const appType = appTypesMap[appTypeSlug];

  // If the app type slug doesn't match an app type, ignore the request.
  if (!appType) return next();

  // If there's an article name, we never supported this format of URL, so return 404.
  if (articleName) {
    const err = new Error('Not found.');
    err.statusCode = 404;
    return err;
  }

  // Permanent redirect to the correct location.
  res.redirect(`/docs/quickstart/${appType.name}/${platformName}`, 301);
}
