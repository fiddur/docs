import React, { PropTypes } from 'react';
import { NavLink } from 'fluxible-router';
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
        This quickstart demonstrates integration
        using <NavLink href="/docs/api-auth/tutorials/adoption">OIDC Authentication</NavLink>,
        a set of features that conforms to the <a href="http://openid.net/specs/openid-connect-core-1_0.html" target="_blank" rel="noopener noreferrer">OIDC Specification</a>.
        OIDC Authentication is the most current way to integrate Auth0 in your application,
        and it is highly recommended that you use it. If required, you can also browse this
        quickstart in <ArticleLink article={targetArticle}>legacy mode</ArticleLink>.
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
        This quickstart demonstrates integration using <strong>Legacy Authentication</strong>.
        It is highly recommended that you follow the most current set of features for integrating
        Auth0 in your application by following
        the <ArticleLink article={targetArticle}>new quickstart</ArticleLink>.
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
