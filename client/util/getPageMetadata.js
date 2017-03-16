import debug from 'debug';
import { find } from 'lodash';
import strings from '../../lib/strings';

const debugClient = debug('docs:docs');

export default function getPageMetadata(quickstarts = undefined, payload = {}) {
  const { quickstartId, platformId, versionId, articleId } = payload;

  return new Promise((resolve, reject) => {
    if (!quickstartId) {
      return resolve({
        pageTitle: strings.SITE_TITLE
      });
    }

    const quickstart = quickstarts[quickstartId];
    if (!quickstart) {
      const err = new Error(`No such app type ${quickstartId}.`);
      err.statusCode = 404;
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
      const err = new Error(`No platform ${platformId} exists in the quickstart ${quickstartId}.`);
      err.statusCode = 404;
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
      const err = new Error(`No article ${articleId} exists in the platform ${platformId}.`);
      err.statusCode = 404;
      return reject(err);
    }

    return resolve({
      pageTitle: `Auth0 ${platform.title} SDK Quickstarts: ${article.title}`,
      pageDescription: article.description || platformDescription
    });
  });
}
