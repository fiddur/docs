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

  // No url match, return
  if (!tokens) return next();

  const [appTypeSlug, platformName, articleName] = tokens;
  const appType = appTypesMap[appTypeSlug];

  // Not app type path, return
  if (!appType) return next();

  const get404 = () => {
    const err = new Error('Not found.');
    err.status = 404;
    return err;
  };

  const isExternalFormat = res.locals.embedded;

  if (!isExternalFormat && articleName) {
    // We never seved URLs in this format so we just 404
    next(get404());
  } else if (isExternalFormat && !articleName) {
    const quickstarts = docs.getReduction('quickstarts');
    // This is to redirect backward compat external format requests (used by manage)
    const platform = find(quickstarts[appType.name], { name: platformName });
    if (platform) {
      const article = find(platform.articles, { number: 1 });
      if (article) {
        res.redirect(`/docs/${appType.slug}/${platformName}/${article.name}?${parsedUrl.query}`, 302);
      } else {
        next(get404());
      }
    } else {
      next(get404());
    }
  } else if (!isExternalFormat) {
    // This is for backward compat of old URL format
    res.redirect(`/docs/quickstart/${appType.name}/${platformName}`, 301);
  } else {
    next();
  }
}
