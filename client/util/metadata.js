import _ from 'lodash';
import strings from '../../lib/strings';
import debug from 'debug';

const debugClient = debug('docs:docs');

export function getPageMetadata(quickstarts, quickstartId, platformId, articleId) {
  return new Promise((resolve, reject) => {

    if (quickstartId && !quickstarts[quickstartId]) {
      var err = new Error('Invalid AppType.');
      err.status = 404;
      return reject(err);
    }

    var meta = {};
    if (quickstartId && platformId) {
      let platform = quickstarts[quickstartId].platforms[platformId];
      if (!platform) {
        var err = new Error('Platform not found.');
        err.status = 404;
        return reject(err);
      }
      let platformTitle = platform.title;
      if (!platformTitle) {
        var err = new Error('Invalid platform: title is required on the index.yml config.');
        err.status = 500;
        return reject(err);
      }
      let defaultDescription = `Learn how to quickly add authentication to your ${platformTitle} app. Authenticate with any social or enterprise identity provider.`;
      if (articleId) {
        let article = _.find(quickstarts[quickstartId].platforms[platformId].articles, { name: articleId });
        if (!article) {
          var err = new Error('Article not found.');
          err.status = 404;
          return reject(err);
        }
        let { title, description } = article;
        if (!title) {
          var err = new Error('Invalid article: title and description are required attributes.');
          err.status = 500;
          return reject(err);
        }
        if (!description) {
          debugClient(`WARNING: No description on ${platformTitle}: ${title}.`);
        }
        meta.pageTitle = `Auth0 ${platformTitle} SDK Quickstarts: ${title}`;
        meta.pageDescription = description || defaultDescription;
      } else {
        meta.pageTitle = `Auth0 ${platformTitle} SDK Quickstarts`;
        meta.pageDescription = defaultDescription;
      }
    }
    else if (quickstartId) {
      let title = quickstarts[quickstartId].title
      meta.pageTitle = `Auth0 ${title} Quickstarts`;
      meta.pageDescription = `Browse ${title.toLowerCase()} quickstarts to learn how to quickly add authentication to your app.`;
    }
    else {
      meta.pageTitle = strings.SITE_TITLE;
    }

    return resolve(meta);

  });
}