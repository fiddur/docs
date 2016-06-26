import url from 'url';
import quickstarts from '../data/quickstarts';
import platforms from '../data/platforms';
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';

// This middleware ensures that we don't render quickstarts at the non /quickstarts
// path, except for embedded or other API type calls. It also handles redirects from
// old formats of the quickstart article URLs.

// DONT MESS WITH THIS UNLESS YOU KNOW WHAT YOU ARE DOING. YOU WILL BREAK THINGS.

var appTypes = {};
quickstarts.appTypes.forEach((appType) => {
  appTypes[appType.slug] = appType;
});

export default function(req, res, next) {
  var keys = []
  var re = pathToRegexp('/docs/:appType/:platform/:article?', keys)
  var parsedUrl = url.parse(req.url);
  var tokens = re.exec(parsedUrl.pathname);
  if (!tokens) {
    // No url match, return
    return next();
  }
  var appTypeSlug = tokens[1];
  var platformName = tokens[2];
  var articleName = tokens[3];

  let appType = appTypes[appTypeSlug];

  if (!appType) {
    // Not app type path, return
    return next();
  }

  let get404 = function() {
    var err = new Error('Not found.');
    err.status = 404;
    return err;
  }

  let isExternalFormat = res.locals.jsonp || res.locals.json || res.locals.embedded || res.locals.framed;

  if (!isExternalFormat && articleName) {
    // We never seved URLs in this format so we just 404
    next(get404());
  } else if (isExternalFormat && !articleName) {
    // This is to redirect backward compat external format requests (used by manage)
    var platform = _.find(platforms[appType.name], { name: platformName });
    console.log(platform)
    if (platform) {
      var article = _.find(platform.articles, { number: 1 });
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
