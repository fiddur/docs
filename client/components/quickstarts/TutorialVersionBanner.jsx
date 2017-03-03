import React, { PropTypes } from 'react';
import { find, first } from 'lodash';
import ArticleLink from '../ArticleLink';

/*
 * Note: This banner only supports a "current" version and a "legacy" version.
 * If additional versions are added in the future, this banner must be changed
 * to provide some means to navigate between them. The rest of the system should
 * support additional versions without modification.
 */

const currentVersionBanner = (platform, article) => {
  const version = platform.previousVersions.legacy;
  const targetArticle = find(version.articles, { name: article.name }) || first(version.articles);
  return (
    <div className="auth0-notification primary">
      <i className="notification-icon icon-budicon-749" />
      <p>
        This quickstart demonstrates the most current Auth0 features and libraries, including the
        newly released APIs section. If necessary, you can follow
        the <ArticleLink article={targetArticle}>legacy version</ArticleLink>.
      </p>
    </div>
  );
};

const previousVersionBanner = (platform, version, article) => {
  const targetArticle = find(platform.articles, { name: article.name }) || first(platform.articles);
  return (
    <div className="auth0-notification warning">
      <i className="notification-icon icon-budicon-749" />
      <p>
        This quickstart demonstrates legacy Auth0 features and libraries. It is highly recommended
        that you follow the <ArticleLink article={targetArticle}>latest version</ArticleLink>.
      </p>
    </div>
  );
};

const TutorialVersionBanner = ({ platform, version, article }) => {
  if (!platform || !platform.previousVersions) {
    return null;
  }

  if (version) {
    return previousVersionBanner(platform, version, article);
  }

  return currentVersionBanner(platform, article);
};

TutorialVersionBanner.propTypes = {
  platform: PropTypes.object,
  version: PropTypes.object,
  article: PropTypes.object
};

export default TutorialVersionBanner;
