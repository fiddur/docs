import debug from 'debug';
import { find } from 'lodash';
import strings from '../../lib/strings';

const debugClient = debug('docs:docs');

export default function getPageMetadata(quickstarts, quickstartId, platformId, articleId) {
  return new Promise((resolve, reject) => {
    if (!quickstartId) {
      return resolve({
        pageTitle: strings.SITE_TITLE
      });
    }

    const quickstart = quickstarts[quickstartId];
    if (!quickstart) {
      const err = new Error('Invalid AppType.');
      err.status = 404;
      return reject(err);
    }

    if (!platformId) {
      return resolve({
        pageTitle: `Auth0 ${quickstart.title} Quickstarts`,
        pageDescription: `Browse ${quickstart.title.toLowerCase()} quickstarts to learn how to quickly add authentication to your app.`
      });
    }

    const platform = quickstart.platforms[platformId];
    if (!platform) {
      const err = new Error('Platform not found.');
      err.status = 404;
      return reject(err);
    }

    const platformDescription = (
      `Learn how to quickly add authentication to your ${platform.title} app. ` +
      'Authenticate with any social or enterprise identity provider.'
    );

    if (!articleId) {
      return resolve({
        pageTitle: `Auth0 ${platform.title} SDK Quickstarts`,
        pageDescription: platformDescription
      });
    }

    const article = find(platform.articles, { name: articleId });
    if (!article) {
      const err = new Error('Article not found.');
      err.status = 404;
      return reject(err);
    }

    return resolve({
      pageTitle: `Auth0 ${platform.title} SDK Quickstarts: ${article.title}`,
      pageDescription: article.description || platformDescription
    });
  });
}
